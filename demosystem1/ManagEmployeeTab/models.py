from django.db import models

# Create your models here.

class Adminrelations(models.Model):
    nid = models.AutoField(primary_key=True)
    enterprisesname = models.CharField(max_length=50)
    grapename = models.CharField(max_length=50)
    subgrape = models.CharField(max_length=50)

    class Meta:
        managed = True
        db_table = 'adminrelations'

class Operationlogs(models.Model):
    nid = models.AutoField(primary_key=True)
    enterprisesname = models.CharField(max_length=50)
    grapename = models.CharField(max_length=50)
    username = models.CharField(max_length=20)
    time = models.DateTimeField()
    logs = models.CharField(max_length=255)
    
    class Meta:
        managed = True
        db_table = 'operationlogs'