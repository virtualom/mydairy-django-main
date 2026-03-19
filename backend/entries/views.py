from datetime import timedelta, date
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from django.db.models.functions import TruncDate

from .models import DiaryEntry, Tag
from .serializers import (
    DiaryEntrySerializer,
    TagSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .filters import DiaryEntryFilter


class RegisterView(generics.CreateAPIView):
    """Register a new user."""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


class TagViewSet(viewsets.ModelViewSet):
    """CRUD for tags – scoped to the authenticated user."""
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DiaryEntryViewSet(viewsets.ModelViewSet):
    """
    CRUD for diary entries.
    Supports filtering by mood, tag, date range and keyword search.
    Extra actions: /calendar/ and /streak/
    """
    serializer_class = DiaryEntrySerializer
    filterset_class = DiaryEntryFilter
    search_fields = ['title', 'content']
    ordering_fields = ['date', 'created_at', 'mood']

    def get_queryset(self):
        return DiaryEntry.objects.filter(user=self.request.user).prefetch_related('tags')

    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """Return a list of dates that have entries (for the calendar view)."""
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        qs = self.get_queryset()
        if year:
            qs = qs.filter(date__year=int(year))
        if month:
            qs = qs.filter(date__month=int(month))
        dates = (
            qs.annotate(entry_date=TruncDate('date'))
            .values('entry_date')
            .annotate(count=Count('id'))
            .order_by('entry_date')
        )
        return Response([
            {'date': d['entry_date'].isoformat(), 'count': d['count']}
            for d in dates
        ])

    @action(detail=False, methods=['get'])
    def streak(self, request):
        """Calculate the current writing streak (consecutive days)."""
        dates = (
            self.get_queryset()
            .values_list('date', flat=True)
            .distinct()
            .order_by('-date')
        )
        if not dates:
            return Response({'current_streak': 0, 'longest_streak': 0})

        date_set = set(dates)
        today = date.today()

        # Current streak – counts backwards from today
        current_streak = 0
        check_date = today
        while check_date in date_set:
            current_streak += 1
            check_date -= timedelta(days=1)

        # If the user hasn't written today, check from yesterday
        if current_streak == 0:
            check_date = today - timedelta(days=1)
            while check_date in date_set:
                current_streak += 1
                check_date -= timedelta(days=1)

        # Longest streak
        sorted_dates = sorted(date_set)
        longest_streak = 1
        count = 1
        for i in range(1, len(sorted_dates)):
            if sorted_dates[i] - sorted_dates[i - 1] == timedelta(days=1):
                count += 1
                longest_streak = max(longest_streak, count)
            else:
                count = 1

        return Response({
            'current_streak': current_streak,
            'longest_streak': longest_streak,
        })
