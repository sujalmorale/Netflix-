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
const subHeader = document.getElementById('sub-header');
const genreSelect = document.getElementById('genre-select');

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
    
    if (category === 'series') {
        // TV Shows Page
        if (subHeader) subHeader.style.display = 'flex';
        document.getElementById('sub-header-title').innerHTML = '<i class="fas fa-tv"></i> TV Shows';
        if (genreSelect) genreSelect.value = "all";

        hideHomeRows();
        hideMovieRows();
        showTvShowRows();
        populateTvShowRows('all');

        const tvShows = allMovies.filter(m => m.type === 'series' || m.type === 'indian_serial');
        if (tvShows.length > 0) {
            const heroShow = tvShows.find(m => m.title === "Wednesday") || tvShows[0];
            setHero(heroShow);
            fetchRecommendations(heroShow);
        }
    } else if (category === 'movie') {
        // Movies Page
        if (subHeader) subHeader.style.display = 'flex';
        document.getElementById('sub-header-title').innerHTML = '<i class="fas fa-film"></i> Movies';
        if (genreSelect) genreSelect.value = "all";

        hideHomeRows();
        hideTvShowRows();
        showMovieRows();
        populateMovieRows('all');

        const movies = allMovies.filter(m => m.type === 'movie');
        if (movies.length > 0) {
            const heroMovie = movies.find(m => m.title === "Raja Shivaji") || movies.find(m => m.title === "Border 2") || movies[0];
            setHero(heroMovie);
            fetchRecommendations(heroMovie);
        }
    } else {
        // Home Page
        if (subHeader) subHeader.style.display = 'none';
        trendingTitle.innerText = "Trending Now";
        hideTvShowRows();
        hideMovieRows();
        showHomeRows();
        populateSpecificRows();
        if (allMovies.length > 0) {
            setHero(allMovies[0]);
            renderRow(allMovies, document.getElementById('trending-row'));
            fetchRecommendations(allMovies[0]);
        }
    }
}

function renderRow(movies, container) {
    if (!container) return;
    container.innerHTML = '';
    movies.forEach(movie => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('poster-wrapper');

        const img = document.createElement('img');
        img.src = movie.poster_url;
        img.classList.add('poster');
        img.alt = movie.title;
        img.onclick = () => openModal(movie);
        wrapper.appendChild(img);

        if (movie.badge) {
            const badge = document.createElement('div');
            badge.classList.add('card-badge');
            badge.innerText = movie.badge;
            wrapper.appendChild(badge);
        }

        container.appendChild(wrapper);
    });
}

function renderTop10Row(movies, container) {
    if (!container) return;
    container.innerHTML = '';
    movies.forEach((movie, index) => {
        const card = document.createElement('div');
        card.classList.add('top10-card');
        card.onclick = () => openModal(movie);

        const rankNum = document.createElement('div');
        rankNum.classList.add('top10-number');
        rankNum.innerText = index + 1;

        const wrapper = document.createElement('div');
        wrapper.classList.add('top10-poster-wrapper');

        const img = document.createElement('img');
        img.src = movie.poster_url;
        img.classList.add('top10-poster');
        img.alt = movie.title;
        wrapper.appendChild(img);

        if (movie.badge) {
            const badge = document.createElement('div');
            badge.classList.add('card-badge');
            badge.innerText = movie.badge;
            wrapper.appendChild(badge);
        }

        card.appendChild(rankNum);
        card.appendChild(wrapper);
        container.appendChild(card);
    });
}

function hideTvShowRows() {
    document.getElementById('row-top10-container').style.display = 'none';
    document.getElementById('row-indian-dramas-container').style.display = 'none';
    document.getElementById('row-crowd-pleasers-container').style.display = 'none';
    document.getElementById('row-tv-dramas-container').style.display = 'none';
    document.getElementById('row-captivating-container').style.display = 'none';
}

function showTvShowRows() {
    document.getElementById('row-top10-container').style.display = 'block';
    document.getElementById('row-indian-dramas-container').style.display = 'block';
    document.getElementById('row-crowd-pleasers-container').style.display = 'block';
    document.getElementById('row-tv-dramas-container').style.display = 'block';
    document.getElementById('row-captivating-container').style.display = 'block';
}

function hideMovieRows() {
    document.getElementById('row-movie-top10-container').style.display = 'none';
    document.getElementById('row-new-blockbusters-container').style.display = 'none';
    document.getElementById('row-scifi-spectacles-container').style.display = 'none';
    document.getElementById('row-horror-thrillers-container').style.display = 'none';
    document.getElementById('row-hindi-highlights-container').style.display = 'none';
    document.getElementById('row-popular-releases-container').style.display = 'none';
    document.getElementById('row-hindi-movies-container').style.display = 'none';
    document.getElementById('row-south-dubbed-container').style.display = 'none';
    document.getElementById('row-emotional-movies-container').style.display = 'none';
    document.getElementById('row-award-directors-container').style.display = 'none';
    document.getElementById('row-movie-comedies-container').style.display = 'none';
    document.getElementById('row-suspenseful-us-container').style.display = 'none';
    document.getElementById('row-crime-movies-container').style.display = 'none';
}

function showMovieRows() {
    document.getElementById('row-movie-top10-container').style.display = 'block';
    document.getElementById('row-new-blockbusters-container').style.display = 'block';
    document.getElementById('row-scifi-spectacles-container').style.display = 'block';
    document.getElementById('row-horror-thrillers-container').style.display = 'block';
    document.getElementById('row-hindi-highlights-container').style.display = 'block';
    document.getElementById('row-popular-releases-container').style.display = 'block';
    document.getElementById('row-hindi-movies-container').style.display = 'block';
    document.getElementById('row-south-dubbed-container').style.display = 'block';
    document.getElementById('row-emotional-movies-container').style.display = 'block';
    document.getElementById('row-award-directors-container').style.display = 'block';
    document.getElementById('row-movie-comedies-container').style.display = 'block';
    document.getElementById('row-suspenseful-us-container').style.display = 'block';
    document.getElementById('row-crime-movies-container').style.display = 'block';
}

function hideHomeRows() {
    document.getElementById('row-trending-container').style.display = 'none';
    document.getElementById('row-thrillers-container').style.display = 'none';
    document.getElementById('row-comedies-container').style.display = 'none';
    document.getElementById('row-familiar-container').style.display = 'none';
    document.getElementById('row-top-searches-container').style.display = 'none';
    document.getElementById('row-film-night-container').style.display = 'none';
    document.getElementById('row-international-container').style.display = 'none';
}

function showHomeRows() {
    document.getElementById('row-trending-container').style.display = 'block';
    document.getElementById('row-thrillers-container').style.display = 'block';
    document.getElementById('row-comedies-container').style.display = 'block';
    document.getElementById('row-familiar-container').style.display = 'block';
    document.getElementById('row-top-searches-container').style.display = 'block';
    document.getElementById('row-film-night-container').style.display = 'block';
    document.getElementById('row-international-container').style.display = 'block';
}

function populateTvShowRows(selectedGenre = 'all') {
    let tvSeries = allMovies.filter(m => m.type === 'series' || m.type === 'indian_serial');
    
    if (selectedGenre !== 'all') {
        tvSeries = tvSeries.filter(m => m.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
    }

    // 1. Top 10 Shows in India Today
    const top10Titles = ["Musafir Cafe", "Lock Upp", "The East Palace", "SmackDown", "Elite Force", "Agent Kim Reactivated", "Kohrra Season 2", "Sacred Games", "Mirzapur", "Wednesday"];
    const top10Shows = top10Titles.map(title => tvSeries.find(m => m.title === title)).filter(Boolean);
    renderTop10Row(top10Shows, document.getElementById('row-top10'));

    // 2. Indian TV Dramas
    const indianDramaTitles = ["Kohrra Season 2", "Super Subbu", "Taskaree", "Glory", "The Ba***ds of Bollywood", "Sacred Games", "Mismatched", "Mirzapur", "Panchayat", "The Family Man"];
    const indianDramas = tvSeries.filter(m => indianDramaTitles.includes(m.title));
    renderRow(indianDramas, document.getElementById('row-indian-dramas'));

    // 3. Crowd Pleasers
    const crowdPleaserTitles = ["Wednesday", "All of Us Are Dead", "Bon Appétit, Your Majesty", "The Good Doctor", "The Witcher", "I Will Find You", "Stranger Things"];
    const crowdPleasers = tvSeries.filter(m => crowdPleaserTitles.includes(m.title));
    renderRow(crowdPleasers, document.getElementById('row-crowd-pleasers'));

    // 4. TV Dramas
    const tvDramaTitles = ["The Mentalist", "Suits", "Vikings", "Lucifer", "Bloodhounds", "Dark", "Breaking Bad", "Kohrra Season 2"];
    const tvDramas = tvSeries.filter(m => tvDramaTitles.includes(m.title));
    renderRow(tvDramas, document.getElementById('row-tv-dramas'));

    // 5. So Completely Captivating
    const captivatingTitles = ["Alice in Borderland", "The Vampire Diaries", "Human Vapor", "3 Body Problem", "Death Note", "Manifest", "My Demon"];
    const captivating = tvSeries.filter(m => captivatingTitles.includes(m.title));
    renderRow(captivating, document.getElementById('row-captivating'));
}

function populateMovieRows(selectedGenre = 'all') {
    let movies = allMovies.filter(m => m.type === 'movie');
    
    if (selectedGenre !== 'all') {
        movies = movies.filter(m => m.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
    }

    // Top 10 Movies in India Today
    const top10Titles = ["Border 2", "Raja Shivaji", "Ikkis", "Subedaar", "Vadh 2", "Assi", "Avengers: Doomsday", "Project Hail Mary", "Con City", "Ikka"];
    const top10Movies = top10Titles.map(title => movies.find(m => m.title === title)).filter(Boolean);
    renderTop10Row(top10Movies, document.getElementById('row-movie-top10'));

    // New Blockbusters & Anticipated Releases
    const blockbusterTitles = ["Border 2", "Raja Shivaji", "Subedaar", "Ikkis", "Project Hail Mary", "Avengers: Doomsday", "28 Years Later: The Bone Temple", "Masters of the Universe", "The Odyssey"];
    const blockbusterMovies = movies.filter(m => blockbusterTitles.includes(m.title));
    renderRow(blockbusterMovies, document.getElementById('row-new-blockbusters'));

    // Sci-Fi & Epic Fantasies
    const scifiTitles = ["Project Hail Mary", "Avengers: Doomsday", "Masters of the Universe", "The Odyssey", "Dune: Part Two", "Dune", "Inception", "The Matrix"];
    const scifiMovies = movies.filter(m => scifiTitles.includes(m.title));
    renderRow(scifiMovies, document.getElementById('row-scifi-spectacles'));

    // Horror & Psychological Thrillers
    const horrorTitles = ["Vadh 2", "Backrooms", "28 Years Later: The Bone Temple", "Obsession", "Send Help", "Bhoot Bangla", "Frankenstein"];
    const horrorMovies = movies.filter(m => horrorTitles.includes(m.title));
    renderRow(horrorMovies, document.getElementById('row-horror-thrillers'));

    // Hindi Cinema Highlights
    const hindiHighlightTitles = ["Raja Shivaji", "Subedaar", "Border 2", "Ikkis", "Azad Bharath", "Bihu Attack", "Assi", "Bhabiji Ghar Par Hain! Fun on the Run", "Main Vaapas Aaunga", "Governor: The Silent Saviour"];
    const hindiHighlightMovies = movies.filter(m => hindiHighlightTitles.includes(m.title));
    renderRow(hindiHighlightMovies, document.getElementById('row-hindi-highlights'));

    // Popular Releases & Comedies
    const popularTitles = ["Happy Patel Khatarnak Jasoos", "Tu Yaa Main", "Paro Pinaki Ki Kahani", "O Romeo", "Ek Din", "Chand Mera Dil", "Michael", "Coyote vs. Acme", "Office Romance", "Send Help"];
    const popularMovies = movies.filter(m => popularTitles.includes(m.title));
    renderRow(popularMovies, document.getElementById('row-popular-releases'));

    // Hindi Movies & TV
    const hindiTitles = ["Raja Shivaji", "Subedaar", "Border 2", "Ikkis", "Bhoot Bangla", "Mahavatara Narsimha", "Saiyaara", "Tere Ishk Mein", "Animal", "Jaat"];
    const hindiMovies = movies.filter(m => hindiTitles.includes(m.title));
    renderRow(hindiMovies, document.getElementById('row-hindi-movies'));

    // South Indian Films Dubbed in Hindi
    const southTitles = ["With Love", "29", "Idli Kadai", "Sing Geetham", "Meiyazhagan", "Made in Korea", "Devara", "Lucky Baskhar"];
    const southMovies = movies.filter(m => southTitles.includes(m.title));
    renderRow(southMovies, document.getElementById('row-south-dubbed'));

    // Emotional Movies
    const emotionalTitles = ["O Romeo", "Paro Pinaki Ki Kahani", "Ek Din", "Chand Mera Dil", "The Girlfriend", "The Great Flood", "Court", "Amaran", "Bison", "Even If This Love Disappears Tonight", "Main Vaapas Aaunga"];
    const emotionalMovies = movies.filter(m => emotionalTitles.includes(m.title));
    renderRow(emotionalMovies, document.getElementById('row-emotional-movies'));

    // Award-Winning Directors
    const directorTitles = ["Frankenstein", "Dune: Part Two", "Dune", "Lucy", "Gladiator II", "Fight Club", "Inception", "Interstellar"];
    const directorMovies = movies.filter(m => directorTitles.includes(m.title));
    renderRow(directorMovies, document.getElementById('row-award-directors'));

    // Comedies
    const comedyTitles = ["Happy Patel Khatarnak Jasoos", "Tu Yaa Main", "Paro Pinaki Ki Kahani", "Voicemails for Isabelle", "MohiniYattam", "Anaganaga Oka Raju", "Raakaasa", "Gatta Kusthi", "Little Hearts", "Coyote vs. Acme", "Office Romance", "Bhabiji Ghar Par Hain! Fun on the Run"];
    const comedyMovies = movies.filter(m => comedyTitles.includes(m.title));
    renderRow(comedyMovies, document.getElementById('row-movie-comedies'));

    // Suspenseful US Movies
    const usTitles = ["Apex", "War Machine", "Spider-Man: Homecoming", "Spider-Man: Far From Home", "Thrash", "Godzilla x Kong: The New Empire", "Inception", "The Dark Knight"];
    const usMovies = movies.filter(m => usTitles.includes(m.title));
    renderRow(usMovies, document.getElementById('row-suspenseful-us'));

    // Crime Movies
    const crimeTitles = ["Vadh 2", "Assi", "Ikka", "Dhurandhar", "Kara", "Lucky Baskhar", "Devara", "HIT: The Third Case", "Con City", "Animal", "Governor: The Silent Saviour"];
    const crimeMovies = movies.filter(m => crimeTitles.includes(m.title));
    renderRow(crimeMovies, document.getElementById('row-crime-movies'));
}

function populateSpecificRows() {
    // Thrillers
    const thrillers = allMovies.filter(m => m.genre.includes('Thriller'));
    renderRow(thrillers, document.getElementById('row-thrillers'));

    // TV Comedies
    const comedies = allMovies.filter(m => m.genre.includes('Comedy') && (m.type === 'series' || m.type === 'indian_serial'));
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
    renderPage('series');
});

if (genreSelect) {
    genreSelect.addEventListener('change', (e) => {
        if (currentCategory === 'series') {
            populateTvShowRows(e.target.value);
        } else if (currentCategory === 'movie') {
            populateMovieRows(e.target.value);
        }
    });
}

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
    if (!movies || movies.length === 0) {
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
                openModal(rec);
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
