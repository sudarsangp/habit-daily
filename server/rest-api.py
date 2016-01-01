from flask import Flask, abort
from flask.ext.restful import Api, Resource, reqparse, fields, marshal

app = Flask(__name__)
api = Api(app)

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

test_habits = []

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
		return {'habits': [marshal(habit, habit_fields) for habit in test_habits]}

	def post(self):
		args = self.reqparse.parse_args()
		habit_id = test_habits[-1]['id'] + 1 if len(test_habits) > 0 else 0
		habit = {
			'id': habit_id,
			'name': args['name'],
			'streak': args['streak'],
			'created': args['created'],
			'status': args['status'],
			'state': args['state'],
			'current': args['current']
		}
		test_habits.append(habit)
		return {'task': marshal(habit, habit_fields)}, 201

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
		habit = [habit for habit in test_habits if habit['id'] == id]
		if len(habit) == 0:
			abort(404)
		return {'habit': marshal(habit[0], habit_fields)}

	def put(self, id):
		habit = [habit for habit in test_habits if habit['id'] == id]
		if len(habit) == 0:
			abort(404)
		habit = habit[0]
		args = self.reqparse.parse_args()
		for k,v in args.items():
			if v is not None:
				habit[k] = v
		return {'habit': marshal(habit, habit_fields)}

	def delete(self, id):
		habit = [habit for habit in test_habits if habit['id'] == id]
		if len(habit) == 0:
			abort(404)
		test_habits.remove(habit[0])
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

app.run(host='127.0.0.1', port=8000, debug=True)