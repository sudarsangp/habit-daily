from flask import Flask, abort
from flask.ext.restful import Api, Resource, reqparse, fields, marshal
from flask.ext.mongoengine import MongoEngine
from mongoengine import Document, StringField, IntField, ListField, DictField

app = Flask(__name__)
api = Api(app)
db = MongoEngine(app)

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
		habit['id'] = id_value
		mapper_habit = HabitMapper(habitId = int(id_value), objectId = str(db_habit.id)).save()
		return {'task': marshal(format_habit, habit_fields)}, 201

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

app.run(host='127.0.0.1', port=8000, debug=True)