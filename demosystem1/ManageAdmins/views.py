
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from hashlib import md5

from ManageAdmins.models import Enterprises,Subadmins
from .serializer import EnterprisesModelSerializer,SubadminsModelSerializer


# Create your views here.

# 创建或者更新所有的总管理员账户
# http://127.0.0.1:8000/madmin/enterprises/
class EnterprisesModelViewSet(ModelViewSet):
    queryset = Enterprises.objects.all()
    serializer_class = EnterprisesModelSerializer
    
    # 总管理员登陆
    # http://127.0.0.1:8000/madmin/enterprises/ent/login/
    @action(methods=["post"],detail=False,url_path="ent/login")
    def login(self,request):
        username = request.data["username"]
        password = request.data["hash"]
        
        for instance in self.queryset:
            usernameplus = instance.salt + username
            username = md5(usernameplus.encode('utf8')).hexdigest()[0:20]
            if instance.username == username:
                passwordplus = password + instance.salt
                hash = md5(passwordplus.encode('utf8')).hexdigest()
                if hash == instance.hash:
                    return JsonResponse({"result":"ok","name":instance.name})
        return JsonResponse({"result":"no"})

    def create(self, request, *args, **kwargs):
        self.queryset = Enterprises.objects.all()
        for instance in self.queryset:
            
            if instance.name == request.data["name"]:
                return JsonResponse({"result":"already existed"})
        super().create(request, *args, **kwargs)

        return JsonResponse({"result":"done"})

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    
# 创建或者更新所有的下辖管理员账户
# http://127.0.0.1:8000/madmin/subadmins/
class SubadminsModelViewSet(ModelViewSet):
    queryset = Subadmins.objects.all()
    serializer_class = SubadminsModelSerializer

    # 下辖管理员登陆
    # http://127.0.0.1:8000/madmin/enterprises/sub/login/
    @action(methods=["post"],detail=False,url_path="sub/login")
    def login(self,request):
        enterprisesname = request.data["enterprisesname"]
        grapename = request.data["grapename"]
        username = request.data["username"]
        password = request.data["hash"]
        usernameplus = instance.salt + username
        username = md5(usernameplus.encode('utf8')).hexdigest()[0:20]
        for instance in self.queryset:
            
            if instance.username == username and instance.enterprisesname == enterprisesname and instance.grapename == grapename:
                passwordplus = password + instance.salt
                hash = md5(passwordplus.encode('utf8')).hexdigest()
                if hash == instance.hash:
                    return JsonResponse({"result":"ok",
                    "enterprisesname":instance.enterprisesname,
                    "grapename":instance.grapename,})
        return JsonResponse({"result":"no"})


