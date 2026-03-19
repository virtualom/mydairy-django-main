from django.contrib import admin
from .models import Tag, DiaryEntry


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    list_filter = ('user',)


@admin.register(DiaryEntry)
class DiaryEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'mood', 'user')
    list_filter = ('mood', 'date', 'user')
    search_fields = ('title', 'content')
