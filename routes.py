from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class TeamRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(300), nullable=False)
    comments = db.relationship('Comment', backref='team_request', lazy=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(300), nullable=False)
    team_request_id = db.Column(db.Integer, db.ForeignKey('team_request.id'), nullable=False)

@app.route('/requests', methods=['GET'])
def get_all_requests():
    all_requests = TeamRequest.query.all()
    requests_list = []
    for team_request in all_requests:
        request_details = {'id': team_request.id, 'title': team_request.title, 'description': team_request.description}
        requests_list.append(request_details)
    return jsonify({'requests': requests_list})

@app.route('/requests', methods=['POST'])
def create_team_request():
    request_json = request.get_json()
    new_team_request = TeamRequest(title=request_json['title'], description=request_json['description'])
    db.session.add(new_team_request)
    db.session.commit()
    return jsonify({'message': 'Team Request added successfully'}), 201

@app.route('/requests/<int:team_request_id>', methods=['GET'])
def get_single_request(team_request_id):
    team_request = TeamRequest.query.get_or_404(team_request_id)
    return jsonify({'id': team_request.id, 'title': team_request.title, 'description': team_request.description})

@app.route('/requests/<int:team_request_id>/comments', methods=['POST'])
def add_comment_to_team_request(team_request_id):
    team_request = TeamRequest.query.get_or_404(team_request_id)
    comment_json = request.get_json()
    new_comment = Comment(content=comment_json['content'], team_request_id=team_request.id)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({'message': 'Comment added to Team Request successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)