from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class Diagram(models.Model):
    name = models.CharField(max_length=200)
    content = models.JSONField(default=dict)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
