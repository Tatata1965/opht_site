from django.db import models
from users.models import User
from doctors.models import Doctor
from services.models import Service


class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], default='pending')
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['date_time']

    def __str__(self):
        return f"{self.patient} with {self.doctor} at {self.date_time}"