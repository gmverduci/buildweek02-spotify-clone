const albumApi = 'https://striveschool-api.herokuapp.com/api/deezer/album/';
const artistApi = 'https://striveschool-api.herokuapp.com/api/deezer/artist/';
const searchApi = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWVhZDUyMTJkN2IxMTAwMTkwZTZkY2IiLCJpYXQiOjE3MTAxNjg2MjcsImV4cCI6MTcxMTM3ODIyN30.Js9yWPVZ-_WVXu5nVOvuKTIW9yEyXbD3UJ5A-Deo6LA';

/* const genres = ['rock', 'pop', 'country', 'rap/hip hop', 'jazz', 'kids', 'indie', 'folk', 'electro', 'spirituality & religion', 'classical']; */
const artists = ['Eminem', 'Coldplay', 'Cascada', 'Radiohead', 'Adele', 'Daft-Punk', 'Drake',
                'Rihanna', 'Linkin-Park', 'Sfera-Ebbasta', 'Kanye-West', 'Martin-Garrix',
                'Alan-Walker', 'Gabry-Ponte', 'Dua-Lipa', 'Billie-Eilish', 'Avicii', 'Fall-Out-Boy',
                'Taylor-Swift', 'Katy-Perry', 'Ed-Sheeran', 'The-Chainsmokers', 'Lady-Gaga',
                'Nicki-Minaj', 'Bruno-Mars', 'Imagine-Dragons', 'David-Guetta', 'Justin-Bieber',
                'Sia'];
            
const altArtists = ['Eminem', 'Coldplay', 'Cascada', 'Radiohead', 'Adele', 'Daft Punk', 'Drake',
                'Rihanna', 'Linkin Park', 'Sfera Ebbasta', 'Kanye West', 'Martin Garrix',
                'Alan Walker', 'Gabry Ponte', 'Dua Lipa', 'Billie Eilish', 'Avicii', 'Fall Out Boy',
                'Taylor Swift', 'Katy Perry', 'Ed Sheeran', 'The Chainsmokers', 'Lady Gaga',
                'Nicki Minaj', 'Bruno Mars', 'Imagine Dragons', 'David Guetta', 'Justin Bieber',
                'Sia'];

document.addEventListener('DOMContentLoaded', () => {
    /* loadHomePage(); */
    loadRandomArtists();
    loadRandomAlbums();
})

const fetchRandomArtists = async () => {
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    try {
        const response = await fetch(`${artistApi}${randomArtist}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const artist = await response.json();
        return artist;
    } catch (error) {
        console.error('Error fetching artists:', error);
    }
}

const loadRandomArtists = async () => {
    try {
        let fetchedArtists = [];

        for (let i = 0; i < artists.length; i++) {
            const randomArtist = await fetchRandomArtists();
            if (randomArtist && randomArtist.id) {
                fetchedArtists.push(randomArtist);
            }
        }

        const uniqueArtists = Array.from(new Set(fetchedArtists.map(artist => artist.id)))
                                  .map(id => fetchedArtists.find(artist => artist.id === id));
        const randomArtists = uniqueArtists.sort(() => 0.5 - Math.random()).slice(0, 7);

        console.log(randomArtists);

        const artistsContainer = document.getElementById('');
        artistsContainer.innerHTML = '';

        uniqueArtists.forEach(artist => {
            const artistElement = createArtistCard(artist);
            artistsContainer.appendChild(artistElement);
        });

    } catch (error) {
        console.error('Error loading artists:', error);
    }
}

const createArtistCard = (artist) => {
    const card = document.createElement('div');
    card.className = '';

    const image = document.createElement('img');
    image.src = artist.picture_medium;
    picture.alt = `Picture of ${artist.name}`;
    picture.className = '';

    const name= document.createElement('h3');
    name.innerHTML = artist.name;
    name.className = '';

    card.appendChild(image);
    card.appendChild(name);

    const artistsContainer = document.getElementById('');
    artistsContainer.appendChild(card);
}

const fetchRandomAlbumsByArtist = async () => {
    const randomArtist = altArtists[Math.floor(Math.random() * altArtists.length)];
    try {
        const response = await fetch(`${searchApi}${randomArtist}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const album = await response.json();
        if (album.data.length > 0) {
            const randomAlbumIndex = Math.floor(Math.random() * album.data.length);
            return album.data[randomAlbumIndex];
        }
        return null;
    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}

const loadRandomAlbums = async () => {
    try {
        let fetchedAlbums = [];

        for (let i = 0; i < altArtists.length; i++) {
            const randomAlbum = await fetchRandomAlbumsByArtist();
            if (randomAlbum && randomAlbum.id) {
                fetchedAlbums.push(randomAlbum);
            }
        }

        const uniqueAlbums = Array.from(new Set(fetchedAlbums.map(album => album.id)))
                                  .map(id => fetchedAlbums.find(album => album.id === id));
        const randomAlbums = uniqueAlbums.sort(() => 0.5 - Math.random()).slice(0, 10);

        console.log(randomAlbums);

        const albumsContainer = document.getElementById('');
        albumsContainer.innerHTML = '';

        randomAlbums.forEach(album => {
            const albumElement = createAlbumCard(album);
            albumsContainer.appendChild(albumElement);
        });

    } catch (error) {
        console.error('Error loading albums:', error);
    }
}

const createAlbumCard = (album) => {
    const card = document.createElement('div');
    card.className = '';

    const coverImg = document.createElement('img');
    coverImg.src = album.cover_medium; 
    coverImg.alt = `Cover of ${album.title}`;
    coverImg.className = '';

    const title = document.createElement('h3');
    title.textContent = album.title;
    title.className = '';

    const artistName = document.createElement('p');
    artistName.textContent = album.artist.name;
    artistName.className = '';

    card.appendChild(coverImg);
    card.appendChild(title);
    card.appendChild(artistName);

    return card;
}

/* const loadHomePage = async () => {
    try {
        const albumResponse = await fetch(albumApi + '75621062', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const albumData = await albumResponse.json();
        const albums = albumData.data;
        console.log(albumData);

        const albumsContainer = document.getElementById('');
        albumsContainer.innerHTML = '';

        albums.forEach(album => {
            const albumElement = createAlbumCard(album);
            albumsContainer.appendChild(albumElement);
        })
    } catch (error) {
        console.error('Error loading home page: ' + error);
    }
} */