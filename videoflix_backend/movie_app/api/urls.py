from django.urls import path
from .views import MovieView, MovieDetailView, TrailerView

urlpatterns = [
    path('', MovieView.as_view(), name='movie_list_create'),
    path('<int:id>/', MovieDetailView.as_view(), name='movie_list_detail'),
    path('trailer/', TrailerView.as_view(), name='trailer_list'),
] 