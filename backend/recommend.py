from dataset import movies_data

def get_recommendations(movie_id):
    target_movie = None
    for movie in movies_data:
        if movie['id'] == movie_id:
            target_movie = movie
            break
            
    if not target_movie:
        return []
        
    # Split genres into a set
    target_genres = set([g.strip().lower() for g in target_movie['genre'].split(',')])
    
    scored_movies = []
    for movie in movies_data:
        if movie['id'] == movie_id:
            continue
            
        movie_genres = set([g.strip().lower() for g in movie['genre'].split(',')])
        
        # Calculate Jaccard similarity
        intersection = len(target_genres.intersection(movie_genres))
        union = len(target_genres.union(movie_genres))
        score = intersection / union if union > 0 else 0
        
        # Give a small boost if they are of the same type (movie vs series)
        if movie['type'] == target_movie['type']:
            score += 0.1
            
        scored_movies.append({'movie': movie, 'score': score})
        
    # Sort by score descending
    scored_movies.sort(key=lambda x: x['score'], reverse=True)
    
    # Return top 5 movies
    top_5 = [item['movie'] for item in scored_movies[:5]]
    return top_5
