const { addSongToQueue, getNextSongInQueue, getQueueFromRabbitMQ  } = require('../services/queueService');
const { getSpotifyAuthToken } = require('../services/spotifyService');
const axios = require('axios');

// Añadir una canción a la cola
const addSong = async (req, res) => {
  const { songId } = req.body;
  try {
    const token = await getSpotifyAuthToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const song = response.data;
    await addSongToQueue(song);  // Añadir la canción a la cola

    res.json({ message: 'Song added to queue', song });
  } catch (error) {
    res.status(500).json({ error: 'Error adding song to queue' });
  }
};

// Obtener la siguiente canción en la cola
const playNextSong = async (req, res) => {
  try {
    const nextSong = await getNextSongInQueue();
    if (nextSong) {
      res.json({ message: 'Playing next song', nextSong });
    } else {
      res.json({ message: 'No songs in the queue' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error playing next song' });
  }
};

// (Opcional) Obtener todas las canciones en la cola
const getQueue = async (req, res) => {
  try {
    const queue = await getQueueFromRabbitMQ ();
    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching queue' });
  }
};

module.exports = { addSong, playNextSong, getQueue };