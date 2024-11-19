const express = require('express');
const path = require('path');

const app = express();

// Servir los archivos estáticos del directorio `dist`
app.use(express.static(__dirname + '/dist/minuta'));

// Redirigir todas las rutas al archivo `index.html`
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/minuta/index.html'));
});

// Iniciar el servidor en el puerto proporcionado por Heroku o el 8080
app.listen(process.env.PORT || 8080);
