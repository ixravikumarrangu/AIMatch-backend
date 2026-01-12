from rest_framework import serializers
from .models import CompanyCredentials, CompanyProfile, CompanyJobDescription, JobRequiredSkills

class CompanyCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyCredentials
        fields = '__all__'

class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = '__all__'

class CompanyJobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyJobDescription
        fields = '__all__'


class JobRequiredSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRequiredSkills
        fields = '__all__'

# Serializer for JobApplicant
from .models import JobApplicant

class JobApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplicant
        fields = '__all__'
