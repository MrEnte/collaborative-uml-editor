from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from diagram.models import Diagram
from diagram.serializer import DiagramSerializer, DiagramListSerializer


@api_view(["GET"])
def list_diagrams(request):
    serializer = DiagramListSerializer(Diagram.objects.all(), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_diagram(request, id=0):
    if not id:
        return Response({"error": "No id provided"}, status=status.HTTP_400_BAD_REQUEST)

    diagram = Diagram.objects.filter(id=id)
    if not diagram:
        return Response(
            {"error": f"Diagram with id {id} not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = DiagramSerializer(diagram.first())

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )
