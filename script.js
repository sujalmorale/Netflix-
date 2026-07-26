const API_BASE = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:5000/api'
    : '/api';

// DOM Elements
const navbar = document.getElementById('navbar');
const trendingRow = document.getElementById('trending-row');
const recommendationsRow = document.getElementById('recommendations-row');
const hero = document.getElementById('hero');
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');
const recommendSource = document.getElementById('recommend-source');

// Modal Elements
const modal = document.getElementById('movie-modal');
const closeBtn = document.querySelector('.close-btn');
const modalHero = document.getElementById('modal-hero');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalGenres = document.getElementById('modal-genres');
const modalType = document.getElementById('modal-type');
const modalSimilar = document.getElementById('modal-similar');

// Navigation Elements
const navLinks = document.querySelectorAll('.nav-links li a');
const navHome = document.getElementById('nav-home');
const navTvShows = document.getElementById('nav-tvshows');
const navMovies = document.getElementById('nav-movies');
const navNew = document.getElementById('nav-new');
const trendingTitle = document.getElementById('trending-title');

let allMovies = [];
let currentCategory = 'all'; // all, series, movie

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Close Modal
closeBtn.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Fetch all movies (Trending)
async function fetchMovies() {
    try {
        const response = await fetch(`${API_BASE}/movies`);
        allMovies = await response.json();
        
        renderPage('all');
    } catch (error) {
        console.error("Error fetching movies:", error);
        heroTitle.innerText = "Error loading content";
        heroDesc.innerText = "Please ensure the backend is running properly.";
    }
}

function renderPage(category) {
    currentCategory = category;
    
    // Filter movies
    let filteredMovies = allMovies;
    if (category === 'series') {
        filteredMovies = allMovies.filter(m => m.type === 'series');
        trendingTitle.innerText = "Trending TV Shows";
        hideOtherRows();
    } else if (category === 'movie') {
        filteredMovies = allMovies.filter(m => m.type === 'movie');
        trendingTitle.innerText = "Trending Movies";
        hideOtherRows();
    } else if (category === 'indian_serial') {
        filteredMovies = allMovies.filter(m => m.type === 'indian_serial');
        trendingTitle.innerText = "Popular Indian Serials";
        hideOtherRows();
    } else {
        trendingTitle.innerText = "Trending Now";
        showAllRows();
        populateSpecificRows();
    }
    
    // Set first movie as hero
    if (filteredMovies.length > 0) {
        setHero(filteredMovies[0]);
        renderRow(filteredMovies, document.getElementById('trending-row'));
        // Fetch recommendations for the first movie by default
        fetchRecommendations(filteredMovies[0]);
    }
}

function renderRow(movies, container) {
    if (!container) return;
    container.innerHTML = '';
    movies.forEach(movie => {
        const img = document.createElement('img');
        img.src = movie.poster_url;
        img.classList.add('poster');
        img.alt = movie.title;
        img.onclick = () => openModal(movie);
        container.appendChild(img);
    });
}

function hideOtherRows() {
    document.getElementById('row-thrillers-container').style.display = 'none';
    document.getElementById('row-comedies-container').style.display = 'none';
    document.getElementById('row-familiar-container').style.display = 'none';
    document.getElementById('row-top-searches-container').style.display = 'none';
    document.getElementById('row-film-night-container').style.display = 'none';
    document.getElementById('row-international-container').style.display = 'none';
}

function showAllRows() {
    document.getElementById('row-thrillers-container').style.display = 'block';
    document.getElementById('row-comedies-container').style.display = 'block';
    document.getElementById('row-familiar-container').style.display = 'block';
    document.getElementById('row-top-searches-container').style.display = 'block';
    document.getElementById('row-film-night-container').style.display = 'block';
    document.getElementById('row-international-container').style.display = 'block';
}

function populateSpecificRows() {
    // Thrillers
    const thrillers = allMovies.filter(m => m.genre.includes('Thriller'));
    renderRow(thrillers, document.getElementById('row-thrillers'));

    // TV Comedies
    const comedies = allMovies.filter(m => m.genre.includes('Comedy') && m.type === 'series');
    renderRow(comedies, document.getElementById('row-comedies'));

    // Familiar
    const familiarTitles = ["Breaking Bad", "Lucifer", "The Vampire Diaries", "Squid Game", "Friends"];
    const familiar = allMovies.filter(m => familiarTitles.includes(m.title));
    renderRow(familiar, document.getElementById('row-familiar'));

    // Top Searches
    const topSearchesTitles = ["Lock Upp", "Kurukshetra", "Teach You A Lesson", "Money Heist", "The East Palace"];
    const topSearches = allMovies.filter(m => topSearchesTitles.includes(m.title));
    renderRow(topSearches, document.getElementById('row-top-searches'));

    // Film Night
    const filmNightTitles = ["Dude", "Blast", "Peddi", "Raja Shivaji", "Lucky Baskhar"];
    const filmNight = allMovies.filter(m => filmNightTitles.includes(m.title));
    renderRow(filmNight, document.getElementById('row-film-night'));

    // International
    const intTitles = ["The East Palace", "Money Heist", "Alice in Borderland", "My Demon", "Squid Game"];
    const international = allMovies.filter(m => intTitles.includes(m.title));
    renderRow(international, document.getElementById('row-international'));
}

// Navigation Listeners
navHome.addEventListener('click', (e) => {
    e.preventDefault();
    updateActiveNav(navHome);
    renderPage('all');
});

navTvShows.addEventListener('click', (e) => {
    e.preventDefault();
    updateActiveNav(navTvShows);
    renderPage('series');
});

navMovies.addEventListener('click', (e) => {
    e.preventDefault();
    updateActiveNav(navMovies);
    renderPage('movie');
});

navNew.addEventListener('click', (e) => {
    e.preventDefault();
    updateActiveNav(navNew);
    renderPage('indian_serial');
});

function updateActiveNav(activeElement) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeElement.classList.add('active');
}

function setHero(movie) {
    hero.style.backgroundImage = `url('${movie.backdrop_url}')`;
    heroTitle.innerText = movie.title;
    heroDesc.innerText = movie.description;
}

// Fetch Recommendations
async function fetchRecommendations(sourceMovie) {
    recommendSource.innerText = sourceMovie.title;
    try {
        const response = await fetch(`${API_BASE}/recommendations/${sourceMovie.id}`);
        const recommended = await response.json();
        renderRecommendations(recommended);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
    }
}

function renderRecommendations(movies) {
    recommendationsRow.innerHTML = '';
    if (movies.length === 0) {
        recommendationsRow.innerHTML = '<p>No recommendations found.</p>';
        return;
    }
    
    movies.forEach(movie => {
        const img = document.createElement('img');
        img.src = movie.poster_url;
        img.classList.add('poster');
        img.alt = movie.title;
        img.onclick = () => openModal(movie);
        recommendationsRow.appendChild(img);
    });
}

// Open Modal and fetch similar movies for the modal
async function openModal(movie) {
    modalTitle.innerText = movie.title;
    modalDesc.innerText = movie.description;
    modalGenres.innerText = movie.genre;
    modalType.innerText = movie.type === 'movie' ? 'Movie' : 'TV Series';
    modalHero.style.backgroundImage = `url('${movie.backdrop_url}')`;
    
    // Show Modal
    modal.style.display = "block";
    
    // Fetch similar for modal
    modalSimilar.innerHTML = 'Loading...';
    try {
        const response = await fetch(`${API_BASE}/recommendations/${movie.id}`);
        const recommended = await response.json();
        
        modalSimilar.innerHTML = '';
        recommended.forEach(rec => {
            const el = document.createElement('div');
            el.classList.add('similar-item');
            el.onclick = () => {
                // Change modal context to new movie
                openModal(rec);
                // Also update the main row below
                fetchRecommendations(rec);
            };
            
            el.innerHTML = `
                <img src="${rec.backdrop_url}" alt="${rec.title}">
                <div class="similar-item-info">
                    <div class="similar-item-title">${rec.title}</div>
                    <div class="similar-item-desc">${rec.description}</div>
                </div>
            `;
            modalSimilar.appendChild(el);
        });
        
    } catch (error) {
        modalSimilar.innerHTML = 'Error loading recommendations.';
    }
}

// Init
fetchMovies();
