from rest_framework.routers import DefaultRouter
from . import views

router1 = DefaultRouter()
router1.register("operate",views.OperationUseModelViewSet,basename="operate")

urlpatterns = [] + router1.urls

