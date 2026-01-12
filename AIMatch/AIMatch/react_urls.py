from django.views.generic import TemplateView
from django.urls import path

class ReactAppView(TemplateView):
    template_name = "index.html"

urlpatterns = [
    path('', ReactAppView.as_view(), name='react_app'),
]
