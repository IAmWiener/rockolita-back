const { getSpotifyAuthToken } = require('../services/spotifyService');
const axios = require('axios');

const searchTracks = async (req, res) => {
  try {
    const token = await getSpotifyAuthToken();
    const { query } = req.query;

    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit: 10,
      },
    });

    res.json(response.data.tracks.items);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching tracks from Spotify' });
  }
};

module.exports = { searchTracks };