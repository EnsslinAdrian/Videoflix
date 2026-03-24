from rest_framework import serializers
from movie_app.models import Movie, Trailer


class HttpsFileField(serializers.FileField):
    def to_representation(self, value):
        url = super().to_representation(value)
        if url and url.startswith('http://'):
            url = 'https://' + url[7:]
        return url


class HttpsImageField(serializers.ImageField):
    def to_representation(self, value):
        url = super().to_representation(value)
        if url and url.startswith('http://'):
            url = 'https://' + url[7:]
        return url


class MovieSerializer(serializers.ModelSerializer):
    cover = HttpsImageField()
    movie_url = HttpsFileField()

    class Meta:
        model = Movie
        fields = '__all__'


class TrailerSerializer(serializers.ModelSerializer):
    video = HttpsFileField()
    cover = HttpsImageField()

    class Meta:
        model = Trailer
        fields = '__all__'