const artistsCache = "cachedArtists";
const albumCache = "cachedAlbums";
const tracksCache = "cachedTracks";
const trackApi = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
const albumByArtist = `https://corsproxy.io/?https://api.deezer.com/artist/`;
const albumApi = "https://corsproxy.io/?https://api.deezer.com/album/";
const artistApi = "https://corsproxy.io/?https://api.deezer.com/artist/";
const searchApi = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWVhZDUyMTJkN2IxMTAwMTkwZTZkY2IiLCJpYXQiOjE3MTAxNjg2MjcsImV4cCI6MTcxMTM3ODIyN30.Js9yWPVZ-_WVXu5nVOvuKTIW9yEyXbD3UJ5A-Deo6LA";

const init = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const albumId = urlParams.get("albumId");

  if (albumId) {
    const album = await fetchAlbum(albumId)
  }
};

const fetchAlbum = async (albumId) => {
    try {
      const response = await fetch(`${albumApi}${albumId}`);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const album = await response.json();
      console.log("Fetched album:", album);
  
      return album;
    } catch (error) {
      console.error("Error fetching album:", error);
      return null;
    }
  };
  
  
  



document.addEventListener("DOMContentLoaded", () => {
  init();
});
