const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000; // Puedes usar cualquier puerto que desees

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/perfilesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware para habilitar CORS
app.use(cors());

// Definir el modelo de datos
const PerfilUsuario = mongoose.model('PerfilUsuario', {
  user_is: String,
  fotoPerfil: String,
  nombre: String,
  direccion: String,
  estudios: String,
  certificaciones: String
});

// Middleware para analizar solicitudes JSON
app.use(bodyParser.json());

// Ruta para manejar solicitudes POST
// app.post('/perfil', async (req, res) => {
//   try {
//     const perfil = new PerfilUsuario(req.body);
//     await perfil.save();
//     res.status(201).send(perfil);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// Ruta para manejar solicitudes Get
app.get('/perfil', async (req, res) => {
    console.log('obteniendo datos de perfil')
    try {
      const perfiles = await PerfilUsuario.find();
      res.status(200).json(perfiles);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los perfiles de usuario' });
    }
  });
  

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
 
module.exports = {
PerfilUsuario
};
