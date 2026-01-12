from rest_framework import viewsets
from .models import CompanyCredentials, CompanyProfile, CompanyJobDescription, JobRequiredSkills, JobApplicant
from .serializers import (
    CompanyCredentialsSerializer,
    CompanyProfileSerializer,
    CompanyJobDescriptionSerializer,
    JobRequiredSkillsSerializer,
    JobApplicantSerializer
)

class CompanyCredentialsViewSet(viewsets.ModelViewSet):
    queryset = CompanyCredentials.objects.all()
    serializer_class = CompanyCredentialsSerializer

class CompanyProfileViewSet(viewsets.ModelViewSet):
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanyProfileSerializer

class CompanyJobDescriptionViewSet(viewsets.ModelViewSet):
    queryset = CompanyJobDescription.objects.all()
    serializer_class = CompanyJobDescriptionSerializer


class JobRequiredSkillsViewSet(viewsets.ModelViewSet):
    queryset = JobRequiredSkills.objects.all()
    serializer_class = JobRequiredSkillsSerializer

# ViewSet for JobApplicant
class JobApplicantViewSet(viewsets.ModelViewSet):
    queryset = JobApplicant.objects.all()
    serializer_class = JobApplicantSerializer
