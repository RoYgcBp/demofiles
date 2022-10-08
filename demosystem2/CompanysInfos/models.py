from django.db import models

# Create your models here.

# 所有公司的信息
class Companys(models.Model):
    nid = models.AutoField(primary_key=True)
    companyName = models.CharField(max_length=50)
    companyEmail = models.CharField(max_length=50)
    companyAddress = models.CharField(max_length=255)
    companyTele = models.CharField(max_length=255)
    companyResume = models.CharField(max_length=400)
    salt = models.CharField(max_length=10)
    hash = models.CharField(db_column='HASH', max_length=32)

    class Meta:
        managed = True
        db_table = "Companys"





