// Punto de entrada para Vercel: todas las rutas pasan por la app Express
// Forzamos __dirname del servidor principal a la raíz del proyecto (un nivel arriba de api/)
const path = require('path');
const projectRoot = path.resolve(__dirname, '..');

// Override __dirname antes de cargar el módulo para que sendFile funcione
const originalDirname = __dirname;
const serverPath = path.join(projectRoot, 'Sistema de reservas restaurante.js');

// Cargar el módulo con el path correcto
const app = require(serverPath);
module.exports = app;
