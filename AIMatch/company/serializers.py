from rest_framework import serializers
from .models import CompanyCredentials, CompanyProfile, CompanyJobDescription, JobRequiredSkills, Shortlist

class CompanyNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['company_name']

class CompanyJobDescriptionSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = CompanyJobDescription
        fields = '__all__'
        read_only_fields = ['company', 'job_id', 'created_at']

    def get_company_name(self, obj):
        # obj is a CompanyJobDescription instance
        # Try to get the company_name from its related CompanyProfile
        try:
            return obj.company.companyprofile.company_name
        except CompanyProfile.DoesNotExist:
            return None # Or a default value like "Unknown Company"


class CompanyCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyCredentials
        fields = '__all__'

class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
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

class ShortlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shortlist
        fields = '__all__'
