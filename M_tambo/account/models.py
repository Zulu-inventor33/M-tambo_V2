from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, phone_number, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, phone_number=phone_number, **extra_fields)
        user.set_password(password)  # Properly hash the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone_number, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, phone_number, password, **extra_fields)


# Custom User Model
class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    account_type = models.CharField(max_length=50, choices=[('developer', 'Developer'), ('maintenance', 'Maintenance'), ('technician', 'Technician')])
    created_at = models.DateTimeField(default=timezone.now)

    # Additional fields for authentication and permissions
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number', 'first_name', 'last_name']

    def __str__(self):
        return self.email


# Developer Model
class Developer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='developer_profile')
    developer_name = models.CharField(max_length=100)
    address = models.TextField()

    def __str__(self):
        return self.developer_name


# Maintenance Model
class Maintenance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='maintenance_profile')
    company_name = models.CharField(max_length=100)
    company_address = models.TextField()
    company_registration_number = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)  # Directly store the specialization as a string

    def __str__(self):
        return self.company_name


class Technician(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='technician_profile')
    specialization = models.CharField(max_length=100)  # Directly store the specialization as a string
    maintenance_company = models.ForeignKey(Maintenance, on_delete=models.CASCADE, related_name='technicians',null=False)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"