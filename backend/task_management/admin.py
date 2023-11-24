from django.contrib import admin

from task_management.models import Diagram, Task, Subtask, Group


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_by", "created_at")


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "created_by", "created_at")


@admin.register(Subtask)
class SubtaskAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "created_by", "created_at")


@admin.register(Diagram)
class DiagramAdmin(admin.ModelAdmin):
    list_display = ("id", "created_by", "created_at")
