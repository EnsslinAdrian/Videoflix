from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField()
    genre = models.CharField(max_length=30)
    release = models.DateField()
    director = models.CharField(max_length=30)
    license_type = models.CharField(max_length=30)
    license_url = models.URLField()
    source_url = models.URLField()
    cover = models.ImageField(upload_to='covers/', null=True, blank=True)
    movie_url = models.FileField(upload_to='movies/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
class Trailer(models.Model):
    title = models.CharField(max_length=100)
    video = models.FileField(upload_to='trailer/')
    cover = models.ImageField(upload_to='trailer/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title