from rest_framework.routers import DefaultRouter
from . import views

router1 = DefaultRouter()
router1.register("adminrelations",views.AdminrelationsModelViewSet,basename="adminrelations")

router2 = DefaultRouter()
router2.register("operate",views.OperationlogsModelViewSet,basename="operate")

urlpatterns = []+router1.urls+router2.urls

