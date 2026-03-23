from movie_app.models import Movie
from .tasks import convert_480p, convert_720p, convert_1080p
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from django_rq import enqueue
import os
import django_rq

print("SIGNALS IMPORTED")

@receiver(post_save, sender=Movie)
def movie_post_save(sender, instance, created, **kwargs):
    print("SIGNAL TRIGGERED", created)

    cache.clear()

    if instance.movie_url:
        path = instance.movie_url.path
        print("QUEUEING:", path)

        queue = django_rq.get_queue('default')
        queue.enqueue(convert_480p, path)
        queue.enqueue(convert_720p, path)
        queue.enqueue(convert_1080p, path)

@receiver(post_delete,sender=Movie)
def auto_delete_file_on_delete(sender,instance,*args,**kwargs):
    cache.clear()
    if instance.cover:
        if os.path.isfile(instance.cover.path):
            os.remove(instance.cover.path)
    if instance.movie_url:
        if os.path.isfile(instance.movie_url.path):
            os.remove(instance.movie_url.path)
