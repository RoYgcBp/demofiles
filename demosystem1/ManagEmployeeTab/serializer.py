from rest_framework import serializers

from ManagEmployeeTab.models import Adminrelations,Operationlogs

class AdminrelationsModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adminrelations
        exclude = []

    
class OperationlogsModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operationlogs
        exclude = []
    """
    def validate(self, attrs):
        headers = attrs["headers"]
        result = attrs(headers=headers)
        if result == "error":
            raise Exception("error for tabExecute!")
        return super().validate(attrs)
    """

