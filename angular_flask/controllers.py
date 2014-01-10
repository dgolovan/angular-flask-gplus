import os
from functools import update_wrapper
from flask import Flask, request, Response
from flask import render_template, url_for, redirect, send_from_directory
from flask import send_file, make_response, abort, current_app
from datetime import timedelta, datetime

from bson.json_util import dumps

from angular_flask import app

from blogpost import BlogPost
from angular_flask.core import connection

from slugify import slugify
from random import randint

# routing for API endpoints (generated from the models designated as API_MODELS)
#from angular_flask.core import api_manager
#from angular_flask.models import *

# for model_name in app.config['API_MODELS']:
# 	model_class = app.config['API_MODELS'][model_name]
# 	api_manager.create_api(model_class, methods=['GET', 'POST'])

#session = api_manager.session

#
# CORS DECORATOR
#
def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
@app.route('/plus')
@app.route('/about')
@app.route('/resume')
@app.route('/blog')
@app.route('/post/')
@app.route('/post/<item_id>')
@app.route('/admin/post/add')
@app.route('/admin/post/<item_id>')
def basic_pages(**kwargs):
	return make_response(open('angular_flask/templates/index.html').read())


#
# REST API
#
@app.route('/api/post', methods = ['GET'])
@crossdomain(origin='*')
def get_posts():
	posts = connection.BlogPost.find()
	return dumps(posts)
	#return jsonify({"posts": posts})

@app.route('/api/post/<slug>', methods = ['GET'])
@crossdomain(origin='*')
def get_post(slug):
  post = connection.BlogPost.find_one({'slug': slug})
  post['tags'] = ', '.join(post['tags'])
  return dumps(post)

@app.route('/api/post', methods=['POST'])
@crossdomain(origin='*')
def add_entry():
  post = connection.BlogPost()
  post['title'] = request.json['title']

  #Generate slug and check if it is unique
  slug = slugify(post['title'])
  chk_slug = connection.BlogPost.find_one({'slug': slug})
  while(chk_slug):
    slug = slugify(post['title']) + str(randint(0,1000))
    chk_slug = connection.BlogPost.find_one({'slug': slug})

  post['slug'] = slug
  post['body'] = request.json['body'].replace('\n', '<br />')
  post['author'] = "Denis Golovan"

  tags = request.json['tags'].lower().split(',')
  if not tags or tags == ['']:
    tags = ['general']
  tags = map(lambda x:x.strip(), tags)
  post['tags'] = tags

  post.save()
  return ""
  #flash('New entry was successfully posted')
  return redirect('post/'+slug)


@app.route('/api/post/<slug>', methods=['PUT'])
@crossdomain(origin='*')
def edit_entry(slug):
  post = connection.BlogPost.find_one({'slug': slug})

  post['title'] = request.json['title'] if request.json['title'] else post['title']
  post['body'] = request.json['body'] if request.json['body'] else post['body']
  post['body'] = post['body'].replace('\n', '<br />')
  post['date_modified'] = datetime.utcnow()


  #Generate slug and check if it is unique
  slug = slugify(post['title'])
  chk_slug = connection.BlogPost.find_one({'slug': slug})
  while(chk_slug):
    slug = slugify(post['title']) + str(randint(0,1000))
    chk_slug = connection.BlogPost.find_one({'slug': slug})

  post['slug'] = slug

  tags = request.json['tags'].lower().split(',')
  if not tags or tags == ['']:
    tags = ['general']
  tags = map(lambda x:x.strip(), tags)
  post['tags'] = tags

  post.save()
  #flash('New entry was successfully posted')
  return "";
  #return redirect(url_for('show_entries'))

@app.route('/api/post/<slug>', methods=['DELETE'])
@crossdomain(origin='*')
def delete_entry(slug):
  post = connection.BlogPost.find_one({'slug': slug})

  post.delete()
  return "";
  #return redirect(url_for('show_entries'))

# special file handlers and error handlers
@app.route('/favicon.ico')
def favicon():
	return send_from_directory(os.path.join(app.root_path, 'static'),
							   'img/favicon.ico')

@app.errorhandler(404)
def page_not_found(e):
  return render_template('404.html'), 404

