const artistsCache = "cachedArtists";
const albumCache = "cachedAlbums";
const tracksCache = "cachedTracks";
const trackApi = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
const albumApi = "https://corsproxy.io/?https://api.deezer.com/album/";
const artistApi = "https://corsproxy.io/?https://api.deezer.com/artist/";
const searchApi = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWVhZDUyMTJkN2IxMTAwMTkwZTZkY2IiLCJpYXQiOjE3MTAxNjg2MjcsImV4cCI6MTcxMTM3ODIyN30.Js9yWPVZ-_WVXu5nVOvuKTIW9yEyXbD3UJ5A-Deo6LA";

const init = async () => {
    localStorage.clear();
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get("artistId");

    if (artistId) {
        const artist = await fetchArtistDetails(artistId);
        const tracks = await fetchArtistTracks(artistId);

        if (
            artist &&
            tracks &&
            Array.isArray(tracks.data) &&
            tracks.data.length >= 3
        ) {
            displayArtistDetails(artist);
            displayTracksDetails(tracks);
        } else {
            console.error("Error: Invalid artist or tracks data.");
        }
    }
};

const fetchArtistDetails = async (artistId) => {
    const cachedArtist = localStorage.getItem(`artist-${artistId}`);
    if (cachedArtist) {
        const artist = JSON.parse(cachedArtist);
        return artist;
    } else {
        try {
            const response = await fetch(`${artistApi}${artistId}`, {
                method: "GET",
            });
            const artist = await response.json();
            localStorage.setItem(`artist-${artistId}`, JSON.stringify(artist));
            return artist;
        } catch (error) {
            console.error("Error fetching artist details:", error);
            return null;
        }
    }
};

const fetchArtistTracks = async (artistId) => {
    const cachedTracks = localStorage.getItem(`tracks-${artistId}`);
    if (cachedTracks) {
        const tracks = JSON.parse(cachedTracks);
        return tracks;
    } else {
        try {
            const response = await fetch(`${trackApi}${artistId}/top?limit=3`, {
                method: "GET",
            });
            const tracks = await response.json();
            localStorage.setItem(`tracks-${artistId}`, JSON.stringify(tracks));
            return tracks;
        } catch (error) {
            console.error("Error fetching artist tracks:", error);
            return null;
        }
    }
};

const fetchArtistAlbums = async (artistId) => {
    const cachedArtist = localStorage.getItem(`artist-${artistId}`);
    if (cachedArtist) {
        const artist = JSON.parse(cachedArtist);
        return artist;
    } else {
        try {
            const response = await fetch(`${artistApi}${artistId}`, {
                method: "GET",
            });
            const artist = await response.json();
            localStorage.setItem(`artist-${artistId}`, JSON.stringify(artist));
            return artist;
        } catch (error) {
            console.error("Error fetching artist details:", error);
            return null;
        }
    }
};

const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
};

const displayArtistDetails = (artist) => {
    const artistNameElement = document.getElementById("artist-name");
    const artistImageElement = document.getElementById("artist-image");
    const artistFollowersElement = document.getElementById("artist-followers");
    const artistAlbumsElement = document.getElementById("artist-albums");

    artistNameElement.textContent = artist.name;
    artistImageElement.style.backgroundImage = `url(${artist.picture_xl})`;
    artistImageElement.style.backgroundSize = "cover";
    artistImageElement.style.backgroundRepeat = "no-repeat";
    artistFollowersElement.textContent = `${artist.nb_fan} ascoltatori mensili`;
    artistAlbumsElement.textContent = `${artist.nb_album} album`;
};

const displayTracksDetails = (tracks) => {
    const song1 = document.getElementById("song-1");
    const song2 = document.getElementById("song-2");
    const song3 = document.getElementById("song-3");
    const duration1 = document.getElementById("duration-1");
    const duration2 = document.getElementById("duration-2");
    const duration3 = document.getElementById("duration-3");

    if (song1 && song2 && song3 && duration1 && duration2 && duration3 && tracks && Array.isArray(tracks.data) && tracks.data.length >= 3) {
        song1.textContent = tracks.data[0].title;
        song2.textContent = tracks.data[1].title;
        song3.textContent = tracks.data[2].title;
        duration1.textContent = formatDuration(tracks.data[0].duration);
        duration2.textContent = formatDuration(tracks.data[1].duration);
        duration3.textContent = formatDuration(tracks.data[2].duration);
    } else {
        console.error("Error: One or more elements not found or invalid track data.");
    }
};


document.addEventListener("DOMContentLoaded", () => {
    init();
});
