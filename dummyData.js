const mongoose = require('mongoose');
const PerfilUsuario = require('./server').PerfilUsuario; // Importa el modelo

mongoose.connect('mongodb://localhost:27017/perfilesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const perfilesDummy = [
  {
    fotoPerfil: 'URL_de_la_foto',
    nombre: 'Usuario 1',
    direccion: 'Dirección 1',
    estudios: 'Estudios del usuario 1',
    certificaciones: 'Certificaciones del usuario 1'
  },
  {
    fotoPerfil: 'URL_de_la_foto',
    nombre: 'Usuario 2',
    direccion: 'Dirección 2',
    estudios: 'Estudios del usuario 2',
    certificaciones: 'Certificaciones del usuario 2'
  }
];

async function insertDummyData() {
  try {
    await PerfilUsuario.deleteMany(); // Borra todos los perfiles existentes
    await PerfilUsuario.insertMany(perfilesDummy); // Inserta los perfiles dummy
    console.log('Datos dummy insertados correctamente.');
    mongoose.connection.close(); // Cierra la conexión después de insertar los datos
  } catch (error) {
    console.error('Error al insertar datos dummy:', error);
  }
}

insertDummyData();
