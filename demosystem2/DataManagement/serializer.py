from rest_framework import serializers

from .models import OperationUseModel

class OperationUseModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationUseModel
        fields = "__all__"

        

