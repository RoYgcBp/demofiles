
from rest_framework.routers import DefaultRouter
from . import views

router1 = DefaultRouter()
router1.register("enterprises",views.EnterprisesModelViewSet,basename="enterprises")

router2 = DefaultRouter()
router2.register("subadmins",views.SubadminsModelViewSet,basename="subadmins")

urlpatterns = []+router1.urls+router2.urls