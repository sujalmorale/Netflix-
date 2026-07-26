import pandas as pd

data = [
    {
        "id": 1,
        "title": "Inception",
        "genre": "Action, Sci-Fi, Thriller",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "poster_url": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
        "rating": 8.8,
        "type": "movie"
    },
    {
        "id": 2,
        "title": "Interstellar",
        "genre": "Adventure, Drama, Sci-Fi",
        "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "poster_url": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/xJHokMbljvjEVAZS3xNCi64SpML.jpg",
        "rating": 8.6,
        "type": "movie"
    },
    {
        "id": 3,
        "title": "The Dark Knight",
        "genre": "Action, Crime, Drama",
        "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "poster_url": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
        "rating": 9.0,
        "type": "movie"
    },
    {
        "id": 4,
        "title": "Stranger Things",
        "genre": "Drama, Fantasy, Horror",
        "description": "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
        "poster_url": "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
        "rating": 8.7,
        "type": "series"
    },
    {
        "id": 5,
        "title": "Breaking Bad",
        "genre": "Crime, Drama, Thriller",
        "description": "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
        "poster_url": "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
        "rating": 9.5,
        "type": "series"
    },
    {
        "id": 6,
        "title": "Avengers: Endgame",
        "genre": "Action, Adventure, Sci-Fi",
        "description": "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        "poster_url": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        "rating": 8.4,
        "type": "movie"
    },
    {
        "id": 7,
        "title": "The Matrix",
        "genre": "Action, Sci-Fi",
        "description": "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        "poster_url": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/7u3pxc0K1wx32IleW949JZt3TGA.jpg",
        "rating": 8.7,
        "type": "movie"
    },
    {
        "id": 8,
        "title": "The Mandalorian",
        "genre": "Action, Adventure, Fantasy",
        "description": "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
        "poster_url": "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/sjx6zjQI2dLGtEL0HGWsnq6UyLU.jpg",
        "rating": 8.7,
        "type": "series"
    },
    {
        "id": 9,
        "title": "Spider-Man: No Way Home",
        "genre": "Action, Adventure, Fantasy",
        "description": "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
        "poster_url": "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1Z488v5f3k1E4.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/iQFcwSGbZKcmoAkpzB1eO1VD8g3.jpg",
        "rating": 8.2,
        "type": "movie"
    },
    {
        "id": 10,
        "title": "Squid Game",
        "genre": "Action, Drama, Mystery",
        "description": "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
        "poster_url": "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0PggZz8rFiJcQ3XkYQ.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/w1280/oaGvWe0jj43yQ1ZJ5B1N5bYgB1v.jpg",
        "rating": 8.0,
        "type": "series"
    }
]

df = pd.DataFrame(data)
df.to_csv('movies.csv', index=False)
print("Dataset created successfully as movies.csv!")
