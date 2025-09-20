const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Crear/conectar base de datos SQLite
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS contrasenas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    password TEXT
  )
`);

// Ruta para guardar una nueva contraseña
app.post('/guardar', (req, res) => {
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  db.run(`INSERT INTO contrasenas (nombre, password) VALUES (?, ?)`, [nombre, password], function (err) {
    if (err) {
      console.error('Error al guardar:', err.message);
      return res.status(500).json({ mensaje: 'Error al guardar' });
    }
    res.json({ mensaje: 'Contraseña guardada correctamente' });
  });
});

// Ruta para obtener todas las contraseñas
app.get('/datos', (req, res) => {
  db.all(`SELECT * FROM contrasenas`, [], (err, rows) => {
    if (err) {
      console.error('Error al leer:', err.message);
      return res.status(500).json({ mensaje: 'Error al leer' });
    }
    res.json(rows);
  });
});

// Ruta para servir el archivo HTML principal (opcional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
