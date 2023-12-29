import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from task_management.models import Task, Subtask, Diagram
from task_management.serializer import SubtaskSerializer


class TaskConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None

    def connect(self):
        self.user = self.scope["user"]

        task_id = self.scope["url_route"]["kwargs"]["task_id"]
        self.room_group_name = f"task-{task_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

        task: Task = Task.objects.filter(id=task_id).first()
        if task:
            serializer = SubtaskSerializer(Subtask.objects.filter(task=task), many=True)

            self.send(
                text_data=json.dumps(
                    {
                        "type": "task_message",
                        "subtasks": serializer.data,
                        "task": {
                            "id": task.id,
                            "group": task.group.name,
                            "description": task.description,
                            "created_by": task.created_by.username,
                            "status": task.status,
                        },
                    }
                )
            )

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        task_id = self.scope["url_route"]["kwargs"]["task_id"]
        task = Task.objects.filter(id=task_id).first()

        message_type = text_data_json["type"]

        if message_type == "add_subtask":
            subtasks = Subtask.objects.filter(task=task)

            order = 0
            if subtasks:
                order = max([subtask.order for subtask in subtasks]) + 1

            description = text_data_json["description"]

            Subtask.objects.create(
                task=task,
                description=description,
                order=order,
                created_by=self.scope["user"],
            )

        if message_type == "delete_subtask":
            subtask_id = text_data_json["subtask_id"]
            Subtask.objects.filter(id=subtask_id).delete()

        if message_type == "reorder_subtasks":
            new_ordered_subtasks = text_data_json["subtasks"]

            for subtask_from_request in new_ordered_subtasks:
                subtask_from_db = Subtask.objects.filter(
                    id=subtask_from_request["id"]
                ).first()
                subtask_from_db.order = subtask_from_request["order"]
                subtask_from_db.save()

        if message_type == "submit_subtasks":
            task.status = Task.MODELLING
            task.save()

        serializer = SubtaskSerializer(Subtask.objects.filter(task=task), many=True)

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "task_message",
                "subtasks": serializer.data,
                "task": {
                    "id": task.id,
                    "group": task.group.name,
                    "description": task.description,
                    "created_by": task.created_by.username,
                    "status": task.status,
                },
            },
        )

    def task_message(self, event):
        subtasks = event["subtasks"]
        task = event["task"]

        self.send(
            text_data=json.dumps(
                {"type": "task_message", "subtasks": subtasks, "task": task}
            )
        )


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
            serialized_diagram = diagram.data
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
        diagram: Diagram = Diagram.objects.filter(id=diagram_id).first()
        if diagram:
            diagram.data = serialized_diagram
            diagram.save()

        type = text_data_json.get("type")
        if type == "diagram_finished":
            subtask_id = text_data_json["subtask_id"]
            subtask = Subtask.objects.filter(id=subtask_id).first()
            subtask.status = Subtask.DONE
            subtask.save()

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {"type": "diagram_finished"},
            )

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {"type": "diagram_message", "serialized_diagram": serialized_diagram},
        )

    def diagram_finished(self, event):
        self.send(text_data=json.dumps({"type": "diagram_finished"}))

    def diagram_message(self, event):
        serialized_diagram = event["serialized_diagram"]

        self.send(
            text_data=json.dumps(
                {"type": "diagram_message", "serialized_diagram": serialized_diagram}
            )
        )


class PresentationConsumer(WebsocketConsumer):
    def connect(self):
        subtask_id = self.scope["url_route"]["kwargs"]["subtask_id"]
        self.room_group_name = f"presentation-{subtask_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "new_user_connected",
            },
        )

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)

        current_selected_diagram = text_data_json["current_selected_diagram"]

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "change_diagram",
                "current_selected_diagram": current_selected_diagram,
            },
        )

    def new_user_connected(self, event):
        self.send(text_data=json.dumps({"type": "new_user_connected"}))

    def change_diagram(self, event):
        current_selected_diagram = event["current_selected_diagram"]

        self.send(
            text_data=json.dumps(
                {
                    "type": "change_diagram",
                    "current_selected_diagram": current_selected_diagram,
                }
            )
        )
