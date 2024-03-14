const artistsCache = "cachedArtists";
const albumCache = "cachedAlbums";
const tracksCache = "cachedTracks";
const trackApi = "https://striveschool-api.herokuapp.com/api/deezer/artist/";

const albumApi = "https://corsproxy.io/?https://api.deezer.com/album/";
const artistApi = "https://corsproxy.io/?https://api.deezer.com/artist/";
const searchApi = "https://corsproxy.io/?https://api.deezer.com/search?q=";
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWVhZDUyMTJkN2IxMTAwMTkwZTZkY2IiLCJpYXQiOjE3MTAxNjg2MjcsImV4cCI6MTcxMTM3ODIyN30.Js9yWPVZ-_WVXu5nVOvuKTIW9yEyXbD3UJ5A-Deo6LA";

const artists = [
    719, 275373, 11, 13, 3381, 2468, 1005, 412, 848, 927, 636, 210, 176, 115, 863,
    1379, 637, 405, 415, 1154, 849, 868, 663, 847, 3307, 3350, 817, 808, 1723,
    687, 5292, 820, 1032, 239, 2048, 2799, 1658, 9052, 2025, 3, 2, 2519, 1309,
];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const init = async () => {
    localStorage.clear();

    console.log("Local Storage Support:", "localStorage" in window);
    console.log("Local Storage Usage:", localStorage.length);
    console.log("Local Storage Quota:", navigator.storage.estimate());

    try {
        await loadRandomArtists();
        const cachedArtists = JSON.parse(localStorage.getItem(artistsCache));
        let allAlbums = [];
        let allTracks = [];
        for (const artist of cachedArtists) {
            const artistId = artist.id;
            const albums = await loadRandomAlbums(artistId);
            allAlbums = allAlbums.concat(albums);
            const tracks = await loadRandomTracks(artistId);
            allTracks = allTracks.concat(tracks);
        }
        localStorage.setItem(albumCache, JSON.stringify(allAlbums));
        localStorage.setItem(tracksCache, JSON.stringify(allTracks));
    } catch (error) {
        console.error("Initialization error", error);
    }
};

const fetchRandomArtist = async () => {
    let cachedArtists = localStorage.getItem(artistsCache);
    if (cachedArtists) {
        return JSON.parse(cachedArtists);
    }

    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    try {
        await delay(0);

        const response = await fetch(`${artistApi}${randomArtist}`, {
            method: "GET",
        });
        if (!response.ok) {
            console.error(`Error fetching artist: ${response.statusText}`);
            return null;
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Non-JSON response received");
            return null;
        }
        const artist = await response.json();
        artist.id = randomArtist;
        return artist;
    } catch (error) {
        console.error("Error fetching artist:", error);
        return null;
    }
};

const loadRandomArtists = async () => {
    let fetchedArtists = [];
    const selectedArtistIds = new Set();

    while (fetchedArtists.length < 7) {
        const randomIndex = Math.floor(Math.random() * artists.length);
        const randomArtistId = artists[randomIndex];

        if (!selectedArtistIds.has(randomArtistId)) {
            selectedArtistIds.add(randomArtistId);
            const artist = await fetchRandomArtist(randomArtistId);
            if (artist) {
                fetchedArtists.push(artist);
            }
        }
    }

    console.log("Fetched artists before storing:", fetchedArtists);
    if (fetchedArtists.length > 0) {
        localStorage.setItem(artistsCache, JSON.stringify(fetchedArtists));
        console.log("Stored artists in local storage:", fetchedArtists);
    } else {
        console.error("No artists fetched successfully.");
    }
};

const loadRandomAlbums = async (artistId) => {
    try {
        await delay(0);

        const response = await fetch(`${searchApi}${artistId}`, {
            method: "GET",
        });
        if (!response.ok) {
            console.error(`Error fetching albums: ${response.statusText}`);
            return null;
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Non-JSON response received");
            return null;
        }
        const data = await response.json();
        if (data.data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.data.length);
            const album = data.data[randomIndex];
            console.log("Fetched album:", album);
            return album;
        } else {
            console.error("No albums fetched successfully.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching albums:", error);
        return null;
    }
};

const loadRandomTracks = async (artistId) => {
    try {
        await delay(0);

        const response = await fetch(`${trackApi}${artistId}/top?limit=10`, {
            method: "GET",
        });
        if (!response.ok) {
            console.error(`Error fetching tracks: ${response.statusText}`);
            return null;
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Non-JSON response received");
            return null;
        }
        const data = await response.json();
        if (data.data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.data.length);
            const track = data.data[randomIndex];
            console.log("Fetched track:", track);
            return track;
        } else {
            console.error("No tracks fetched successfully.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching tracks:", error);
        return null;
    }
};

document.addEventListener("DOMContentLoaded", init);


