from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from task_management.models import Group, Task, Diagram, Subtask
from task_management.serializer import (
    GroupListSerializer,
    GroupSerializer,
    TaskSerializer,
    DiagramSerializer,
    SubtaskSerializer,
)


class GroupViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        serializer = GroupListSerializer(Group.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        if not pk:
            return Response(
                {"error": "No id provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        diagram = Group.objects.filter(id=pk)
        if not diagram:
            return Response(
                {"error": f"Diagram with id {pk} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = GroupSerializer(diagram.first())

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def create(self, request):
        data = request.data
        data["created_by"] = request.user.id

        serializer = GroupSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


class TaskViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def create(self, request, group_pk=None):
        if group_pk is None:
            return Response(
                {"error": "No group id provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        group = Group.objects.filter(id=group_pk).first()

        data = request.data
        data["created_by"] = request.user.id

        serializer = TaskSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(group=group)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, group_pk=None, pk=None):
        if not pk:
            return Response(
                {"error": "No id provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        task = Task.objects.filter(id=pk)
        if not task:
            return Response(
                {"error": f"Task with id {pk} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TaskSerializer(task.first())

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"], url_path="diagram-merging")
    def diagram_merging(self, request, group_pk=None, pk=None):
        if pk is None:
            return Response(
                {"error": "No task id provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        task = Task.objects.filter(id=pk).first()

        task_content_type = ContentType.objects.get_for_model(Task)
        diagram, _ = Diagram.objects.get_or_create(
            content_type=task_content_type,
            object_id=task.id,
        )

        serializer = DiagramSerializer(diagram)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


class SubtaskViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, group_pk=None, task_pk=None, pk=None):
        if pk is None:
            return Response(
                {"error": "No subtask id provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subtask = Subtask.objects.filter(id=pk).first()

        serializer = SubtaskSerializer(subtask)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"], url_path="diagram")
    def diagram(self, request, group_pk=None, task_pk=None, pk=None):
        if pk is None:
            return Response(
                {"error": "No subtask id provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subtask: Subtask = Subtask.objects.filter(id=pk).first()
        task = subtask.task
        diagram_of_task = Diagram.objects.filter(
            content_type=ContentType.objects.get_for_model(Task),
            object_id=task.id,
        ).first()

        user = request.user

        subtask_content_type = ContentType.objects.get_for_model(Subtask)

        defaults = dict()
        if diagram_of_task:
            defaults = dict(
                data=diagram_of_task.data,
            )
        diagram, _ = Diagram.objects.get_or_create(
            created_by=user,
            content_type=subtask_content_type,
            object_id=subtask.id,
            defaults=defaults,
        )

        serializer = DiagramSerializer(diagram)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"], url_path="diagram-presentation")
    def diagram_presentation(self, request, group_pk=None, task_pk=None, pk=None):
        if pk is None:
            return Response(
                {"error": "No subtask id provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subtask = Subtask.objects.filter(id=pk).first()

        subtask_content_type = ContentType.objects.get_for_model(Subtask)
        diagrams = Diagram.objects.filter(
            content_type=subtask_content_type,
            object_id=subtask.id,
        )

        subtask_serializer = SubtaskSerializer(subtask)
        diagram_serializer = DiagramSerializer(diagrams, many=True)

        response_data = {
            **subtask_serializer.data,
            "diagrams": diagram_serializer.data,
        }

        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
        )
