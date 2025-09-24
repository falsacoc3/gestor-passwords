const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar base de datos
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Error abriendo DB', err);
  } else {
    console.log('Base de datos conectada');
    // Crear tabla si no existe
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      correo TEXT NOT NULL,
      password TEXT NOT NULL
    )`);
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para guardar usuario
app.post('/guardar', (req, res) => {
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  const sql = 'INSERT INTO usuarios (correo, password) VALUES (?, ?)';
  db.run(sql, [nombre, password], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error al guardar' });
    }
    res.json({ mensaje: 'Guardado con éxito', id: this.lastID });
  });
});

// Ruta para obtener los registros (para tu dashboard)
app.get('/api/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al leer DB' });
    }
    res.json(rows);
  });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
