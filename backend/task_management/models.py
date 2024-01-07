from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Group(models.Model):
    name = models.CharField(max_length=200, help_text="Name of the group")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="app_groups"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Group"
        verbose_name_plural = "Groups"

    def __str__(self):
        return self.name


class Task(models.Model):
    ANALYSING = "ANALYSING"
    MODELLING = "MODELLING"
    DONE = "DONE"

    STATUS_CHOICES = [
        (ANALYSING, "Analysing"),
        (MODELLING, "Modelling"),
        (DONE, "Done"),
    ]

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="tasks")
    description = models.TextField(help_text="Description of the task")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=ANALYSING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"

    def __str__(self):
        return self.description


class Subtask(models.Model):
    CREATED = "CREATED"
    IN_PROGRESS = "IN_PROGRESS"
    PRESENTING = "PRESENTING"
    DONE = "DONE"

    STATUS_CHOICES = [
        (CREATED, "Created"),
        (IN_PROGRESS, "In progress"),
        (PRESENTING, "Presenting"),
        (DONE, "Done"),
    ]

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="subtasks")
    description = models.TextField(help_text="Description of the subtask")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subtasks"
    )
    order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=CREATED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Subtask"
        verbose_name_plural = "Subtasks"
        ordering = ["order", "id"]

    def __str__(self):
        return self.description


class Diagram(models.Model):
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="diagrams",
        null=True,
        blank=True,
    )
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    data = models.JSONField(default=dict, help_text="Data for the diagram")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Diagram"
        verbose_name_plural = "Diagrams"

    def __str__(self):
        return f"Diagram {self.id} by {self.created_by.username if self.created_by else 'Anonymous'}"
