from rest_framework import viewsets
from rest_framework import permissions
from .models import Doctor
from .serializers import DoctorSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


    # def perform_create(self, serializer):
    #     # Можно добавить логику, например, устанавливать пользователя как создателя
    #     serializer.save(user=self.request.user)
