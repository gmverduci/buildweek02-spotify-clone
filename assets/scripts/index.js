const albumApi = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const artistApi = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
const searchApi = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWVhZDUyMTJkN2IxMTAwMTkwZTZkY2IiLCJpYXQiOjE3MTAxNTM2MjIsImV4cCI6MTcxMTM2MzIyMn0.u6bKga8tYk8gkq4zmGwLzp2iyCJmCw8pNKdVHF_lqbo";

/* const genres = ['rock', 'pop', 'country', 'rap/hip hop', 'jazz', 'kids', 'indie', 'folk', 'electro', 'spirituality & religion', 'classical']; */
const artists = [
  "Eminem",
  "Coldplay",
  "Cascada",
  "Radiohead",
  "Adele",
  "Daft Punk",
  "Drake",
  "Rihanna",
  "Linkin Park",
  "Sfera Ebbasta",
  "Kanye West",
  "Martin Garrix",
  "Alan Walker",
  "Gabry Ponte",
  "Dua Lipa",
  "Billie Eilish",
  "Avicii",
  "Fall Out Boy",
  "Taylor Swift",
  "Katy Perry",
  "Ed Sheeran",
  "The Chainsmokers",
  "Lady Gaga",
  "Nicki Minaj",
  "Bruno Mars",
  "Imagine Dragons",
  "David Guetta",
  "Justin Bieber",
  "Sia",
];

document.addEventListener("DOMContentLoaded", () => {
  loadHomePage();
  loadRandomAlbums();
});

const fetchRandomAlbumsByArtist = async () => {
  const randomArtist = artists[Math.floor(Math.random() * artists.length)];
  const response = await fetch(`${searchApi}${randomArtist}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.data;
};

const loadRandomAlbums = async () => {
  try {
    let fetchedAlbums = [];

    for (let i = 0; i < artists.length; i++) {
      const randomAlbums = await fetchRandomAlbumsByArtist();
      fetchedAlbums = fetchedAlbums.concat(randomAlbums);
    }

    const uniqueAlbums = Array.from(
      new Set(fetchedAlbums.map((album) => album.id))
    ).map((id) => fetchedAlbums.find((album) => album.id === id));
    const randomAlbums = uniqueAlbums
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    console.log(randomAlbums);

    const albumsContainer = document.getElementById("");
    albumsContainer.innerHTML = "";

    randomAlbums.forEach((album) => {
      const albumElement = createAlbumCard(album);
      albumsContainer.appendChild(albumElement);
    });
  } catch (error) {
    console.error("Error fetching random albums:", error);
  }
};

const loadHomePage = async () => {
  try {
    const albumResponse = await fetch(albumApi + "75621062", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const albumData = await albumResponse.json();
    const albums = albumData.data;
    console.log(albumData);

    const albumsContainer = document.getElementById("");
    albumsContainer.innerHTML = "";

    albums.forEach((album) => {
      const albumElement = createAlbumCard(album);
      albumsContainer.appendChild(albumElement);
    });
  } catch (error) {
    console.error("Error loading home page: " + error);
  }
};

const createAlbumCard = (album) => {
  const card = document.createElement("div");
  card.className = "";

  const coverImg = document.createElement("img");
  coverImg.src = album.cover_medium;
  coverImg.alt = `Cover of ${album.title}`;
  coverImg.className = "";

  const title = document.createElement("h3");
  title.textContent = album.title;
  title.className = "";

  const artistName = document.createElement("p");
  artistName.textContent = album.artist.name;
  artistName.className = "";

  card.appendChild(coverImg);
  card.appendChild(title);
  card.appendChild(artistName);

  return card;
};
