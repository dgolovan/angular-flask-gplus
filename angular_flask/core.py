from angular_flask import app
from mongokit import Connection
from blogpost import BlogPost


connection = Connection(app.config['MONGO_URL'])
connection.register([BlogPost])