from flask import Flask, abort
from flask.ext.restful import Api, Resource, reqparse, fields, marshal
from flask.ext.mongoengine import MongoEngine
from mongoengine import Document, StringField, IntField, ListField, DictField

app = Flask(__name__)
api = Api(app)
db = MongoEngine(app)

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

import time, datetime

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
            print origin
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

api.decorators = [crossdomain(origin='*', headers=['Content-Type'])]

status_fields = {
	'started': fields.Integer,
	'finished': fields.Integer
}

habit_fields = {
	'id': fields.Integer,
	'name': fields.String,
	'streak': fields.Integer,
	'created': fields.Integer,
	'status': fields.List(fields.Nested(status_fields)),
	'state': fields.List(fields.Integer),
	'current': fields.List(fields.Integer),
	'uri': fields.Url('habit')
}

class HabitListAPI(Resource):
	def __init__(self):
		self.reqparse = reqparse.RequestParser()
		self.reqparse.add_argument('name', type = str, required = True, location = 'json', help = 'No habit name provided')
		self.reqparse.add_argument('streak', type = int, required = True, location = 'json')
		self.reqparse.add_argument('created', type = int, required = True, location = 'json')
		self.reqparse.add_argument('status', type = list, required = True, location = 'json')
		self.reqparse.add_argument('state', type = list, required = True, location = 'json')
		self.reqparse.add_argument('current', type = list, required = True, location = 'json')
		super(HabitListAPI, self).__init__()

	def get(self):
		all_habits = HabitFormat().all_habits_db_to_api(HabitDaily.objects)
		return {'habits': [marshal(habit, habit_fields) for habit in all_habits]}

	def post(self):
		args = self.reqparse.parse_args()
		habit = {
			'id': 0,
			'name': args['name'],
			'streak': args['streak'],
			'created': args['created'],
			'status': args['status'],
			'state': args['state'],
			'current': args['current']
		}
		db_habit = HabitDaily(name = habit['name'],streak = habit['streak'],created = habit['created'],status = habit['status'],state = habit['state'],current = habit['current']).save()
		format_habit = HabitFormat().db_to_api(db_habit)
		max_id = 0
		for mapper in HabitMapper.objects:
			if max_id < int(mapper.habitId):
				max_id = int(mapper.habitId)
		id_value = max_id + 1 if max_id > 0 else 1
		format_habit['id'] = id_value
		mapper_habit = HabitMapper(habitId = int(id_value), objectId = str(db_habit.id)).save()
		return {'habit': marshal(format_habit, habit_fields)}, 201

	def options(self):
		return True

class HabitAPI(Resource):
	def __init__(self):
		self.reqparse = reqparse.RequestParser()
		self.reqparse.add_argument('name', type = str,  location = 'json')
		self.reqparse.add_argument('streak', type = int,  location = 'json')
		self.reqparse.add_argument('created', type = int,  location = 'json')
		self.reqparse.add_argument('status', type = list,  location = 'json')
		self.reqparse.add_argument('state', type = list,  location = 'json')
		self.reqparse.add_argument('current', type = list,  location = 'json')
		super(HabitAPI, self).__init__()

	def get(self, id):
		object_id = HabitFormat().get_object_id_from_habit_id(id)
		habit = HabitFormat().db_to_api(HabitDaily.objects.get(id = object_id))

		if not bool(habit):
			abort(404)
		return {'habit': marshal(habit, habit_fields)}

	def put(self, id):
		object_id = HabitFormat().get_object_id_from_habit_id(id)
		db_habit = HabitDaily.objects.get(id = object_id)
		
		if not bool(db_habit):
			abort(404)

		args = self.reqparse.parse_args()
		for k,v in args.items():
			if v is not None:
				if k in ['status', 'state', 'current']:
					db_habit[k][len(db_habit[k]) - 1] = v[0]
				else:
					db_habit[k] = v
		db_habit.save()

		habit = HabitFormat().db_to_api(db_habit)
		return {'habit': marshal(habit, habit_fields)}

	def delete(self, id):
		object_id = HabitFormat().get_object_id_from_habit_id(id)
		db_habit = HabitDaily.objects.get(id = object_id)
		
		if not bool(db_habit):
			abort(404)
		
		db_habit.delete()
		return {'result': True}

	def options(self):
		return True

api.add_resource(HabitListAPI, '/habitdaily/api/v1.0/habits', endpoint='habits')
api.add_resource(HabitAPI, '/habitdaily/api/v1.0/habits/<int:id>', endpoint='habit')

"""HABITS END POINT
	 curl -i http://127.0.0.1:8000/habitdaily/api/v1.0/habits GET REQUEST
	 curl -i -H "Content-Type: application/json" -X POST -d @singlehabit http://127.0.0.1:8000/habitdaily/api/v1.0/habits
	 HABIT END POINT
	 curl -i -H "Content-Type: application/json" -X PUT -d '{"name": "habit changed from curl"}'  http://127.0.0.1:8000/habitdaily/api/v1.0/habits/0
	 curl -i http://127.0.0.1:8000/habitdaily/api/v1.0/habits/0 GET REQUEST
	 curl -i -X DELETE http://127.0.0.1:8000/habitdaily/api/v1.0/habits/0
"""

class HabitDaily(Document):
	name = StringField()
	streak = IntField()
	created = IntField()
	status = ListField(DictField())
	state = ListField(IntField())
	current = ListField(IntField())

class HabitFormat:
	def db_to_api(self, habit):
		self.habitFormat = {}
		self.habitFormat['name']= habit.name
		self.habitFormat['streak'] = habit.streak
		self.habitFormat['created'] = habit.created
		self.habitFormat['status'] = habit.status
		self.habitFormat['state'] = habit.state
		self.habitFormat['current'] = habit.current
		self.habitFormat['id'] = self.get_habit_id_from_object_id(habit.id)
		return self.habitFormat

	def all_habits_db_to_api(self, all_habits):
		self.list_habits = []
		for habit in all_habits:
			self.list_habits.append(self.db_to_api(habit))
		return self.list_habits

	def get_habit_id_from_object_id(self, object_id):
		for mapper in HabitMapper.objects:
			if str(object_id) == str(mapper.objectId):
				return int(mapper.habitId)

	def get_object_id_from_habit_id(self, habit_id):
		for mapper in HabitMapper.objects:
			if int(habit_id) == int(mapper.habitId):
				return str(mapper.objectId)

class HabitMapper(Document):
	objectId = StringField()
	habitId = IntField()

@app.route('/update/<int:habit_id>')
def update_list(habit_id):
	object_id = HabitFormat().get_object_id_from_habit_id(habit_id)
	habit = HabitDaily.objects.get(id = object_id)
	habit['status'].append({})
	habit['state'].append(0)
	habit['current'].append(0)
	habit.save()
	return str(habit_id)

@app.route('/number/<int:habit_id>')
@crossdomain(origin='*')
def number_of_days(habit_id):
	object_id = HabitFormat().get_object_id_from_habit_id(habit_id)
	habit = HabitDaily.objects.get(id = object_id)
	return str(len(habit['status']))

app.run(host='127.0.0.1', port=8000, debug=True, threaded=True)