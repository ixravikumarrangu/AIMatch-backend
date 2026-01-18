
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

from company.api import (
    CompanyCredentialsViewSet,
    CompanyProfileViewSet,
    CompanyJobDescriptionViewSet,
    JobRequiredSkillsViewSet,
    get_job_applicants,
    login_company
)

from .views import send_shortlist_emails_view

router = DefaultRouter()
router.register(r"company-credentials", CompanyCredentialsViewSet)
router.register(r"company-profiles", CompanyProfileViewSet)
router.register(r"company-jobs", CompanyJobDescriptionViewSet)
router.register(r"job-required-skills", JobRequiredSkillsViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("login/", login_company, name="company_login"),

    # 🔥 Company job → applicants
    path("jobs/<int:job_id>/applications/", get_job_applicants),
    path("send-shortlist-emails/", views.send_shortlist_emails_view, name="send_shortlist_emails"),
]
