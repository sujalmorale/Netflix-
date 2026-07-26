from flask import Flask, jsonify, request
from flask_cors import CORS
from dataset import movies_data
from recommend import get_recommendations

app = Flask(__name__)
CORS(app)

@app.route('/api/movies', methods=['GET'])
def get_all_movies():
    return jsonify(movies_data)

@app.route('/api/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    for movie in movies_data:
        if movie['id'] == movie_id:
            return jsonify(movie)
    return jsonify({"error": "Movie not found"}), 404

@app.route('/api/recommendations/<int:movie_id>', methods=['GET'])
def recommend(movie_id):
    recommendations = get_recommendations(movie_id)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True, port=5000)