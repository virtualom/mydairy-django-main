import django_filters
from .models import DiaryEntry


class DiaryEntryFilter(django_filters.FilterSet):
    mood = django_filters.CharFilter(field_name='mood', lookup_expr='exact')
    tag = django_filters.CharFilter(field_name='tags__name', lookup_expr='exact')
    date_from = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = DiaryEntry
        fields = ['mood', 'tag', 'date_from', 'date_to']
