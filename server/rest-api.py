from flask import Flask
from flask.ext.restful import Api, Resource, reqparse, fields, marshal

app = Flask(__name__)
api = Api(app)

status_fields = {
	'started': fields.Integer,
	'finished': fields.Integer
}

habit_fields = {
	'name': fields.String,
	'streak': fields.Integer,
	'created': fields.Integer,
	'status': fields.List(fields.Nested(status_fields)),
	'state': fields.List(fields.Integer),
	'current': fields.List(fields.Integer)
}

test_habits = [
	{
		'id': 1,
		'name': 'first',
		'status': {
			'started': 10001,
			'finished': 10002
		}
	},
	{
		'id': 2,
		'name': 'second'
	}
]

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
		habit = {
			'id': test_habits[-1]['id'] + 1,
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
	def get(self, id):
		pass

	def put(self, id):
		pass

	def delete(self, id):
		pass

api.add_resource(HabitListAPI, '/habitdaily/api/v1.0/habits', endpoint='habits')
api.add_resource(HabitAPI, '/habitdaily/api/v1.0/habits/<int:id>', endpoint='habit')

"""curl -i http://127.0.0.1:8000/habitdaily/api/v1.0/habits GET REQUEST
	 curl -i -H "Content-Type: application/json" -X POST -d @singlehabit http://127.0.0.1:8000/habitdaily/api/v1.0/habits
"""

app.run(host='127.0.0.1', port=8000, debug=True)