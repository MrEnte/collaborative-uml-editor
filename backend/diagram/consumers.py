import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class DiagramConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'diagram'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)

        serialized_diagram = text_data_json['serialized_diagram']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'diagram_message',
                'serialized_diagram': serialized_diagram
            }
        )

    def diagram_message(self, event):
        serialized_diagram = event['serialized_diagram']

        self.send(text_data=json.dumps({
            'type': 'diagram_message',
            'serialized_diagram': serialized_diagram
        }))
