from rest_framework.routers import DefaultRouter
from .api import (
    CompanyCredentialsViewSet,
    CompanyProfileViewSet,
    CompanyJobDescriptionViewSet,
    JobRequiredSkillsViewSet,
    JobApplicantViewSet
)


router = DefaultRouter()
router.register(r'company-credentials', CompanyCredentialsViewSet)
router.register(r'company-profiles', CompanyProfileViewSet)
router.register(r'company-jobs', CompanyJobDescriptionViewSet)
router.register(r'job-required-skills', JobRequiredSkillsViewSet)
router.register(r'job-applicants', JobApplicantViewSet)

urlpatterns = router.urls
