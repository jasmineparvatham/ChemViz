from django.urls import path
from .views import (
    UploadCSVView, UserReportsView,
    star_report, unstar_report,
    CompareSavedDatasetsView, CompareTempView,
    ReportPDFView, SummaryCSVView,
)

urlpatterns = [
    path("upload/", UploadCSVView.as_view()),
    path("history/", UserReportsView.as_view()),
    path("compare/<int:id1>/<int:id2>/", CompareSavedDatasetsView.as_view()),
    path("compare-temp/", CompareTempView.as_view()),

    path("<int:dataset_id>/star/", star_report),
    path("<int:dataset_id>/unstar/", unstar_report),

    path("<int:dataset_id>/pdf/", ReportPDFView.as_view()),
    path("<int:dataset_id>/summary.csv/", SummaryCSVView.as_view()),
]
