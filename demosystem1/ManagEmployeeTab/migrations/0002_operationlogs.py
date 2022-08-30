# Generated by Django 4.0.5 on 2022-08-23 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ManagEmployeeTab', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Operationlogs',
            fields=[
                ('nid', models.AutoField(primary_key=True, serialize=False)),
                ('enterprisesname', models.CharField(max_length=50)),
                ('grapename', models.CharField(max_length=50)),
                ('username', models.CharField(max_length=20)),
                ('time', models.DateTimeField()),
                ('logs', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'operationlogs',
                'managed': True,
            },
        ),
    ]
