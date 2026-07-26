import json
from dataset import movies_data

# IDs that have correct/real images
valid_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 20]

for movie in movies_data:
    if movie['id'] not in valid_ids:
        # Create a placeholder URL for broken/fake images
        title_encoded = movie['title'].replace(' ', '+')
        movie['poster_url'] = f"https://placehold.co/500x750/181818/E50914?text={title_encoded}"
        movie['backdrop_url'] = f"https://placehold.co/1280x720/181818/E50914?text={title_encoded}"

# Write it back to dataset.py
with open('dataset.py', 'w', encoding='utf-8') as f:
    f.write("movies_data = [\n")
    for i, movie in enumerate(movies_data):
        f.write("    " + json.dumps(movie))
        if i < len(movies_data) - 1:
            f.write(",\n")
        else:
            f.write("\n")
    f.write("]\n")

print("Images fixed!")
