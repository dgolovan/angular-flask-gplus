from mongokit import Document
import datetime

class BlogPost(Document):
    __collection__ = 'Posts'
    __database__ = 'app16250635'
    structure = {
        'slug': basestring,
        'title': basestring,
        'body': basestring,
        'author': basestring,
        'date_modified': datetime.datetime,
        'rank': int,
        'tags': [basestring],
    }
    required_fields = ['slug', 'title', 'author', 'date_modified']
    default_values = {
        'rank': 0,
        'author': 'Admin',
        'date_modified': datetime.datetime.utcnow
    }
