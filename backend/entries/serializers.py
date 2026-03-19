from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tag, DiaryEntry


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')
        read_only_fields = ('id',)


class DiaryEntrySerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False,
        default=[]
    )

    class Meta:
        model = DiaryEntry
        fields = (
            'id', 'title', 'content', 'date', 'mood',
            'tags', 'tag_names',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        user = self.context['request'].user
        entry = DiaryEntry.objects.create(user=user, **validated_data)
        self._set_tags(entry, tag_names, user)
        return entry

    def update(self, instance, validated_data):
        tag_names = validated_data.pop('tag_names', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tag_names is not None:
            self._set_tags(instance, tag_names, instance.user)
        return instance

    def _set_tags(self, entry, tag_names, user):
        tags = []
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(
                name=name.strip().lower(),
                user=user
            )
            tags.append(tag)
        entry.tags.set(tags)
