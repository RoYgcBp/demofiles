
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import action

from ManagEmployeeTab.models import Adminrelations,Operationlogs
from .serializer import AdminrelationsModelSerializer,OperationlogsModelSerializer

from .tabExecute import operate

# Create your views here.

# 管理员关系
# http://127.0.0.1:8000/memps/adminrelations/
class AdminrelationsModelViewSet(ModelViewSet):
    queryset = Adminrelations.objects.all()
    serializer_class = AdminrelationsModelSerializer

# 管理自定义表结构
# http://127.0.0.1:8000/memps/operate/
class OperationlogsModelViewSet(ModelViewSet):
    queryset = Operationlogs.objects.all()
    serializer_class = OperationlogsModelSerializer
    
    # 查询自定义表结构或表数据
    # http://127.0.0.1:8000/memps/operate/searchdata/
    @action(methods=["post"],detail=False,url_name="searchdata")
    def searchdata(self,request):
        result = "none"
        headers = {
            "enterprisesname":request.data["enterprisesname"],
            "tabname":request.data["tabname"],
            "action":request.data["action"],
            "settings":request.data["settings"],
            "conditions":request.data["action"],
            "data":request.data["data"],
            }
        
        if request.data["action"] == "descTab" or request.data["action"] == "selectData":
            
            result = operate(headers)
            print(result)
        return JsonResponse({"result":result})
        


