from flask import Flask
from flask.ext.restful import Api, Resource, reqparse, fields, marshal

app = Flask(__name__)
api = Api(app)

habit_fields = {
	'name': fields.String
}

test_habits = [
	{
		'id': 1,
		'name': 'first'
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
		super(HabitListAPI, self).__init__()

	def get(self):
		return {'habits': [marshal(habit, habit_fields) for habit in test_habits]}

	def post(self):
		args = self.reqparse.parse_args()
		habit = {
			'id': test_habits[-1]['id'] + 1,
			'name': args['name']
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
	 curl -i -H "Content-Type: application/json" -X POST -d '{"name":"curl habit ok"}' http://127.0.0.1:8000/habitdaily/api/v1.0/habits
"""

app.run(host='127.0.0.1', port=8000, debug=True)