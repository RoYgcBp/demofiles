# Generated by Django 4.0.5 on 2022-08-22 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Adminrelations',
            fields=[
                ('nid', models.AutoField(primary_key=True, serialize=False)),
                ('enterprisesname', models.CharField(max_length=50)),
                ('grapename', models.CharField(max_length=50)),
                ('subgrape', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'adminrelations',
                'managed': True,
            },
        ),
    ]
