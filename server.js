const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Base de datos SQLite
const db = new sqlite3.Database('./db.sqlite');
db.run(`CREATE TABLE IF NOT EXISTS contrasenas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  password TEXT
)`);

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Aquí no hay errores, así debe ir

// Ruta para guardar contraseñas
app.post('/guardar', (req, res) => {
  const { nombre, password } = req.body;
  db.run(`INSERT INTO contrasenas (nombre, password) VALUES (?, ?)`, [nombre, password], function(err) {
    if (err) return res.status(500).json({ mensaje: 'Error al guardar' });
    res.json({ mensaje: 'Contraseña guardada' });
  });
});

// Ruta para obtener todas las contraseñas
app.get('/datos', (req, res) => {
  db.all(`SELECT * FROM contrasenas`, [], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al leer' });
    res.json(rows);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
