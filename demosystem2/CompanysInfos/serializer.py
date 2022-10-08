from string import ascii_letters,digits
from random import sample
from hashlib import md5
from rest_framework import serializers

from .models import Companys

class CompanysModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Companys
        #fields = "__all__"
        exclude = ["nid","salt"]
    
    # 制作密码
    # http://127.0.0.1:8000/companys/info/
    def create(self, validated_data):
        salt = "".join((sample(ascii_letters+digits,3)))
        validated_data["salt"] = salt
        passwordplus = validated_data["hash"] + salt
        validated_data["hash"] = md5(passwordplus.encode('utf8')).hexdigest()
        return super().create(validated_data)

    # 修改账户密码需要先登陆获取nid
    # http://127.0.0.1:8000/companys/info/(?P/<pk>\d+)/
    def update(self, instance, validated_data):
        salt = "".join((sample(ascii_letters+digits,3)))
        validated_data["salt"] = salt
        passwordplus = validated_data["hash"] + salt
        validated_data["hash"] = md5(passwordplus.encode('utf8')).hexdigest()
        return super().update(instance, validated_data)

