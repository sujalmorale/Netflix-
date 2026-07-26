import json
import urllib.request
import urllib.parse
from dataset import movies_data

print('Fetching...')
updated = 0
for movie in movies_data:
    if 'placehold.co' in movie['poster_url']:
        title_encoded = urllib.parse.quote(movie['title'])
        try:
            url = f'https://api.tvmaze.com/search/shows?q={title_encoded}'
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urllib.request.urlopen(req)
            data = json.loads(response.read().decode('utf-8'))
            if data and len(data) > 0 and data[0]['show']['image'] and data[0]['show']['image']['original']:
                img_url = data[0]['show']['image']['original']
                movie['poster_url'] = img_url
                movie['backdrop_url'] = img_url
                print(f"Found: {movie['title']}")
                updated += 1
        except Exception as e:
            pass

if updated > 0:
    with open('dataset.py', 'w', encoding='utf-8') as f:
        f.write('movies_data = [\n')
        for i, m in enumerate(movies_data):
            f.write('    ' + json.dumps(m))
            if i < len(movies_data) - 1:
                f.write(',\n')
            else:
                f.write('\n')
        f.write(']\n')
    print(f'Updated {updated} posters!')
