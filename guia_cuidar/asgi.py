"""
ASGI config for guia_cuidar project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'guia_cuidar.settings')

application = get_asgi_application()