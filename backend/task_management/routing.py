from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path(
        r"ws/task-socket-server/<int:task_id>/",
        consumers.TaskConsumer.as_asgi(),
    ),
    path(
        r"ws/diagram-socket-server/<int:diagram_id>/",
        consumers.DiagramConsumer.as_asgi(),
    ),
]
