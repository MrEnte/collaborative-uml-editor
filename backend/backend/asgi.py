"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

from backend.channelsmiddleware import JwtAuthMiddlewareStack
from chat.routing import websocket_urlpatterns as chat_websocket_urlpatterns
from task_management.routing import (
    websocket_urlpatterns as task_management_websocket_urlpatterns,
)


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            JwtAuthMiddlewareStack(
                URLRouter(
                    [
                        *chat_websocket_urlpatterns,
                        *task_management_websocket_urlpatterns,
                    ]
                )
            )
        ),
    }
)
