from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Dataset, Report

admin.site.register(Dataset)
admin.site.register(Report)
