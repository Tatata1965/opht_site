from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email',
                  'first_name', 'last_name', 'phone', 'birth_date']
        extra_kwargs = {
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone': {'required': False},
            'birth_date': {'required': False},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# class UserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         style={'input_type': 'password'}
#     )
#
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'password', 'email',
#                   'first_name', 'last_name', 'phone', 'birth_date']
#         extra_kwargs = {
#             'email': {'required': False},
#             'first_name': {'required': False},
#             'last_name': {'required': False},
#             'phone': {'required': False},
#             'birth_date': {'required': False},
#         }
#
#     def create(self, validated_data):
#         try:
#             print("🎯 Начало создания пользователя")
#
#             # Создаем пользователя
#             user = User.objects.create_user(**validated_data)
#             print(f"✅ Пользователь создан: {user.username}")
#
#             # НЕМЕДЛЕННАЯ проверка
#             from django.db import connection
#             connection.close()  # Закрываем соединение
#
#             # Проверяем что пользователь действительно сохранился
#             check_user = User.objects.filter(username=user.username).first()
#             print(f"🔍 Проверка в базе: {check_user}")
#
#             return user
#
#         except Exception as e:
#             print(f"💥 КРИТИЧЕСКАЯ ОШИБКА: {e}")
#             import traceback
#             traceback.print_exc()
#             raise
