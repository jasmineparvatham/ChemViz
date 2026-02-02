from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Dataset(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    csv_file = models.FileField(upload_to='datasets/')
    created_at = models.DateTimeField(auto_now_add=True)
    is_starred = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Report(models.Model):
    dataset = models.OneToOneField(Dataset, on_delete=models.CASCADE, related_name='report')
    total_equipment = models.IntegerField()
    avg_flowrate = models.FloatField()
    avg_pressure = models.FloatField()
    avg_temperature = models.FloatField()
    equipment_distribution = models.JSONField()
    warnings = models.JSONField(default=list)         # NEW
    analytics = models.JSONField(default=dict)        # NEW
    created_at = models.DateTimeField(auto_now_add=True)
