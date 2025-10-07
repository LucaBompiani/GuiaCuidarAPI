"""
URL configuration for guia_cuidar project.
"""
from django.contrib import admin
from django.urls import path
from app.api.v1.main import api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', api.urls),
]
