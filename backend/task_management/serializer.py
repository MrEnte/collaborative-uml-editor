from rest_framework import serializers

from task_management.models import Group, Task, Subtask, Diagram


class TaskSerializer(serializers.ModelSerializer):
    group = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = Task
        fields = "__all__"


class TaskListSerializer(TaskSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = Task
        fields = ["id", "description", "created_by", "created_at"]


class GroupSerializer(serializers.ModelSerializer):
    tasks = TaskListSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = "__all__"


class GroupListSerializer(GroupSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = Group
        fields = ["id", "name", "created_by", "created_at"]


class SubtaskSerializer(serializers.ModelSerializer):
    task = serializers.CharField(source="task.description", read_only=True)
    created_by = serializers.CharField(source="created_by.username", read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = Subtask
        fields = "__all__"


class DiagramSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = Diagram
        fields = "__all__"
