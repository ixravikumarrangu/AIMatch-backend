
from django.db import models

class UserCredentials(models.Model):
	user_id = models.BigAutoField(primary_key=True)
	email = models.EmailField(max_length=255, unique=True)
	password_hash = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	@property
	def is_authenticated(self):
		return True

	class Meta:
		db_table = 'user_credentials'


class UserProfile(models.Model):
	user = models.OneToOneField(UserCredentials, on_delete=models.CASCADE, primary_key=True)
	name = models.CharField(max_length=150)
	email = models.EmailField(max_length=255)
	phone = models.CharField(max_length=20, blank=True, null=True)
	address = models.CharField(max_length=255, blank=True, null=True)
	experience = models.CharField(max_length=255, blank=True, null=True)
	skills = models.TextField(blank=True, null=True)
	education = models.TextField(blank=True, null=True)
	about = models.TextField(blank=True, null=True)
	resume_text = models.TextField(blank=True, null=True)  # Store PDF extracted text
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = 'user_profile'

class UserSkills(models.Model):
	skill_id = models.BigAutoField(primary_key=True)
	user = models.ForeignKey(UserCredentials, on_delete=models.CASCADE)
	skill_name = models.CharField(max_length=100)

	class Meta:
		db_table = 'user_skills'
		unique_together = ('user', 'skill_name')

class UserApplication(models.Model):
	application_id = models.BigAutoField(primary_key=True)
	user = models.ForeignKey(UserCredentials, on_delete=models.CASCADE)
	job = models.ForeignKey('company.CompanyJobDescription', on_delete=models.CASCADE)
	application_status = models.CharField(max_length=30)
	ats_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
	applied_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'user_application'
		unique_together = ('user', 'job')
