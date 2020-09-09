const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');
const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del Silencio'));
bands.addBand(new Band('Metallica'));

// Sockets Messages
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
    });

    client.on('vote-band', (payload) => { 
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => { 
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => { 
        bands.deleteBand(payload.id)
        io.emit('active-bands', bands.getBands());
    });

     client.on('mensaje', (payload) => {
         console.log('Mensaje!!', payload.nombre);
         io.emit('mensaje', {admin: 'Nuevo mensaje'});
     });

    //  client.on('escuchar-mensaje', (payload) => {
    //      // io.emit('nuevo-mensaje', payload); // emite a todos
    //      client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos al cliente que lo emitió
    //  });
});