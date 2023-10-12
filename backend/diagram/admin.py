from django.contrib import admin

# Register your models here.

from .models import Diagram


@admin.register(Diagram)
class DiagramAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_by", "created_at", "updated_at")
