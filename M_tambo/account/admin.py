from django.contrib import admin
from .models import User, Developer, Maintenance, Technician

# Register all models at once
for model in [User, Developer, Maintenance, Technician]:
    admin.site.register(model)
