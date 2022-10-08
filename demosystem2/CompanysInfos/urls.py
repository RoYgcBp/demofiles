from rest_framework.routers import DefaultRouter
from . import views

router1 = DefaultRouter()
router1.register("info",views.CompanysModelViewSet,basename="info")

urlpatterns = [] + router1.urls
