
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from company.api import (
    CompanyCredentialsViewSet,
    CompanyProfileViewSet,
    CompanyJobDescriptionViewSet,
    JobRequiredSkillsViewSet,
    get_job_applicants,
)

router = DefaultRouter()
router.register(r"company-credentials", CompanyCredentialsViewSet)
router.register(r"company-profiles", CompanyProfileViewSet)
router.register(r"company-jobs", CompanyJobDescriptionViewSet)
router.register(r"job-required-skills", JobRequiredSkillsViewSet)

urlpatterns = [
    path("", include(router.urls)),

    # 🔥 Company job → applicants
    path("jobs/<int:job_id>/applications/", get_job_applicants),
]
