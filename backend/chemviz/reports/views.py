import os
import csv
from datetime import datetime

from django.conf import settings
from django.http import FileResponse, HttpResponse
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from analytics.summary import generate_full_analytics
from analytics.comparison import compare_two_csvs

from .models import Dataset, Report
from .serializers import ReportSerializer, DatasetSerializer
from .storage import enforce_storage_limits
from .upload_serializers import UploadCSVSerializer


# -----------------------------
# Upload (Public + Auth)
# -----------------------------
class UploadCSVView(GenericAPIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = UploadCSVSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        csv_file = serializer.validated_data["file"]

        owner = request.user if request.user.is_authenticated else None
        if owner:
            enforce_storage_limits(owner)

        dataset = Dataset.objects.create(
            owner=owner,
            name=csv_file.name,
            csv_file=csv_file
        )

        result = generate_full_analytics(dataset.csv_file.path)

        if result["summary"] is None:
            dataset.csv_file.delete(save=False)
            dataset.delete()
            return Response(
                {"error": "Invalid CSV", "warnings": result["warnings"]},
                status=status.HTTP_400_BAD_REQUEST
            )

        summary = result["summary"]

        report = Report.objects.create(
            dataset=dataset,
            total_equipment=summary["total_equipment"],
            avg_flowrate=summary["avg_flowrate"],
            avg_pressure=summary["avg_pressure"],
            avg_temperature=summary["avg_temperature"],
            equipment_distribution=summary["equipment_distribution"],
            warnings=result["warnings"],
            analytics=result["analytics"],
        )

        return Response(ReportSerializer(report).data, status=status.HTTP_201_CREATED)


# -----------------------------
# History (Auth only)
# -----------------------------
class UserReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        datasets = Dataset.objects.filter(owner=request.user).order_by("-created_at")
        return Response(DatasetSerializer(datasets, many=True).data)


# -----------------------------
# Star / Unstar (Auth only)
# -----------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def star_report(request, dataset_id):
    dataset = get_object_or_404(Dataset, id=dataset_id, owner=request.user)
    dataset.is_starred = True
    dataset.save(update_fields=["is_starred"])
    return Response({"status": "starred"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unstar_report(request, dataset_id):
    dataset = get_object_or_404(Dataset, id=dataset_id, owner=request.user)
    dataset.is_starred = False
    dataset.save(update_fields=["is_starred"])
    return Response({"status": "unstarred"})


# -----------------------------
# Compare Saved (Auth only)
# -----------------------------
class CompareSavedDatasetsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id1, id2):
        ds1 = get_object_or_404(Dataset, id=id1, owner=request.user)
        ds2 = get_object_or_404(Dataset, id=id2, owner=request.user)

        result = compare_two_csvs(ds1.csv_file.path, ds2.csv_file.path)
        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)


# -----------------------------
# Compare Temp (Public)
# -----------------------------
class CompareTempView(GenericAPIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_a = request.FILES.get("file_a")
        file_b = request.FILES.get("file_b")

        if not file_a or not file_b:
            return Response(
                {"error": "Both file_a and file_b are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        ds_a = Dataset.objects.create(owner=None, name=file_a.name, csv_file=file_a)
        ds_b = Dataset.objects.create(owner=None, name=file_b.name, csv_file=file_b)

        result = compare_two_csvs(ds_a.csv_file.path, ds_b.csv_file.path)

        ds_a.csv_file.delete(save=False)
        ds_b.csv_file.delete(save=False)
        ds_a.delete()
        ds_b.delete()

        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)


# -----------------------------
# PDF (Public for public datasets; Auth+owner for saved)
# -----------------------------
class ReportPDFView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, dataset_id):
        dataset = get_object_or_404(Dataset, id=dataset_id)

        if dataset.owner is not None:
            if not request.user.is_authenticated or dataset.owner != request.user:
                return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        report = get_object_or_404(Report, dataset=dataset)

        os.makedirs(os.path.join(settings.MEDIA_ROOT, "pdfs"), exist_ok=True)
        pdf_path = os.path.join(settings.MEDIA_ROOT, "pdfs", f"chemviz_report_{dataset_id}.pdf")

        c = canvas.Canvas(pdf_path, pagesize=A4)
        width, height = A4

        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, height - 60, "ChemViz")
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 80, "Chemical Equipment Analytics Report")

        c.setFont("Helvetica", 10)
        c.drawString(50, height - 100, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        y = height - 140
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "Summary")
        y -= 20

        c.setFont("Helvetica", 11)
        c.drawString(50, y, f"Total Equipment: {report.total_equipment}"); y -= 18
        c.drawString(50, y, f"Average Flowrate: {report.avg_flowrate:.2f}"); y -= 18
        c.drawString(50, y, f"Average Pressure: {report.avg_pressure:.2f}"); y -= 18
        c.drawString(50, y, f"Average Temperature: {report.avg_temperature:.2f}"); y -= 24

        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "Type Distribution"); y -= 18
        c.setFont("Helvetica", 11)
        for t, cnt in report.equipment_distribution.items():
            c.drawString(60, y, f"{t}: {cnt}")
            y -= 16
            if y < 80:
                c.showPage()
                y = height - 60

        if report.warnings:
            y -= 10
            c.setFont("Helvetica-Bold", 12)
            c.drawString(50, y, "Warnings"); y -= 18
            c.setFont("Helvetica", 11)
            for w in report.warnings:
                c.drawString(60, y, f"- {w}")
                y -= 16
                if y < 80:
                    c.showPage()
                    y = height - 60

        c.save()
        response = FileResponse(open(pdf_path, "rb"), content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="chemviz_report_{dataset_id}.pdf"'
        return response


# -----------------------------
# Summary CSV
# -----------------------------
class SummaryCSVView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, dataset_id):
        dataset = get_object_or_404(Dataset, id=dataset_id)

        if dataset.owner is not None:
            if not request.user.is_authenticated or dataset.owner != request.user:
                return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        report = get_object_or_404(Report, dataset=dataset)

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="chemviz_summary_{dataset_id}.csv"'
        writer = csv.writer(response)

        writer.writerow(["Metric", "Value"])
        writer.writerow(["Total Equipment", report.total_equipment])
        writer.writerow(["Average Flowrate", f"{report.avg_flowrate:.2f}"])
        writer.writerow(["Average Pressure", f"{report.avg_pressure:.2f}"])
        writer.writerow(["Average Temperature", f"{report.avg_temperature:.2f}"])

        return response
