from django.db import models
from django.conf import settings


class Tag(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tags'
    )

    class Meta:
        unique_together = ('name', 'user')
        ordering = ['name']

    def __str__(self):
        return self.name


class DiaryEntry(models.Model):
    MOOD_CHOICES = [
        ('happy', '😊 Happy'),
        ('sad', '😢 Sad'),
        ('angry', '😠 Angry'),
        ('anxious', '😰 Anxious'),
        ('calm', '😌 Calm'),
        ('excited', '🤩 Excited'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='diary_entries'
    )
    title = models.CharField(max_length=200)
    content = models.TextField(help_text='Rich text content (HTML)')
    date = models.DateField()
    mood = models.CharField(max_length=10, choices=MOOD_CHOICES)
    tags = models.ManyToManyField(Tag, blank=True, related_name='entries')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name_plural = 'Diary entries'

    def __str__(self):
        return f"{self.title} ({self.date})"
