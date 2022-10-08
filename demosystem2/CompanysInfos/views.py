from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from hashlib import md5

from .models import Companys
from .serializer import CompanysModelSerializer

# Create your views here.

# create
# http://127.0.0.1:8000/companys/info/

# update
# http://127.0.0.1:8000/companys/info/(?P/<pk>\d+)/
class CompanysModelViewSet(ModelViewSet):
    queryset = Companys.objects.all()
    serializer_class = CompanysModelSerializer

    def create(self, request, *args, **kwargs):
        self.queryset = Companys.objects.all()
        for instance in self.queryset:
            
            if instance.companyName == request.data["companyName"]:
                return JsonResponse({"result":"already existed"})
        super().create(request, *args, **kwargs)
        return JsonResponse({"result":"done"})   

    # http://127.0.0.1:8000/companys/info/login/
    @action(methods=["post"],detail=False,url_name="login")
    def login(self,request):

        for instance in self.queryset:
            companyName = request.data["companyName"]
            password = request.data["hash"]
            
            if instance.companyName == companyName:
                passwordplus = password + instance.salt
                hash = md5(passwordplus.encode('utf8')).hexdigest()
                if hash == instance.hash:
                    return JsonResponse({
                    "result":"ok",
                    "companyName":instance.companyName,
                    "nid":instance.nid})
        return JsonResponse({"result":"no"})
