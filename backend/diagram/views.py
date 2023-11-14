from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from diagram.models import Diagram
from diagram.serializer import DiagramSerializer, DiagramListSerializer


class DiagrammViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        serializer = DiagramListSerializer(Diagram.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        if not pk:
            return Response(
                {"error": "No id provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        diagram = Diagram.objects.filter(id=pk)
        if not diagram:
            return Response(
                {"error": f"Diagram with id {pk} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = DiagramSerializer(diagram.first())

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
