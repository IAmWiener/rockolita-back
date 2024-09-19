require('dotenv').config();
const express = require('express');
const path = require('path');
const { addToQueue, listQueue, getNextInQueue } = require('./services/queueService');  // Importar la función listQueue
const app = express();
const PORT = 3000;

app.use(express.json());
const cors = require('cors');
app.use(cors());

// Endpoint para agregar una canción a la cola
app.post('/api/queue/add', async (req, res) => {
  try {
    const song = req.body;
    const result = await addToQueue(song);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error adding song to queue' });
  }
});

// Endpoint para listar la cola de canciones
app.get('/api/queue/list', async (req, res) => {
  try {
    const queue = await listQueue();
    res.json(queue);  // Enviar la lista de canciones como respuesta
  } catch (error) {
    res.status(500).json({ error: 'Error fetching queue' });
  }
});

// Endpoint para obtener y eliminar la siguiente canción en la cola
app.post('/api/queue/next', async (req, res) => {
  try {
    const nextSong = await getNextInQueue();
    if (nextSong) {
      res.json(nextSong);
    } else {
      res.json({ message: 'Queue is empty' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting next song from queue' });
  }
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});