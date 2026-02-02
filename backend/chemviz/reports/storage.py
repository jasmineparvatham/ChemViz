from .models import Dataset

MAX_NORMAL = 10
MAX_STARRED = 10

def enforce_storage_limits(user):
    normal = Dataset.objects.filter(owner=user, is_starred=False)

    if normal.count() >= MAX_NORMAL:
        oldest = normal.order_by('created_at').first()
        oldest.csv_file.delete()
        oldest.delete()
