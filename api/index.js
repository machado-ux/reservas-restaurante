// Punto de entrada para Vercel: todas las rutas pasan por la app Express
const path = require('path');
const app = require(path.join(__dirname, '..', 'Sistema de reservas restaurante.js'));
module.exports = app;
