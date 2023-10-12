from rest_framework import serializers

from diagram.models import Diagram


class DiagramSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.username")
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Diagram
        exclude = ["updated_at"]


class DiagramListSerializer(DiagramSerializer):
    class Meta:
        model = Diagram
        fields = ["id", "name", "created_by", "created_at"]
