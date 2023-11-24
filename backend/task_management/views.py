from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from task_management.models import Group
from task_management.serializer import (
    GroupListSerializer,
    GroupSerializer,
    TaskSerializer,
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
