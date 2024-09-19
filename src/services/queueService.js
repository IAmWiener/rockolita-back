const amqp = require('amqplib');

let channel;

// Conectar a RabbitMQ
async function connectToRabbitMQ() {
  if (!channel) {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('musicQueue', { durable: true });
  }
  return channel;
}

// Agregar canción a la cola
async function addToQueue(song) {
  const channel = await connectToRabbitMQ();
  const songData = {
    id: song.id,            // ID de la canción
    name: song.name,        // Nombre de la canción
    artist: song.artist,    // Artista
    preview_url: song.preview_url // URL de vista previa
  };
  channel.sendToQueue('musicQueue', Buffer.from(JSON.stringify(songData)), { persistent: true });
  return { message: 'Song added to queue', song: songData };
}

// Obtener la cola de canciones sin borrarlas (modo lista)
async function listQueue() {
  const channel = await connectToRabbitMQ();
  let messages = [];

  // Obtener todas las canciones de la cola
  let queueStatus = await channel.checkQueue('musicQueue');
  for (let i = 0; i < queueStatus.messageCount; i++) {
    const msg = await channel.get('musicQueue', { noAck: true }); // noAck: true evita el borrado
    if (msg) {
      const song = JSON.parse(msg.content.toString());
      messages.push(song);
    }
  }

  return messages;
}

// Avanzar en la cola (recuperar y borrar la primera canción)
async function getNextInQueue() {
  const channel = await connectToRabbitMQ();
  const msg = await channel.get('musicQueue', { noAck: false });
  if (msg) {
    const song = JSON.parse(msg.content.toString());
    channel.ack(msg); // Borrar mensaje de la cola
    return song;
  } else {
    return null;
  }
}

module.exports = {
  addToQueue,
  listQueue,    // Exportar la función de listar cola
  getNextInQueue
};