from rest_framework.routers import DefaultRouter
from .api import (
    UserCredentialsViewSet,
    UserProfileViewSet,
    UserSkillsViewSet,
    UserApplicationViewSet
)

router = DefaultRouter()
router.register(r'user-credentials', UserCredentialsViewSet)
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'user-skills', UserSkillsViewSet)
router.register(r'user-applications', UserApplicationViewSet)


from django.urls import path
from .api import upload_resume

urlpatterns = router.urls
urlpatterns += [
    path('upload_resume/', upload_resume, name='upload_resume'),
]
