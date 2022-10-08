from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.http import JsonResponse

from .pymysql_wrapper_library import TableManager,DataManager

from .models import OperationUseModel
from .serializer import OperationUseModelSerializer

class OperationUseModelViewSet(ModelViewSet):
    queryset = OperationUseModel.objects.all()
    serializer_class = OperationUseModelSerializer

    # 新建初始数据库
    # http://127.0.0.1:8000/datamanagement/operate/firstpost/
    @action(methods=["post"],detail=False,url_name="firstpost")
    def firstpost(self,request):
        tableManager = TableManager()
        dbname = request.data["companyName"]
        allheaders = [
            {
            "action":"new_Tab",
            "dbname":dbname,
            "tabname":"system_all_tables",
            "fields":[
                ("tabname","varchar(50)","not null",""),
                ("type","varchar(20)","not null",""),
                ("deadline","varchar(20)","",""),
                ],
            },
            {
            "action":"new_Tab",
            "dbname":dbname,
            "tabname":"system_all_operation_history",
            "fields":[
                ("number","varchar(50)","not null",""),
                ("tabname","varchar(50)","not null",""),
                ("type","varchar(20)","not null",""),
                ("time","varchar(50)","not null",""),
                ],
            },
            {
            "action":"new_Tab",
            "dbname":dbname,
            "tabname":"职员总表",
            "fields":[
                ("工号","varchar(50)","not null",""),
                ("初始密码","int","not null",""),
                ("姓名","varchar(50)","not null",""),
                ("年龄","float","not null",""),
                ("性别","varchar(50)","not null",""),
                ],
            },
            {
            "action":"new_Tab",
            "dbname":dbname,
            "tabname":"管理员总表",
            "fields":[
                ("账号","int","not null",""),
                ("初始密码","int","not null",""),
                ("工号","varchar(50)","not null",""),
                ("权限","varchar(800)","not null",""),
                ],
            },
        ]
        for headers in allheaders:
            tableManager.operate_Tab(headers)
        tableManager.quitConn()
        dataManager = DataManager()
        data_headers = {
            "action":"add_Data",
            "dbname":dbname,
            "tabname":"system_all_tables",
            "fields":["name","type"],
            "data":[("职员总表","员工表"),
                    ("管理员总表","管理员表"),],
        }
        dataManager.operate_Data(data_headers)
        dataManager.quitConn()
        return JsonResponse({"result":"done"})

    # 操作字段
    # http://127.0.0.1:8000/datamanagement/operate/tablepost/
    @action(methods=["post"],detail=False,url_name="tablepost")
    def tablepost(self,request):
        tableManager = TableManager()
        print(request.data["headers"])
        result = tableManager.operate_Tab(request.data["headers"])
        return JsonResponse({"result":result})

    # 操作数据
    # http://127.0.0.1:8000/datamanagement/operate/datapost/
    @action(methods=["post"],detail=False,url_name="datapost")
    def datapost(self,request):
        dataManager = DataManager()
        result = dataManager.operate_Tab(request.data["data_headers"])
        return JsonResponse({"result":result})



