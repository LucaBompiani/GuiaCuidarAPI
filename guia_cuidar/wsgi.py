"""
WSGI config for guia_cuidar project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'guia_cuidar.settings')

application = get_wsgi_application()
