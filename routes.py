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
    comments = db.relationship('Comment', backref='request', lazy=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(300), nullable=False)
    request_id = db.Column(db.Integer, db.ForeignKey('team_request.id'), nullable=False)

@app.route('/requests', methods=['GET'])
def get_requests():
    requests = TeamRequest.query.all()
    output = []
    for request in requests:
        request_data = {'id': request.id, 'title': request.title, 'description': request.description}
        output.append(request_data)
    return jsonify({'requests': output})

@app.route('/requests', methods=['POST'])
def add_request():
    request_data = request.get_json()
    new_request = TeamRequest(title=request_data['title'], description=request_data['description'])
    db.session.add(new_request)
    db.session.commit()
    return jsonify({'message': 'Request created successfully'}), 201

@app.route('/requests/<int:request_id>', methods=['GET'])
def get_request(request_id):
    req = TeamRequest.query.get_or_404(request_id)
    return jsonify({'id': req.id, 'title': req.title, 'description': req.description})

@app.route('/requests/<int:request_id>/comments', methods=['POST'])
def add_comment_to_request(request_id):
    req = TeamRequest.query.get_or_404(request_id)
    comment_data = request.get_json()
    new_comment = Comment(content=comment_data['content'], request_id=req.id)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({'message': 'Comment added successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)