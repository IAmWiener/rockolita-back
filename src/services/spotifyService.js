const axios = require('axios');
const qs = require('querystring');

const getSpotifyAuthToken = async () => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const response = await axios.post(tokenUrl, qs.stringify({
    grant_type: 'client_credentials',
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
    },
  });
  return response.data.access_token;
};

module.exports = { getSpotifyAuthToken };