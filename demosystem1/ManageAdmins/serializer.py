from string import ascii_letters,digits
from random import sample
from hashlib import md5
from rest_framework import serializers

from ManageAdmins.models import Enterprises,Subadmins

# 新公司注册修改总管理员账户
class EnterprisesModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enterprises
        exclude = ["nid","salt"]

    def create(self, validated_data):
        salt = "".join((sample(ascii_letters+digits,3)))
        validated_data["salt"] = salt
        usernameplus = salt + validated_data["username"] 
        passwordplus = validated_data["hash"] + salt
        validated_data["username"] = md5(usernameplus.encode('utf8')).hexdigest()[0:20]
        validated_data["hash"] = md5(passwordplus.encode('utf8')).hexdigest()
        return super().create(validated_data)

    # 修改账户密码需要先登陆获取nid
    # http://127.0.0.1:8000/madmin/enterprises/(?P/<pk>\d+)/
    def update(self, instance, validated_data):
        salt = "".join((sample(ascii_letters+digits,3)))
        validated_data["salt"] = salt
        usernameplus = salt + validated_data["username"] 
        passwordplus = validated_data["hash"] + salt
        validated_data["username"] = md5(usernameplus.encode('utf8')).hexdigest()[0:20]
        validated_data["hash"] = md5(passwordplus.encode('utf8')).hexdigest()
        return super().update(instance, validated_data)



# 下辖管理员账户总库
class SubadminsModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subadmins
        exclude = ["nid","salt"]

    def create(self, validated_data):
        salt = "".join((sample(ascii_letters+digits,3)))
        validated_data["salt"] = salt
        usernameplus = salt + validated_data["username"] 
        passwordplus = validated_data["hash"] + salt
        validated_data["username"] = md5(usernameplus.encode('utf8')).hexdigest()[0:20]
        validated_data["hash"] = md5(passwordplus.encode('utf8')).hexdigest()
        return super().create(validated_data)

    # 修改账户密码需要先登陆获取nid
    # http://127.0.0.1:8000/madmin/subadmins/(?P/<pk>\d+)/
    def update(self, instance, validated_data):
        salt = "".join((sample(ascii_letters+digits,3)))
        validated_data["salt"] = salt
        usernameplus = salt + validated_data["username"] 
        passwordplus = validated_data["hash"] + salt
        validated_data["username"] = md5(usernameplus.encode('utf8')).hexdigest()[0:20]
        validated_data["hash"] = md5(passwordplus.encode('utf8')).hexdigest()
        return super().update(instance, validated_data)