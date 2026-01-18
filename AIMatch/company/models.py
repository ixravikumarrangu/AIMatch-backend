
from django.db import models
#from AIMatch.user.models import UserCredentials

class CompanyCredentials(models.Model):
	company_id = models.BigAutoField(primary_key=True)
	email = models.EmailField(max_length=255, unique=True)
	password_hash = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	@property
	def is_authenticated(self):
		return True

	class Meta:
		db_table = 'company_credentials'

class CompanyProfile(models.Model):
	company = models.OneToOneField(CompanyCredentials, on_delete=models.CASCADE, primary_key=True)
	company_name = models.CharField(max_length=200)
	description = models.TextField(blank=True, null=True)
	website = models.CharField(max_length=255, blank=True, null=True)
	email = models.EmailField(max_length=255, blank=True, null=True)
	phone = models.CharField(max_length=50, blank=True, null=True)
	address = models.CharField(max_length=255, blank=True, null=True)
	industry = models.CharField(max_length=100, blank=True, null=True)
	company_size = models.CharField(max_length=50, blank=True, null=True)
	founded_year = models.CharField(max_length=10, blank=True, null=True)
	benefits = models.TextField(blank=True, null=True)
	culture = models.TextField(blank=True, null=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = 'company_profile'

class CompanyJobDescription(models.Model):
	job_id = models.BigAutoField(primary_key=True)
	company = models.ForeignKey(CompanyCredentials, on_delete=models.CASCADE)
	job_title = models.CharField(max_length=200)
	location = models.CharField(max_length=200)
	salary = models.CharField(max_length=100)
	employment_type = models.CharField(max_length=50)
	experience_level = models.CharField(max_length=100)
	job_description = models.TextField(blank=True, null=True)
	responsibilities = models.TextField(blank=True, null=True)
	requirements = models.TextField(blank=True, null=True)
	skills = models.TextField(blank=True, null=True)
	benefits = models.TextField(blank=True, null=True, default='Intern')
	status = models.CharField(max_length=30, blank=True, null=True)
	deadline = models.DateField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'company_job_description'


class JobRequiredSkills(models.Model):
	id = models.BigAutoField(primary_key=True)
	job = models.ForeignKey(CompanyJobDescription, on_delete=models.CASCADE)
	skill_name = models.CharField(max_length=100)
	priority = models.IntegerField(null=True, blank=True)

	class Meta:
		db_table = 'job_required_skills'
		unique_together = ('job', 'skill_name')

# New model for dashboard candidates
class JobApplicant(models.Model):
	applicant_id = models.BigAutoField(primary_key=True)
	job = models.ForeignKey(CompanyJobDescription, on_delete=models.CASCADE)
	name = models.CharField(max_length=150)
	email = models.EmailField(max_length=255)
	resume_title = models.CharField(max_length=200)
	experience = models.CharField(max_length=50)
	skills = models.JSONField(default=list)  # Store as array
	ats_score = models.IntegerField()
	applied_date = models.DateField()
	status = models.CharField(max_length=30)

	class Meta:
		db_table = 'job_applicant'


class Shortlist(models.Model):
	shortlist_id = models.BigAutoField(primary_key=True)
	user = models.ForeignKey('user.UserCredentials', on_delete=models.CASCADE)
	job = models.ForeignKey(CompanyJobDescription, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'shortlist'
		unique_together = ('user', 'job')
