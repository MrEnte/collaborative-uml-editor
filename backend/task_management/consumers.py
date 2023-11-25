import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from diagram.models import Diagram
from task_management.models import Task, Subtask


class TaskConsumer(WebsocketConsumer):
    def connect(self):
        task_id = self.scope["url_route"]["kwargs"]["task_id"]
        self.room_group_name = f"task-{task_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

        task: Task = Task.objects.filter(id=task_id).first()
        if task:
            subtasks = Subtask.objects.filter(task=task).values(
                "id", "description", "order", "created_by__username"
            )

            self.send(
                text_data=json.dumps(
                    {
                        "type": "task_message",
                        "subtasks": list(subtasks),
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
            print(new_ordered_subtasks)

            for subtask_from_request in new_ordered_subtasks:
                subtask_from_db = Subtask.objects.filter(
                    id=subtask_from_request["id"]
                ).first()
                subtask_from_db.order = subtask_from_request["order"]
                subtask_from_db.save()

        if message_type == "submit_subtasks":
            task.status = Task.MODELLING
            task.save()

        subtasks = Subtask.objects.filter(task=task).values(
            "id", "description", "order", "created_by__username"
        )

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "task_message",
                "subtasks": list(subtasks),
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
