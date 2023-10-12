import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from diagram.models import Diagram


class DiagramConsumer(WebsocketConsumer):
    def connect(self):
        diagram_id = self.scope["url_route"]["kwargs"]["diagram_id"]
        self.room_group_name = f"diagram-{diagram_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

        diagram = Diagram.objects.filter(id=diagram_id).first()
        if diagram:
            serialized_diagram = diagram.content
            self.send(
                text_data=json.dumps(
                    {
                        "type": "diagram_message",
                        "serialized_diagram": serialized_diagram,
                    }
                )
            )

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)

        serialized_diagram = text_data_json["serialized_diagram"]

        diagram_id = self.scope["url_route"]["kwargs"]["diagram_id"]
        diagram = Diagram.objects.filter(id=diagram_id).first()
        if diagram:
            diagram.content = serialized_diagram
            diagram.save()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {"type": "diagram_message", "serialized_diagram": serialized_diagram},
        )

    def diagram_message(self, event):
        serialized_diagram = event["serialized_diagram"]

        self.send(
            text_data=json.dumps(
                {"type": "diagram_message", "serialized_diagram": serialized_diagram}
            )
        )
