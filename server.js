const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 3100; 

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect('mongodb://localhost:27017/perfilesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());

const PerfilUsuario = mongoose.model('PerfilUsuario', {
  user_is: String,
  fotoPerfil: String,
  nombre: String,
  cargo: String,
  direccion: String,
  estudios: String,
  certificaciones: [{ type: String }] 
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express!');
});

app.get('/perfil', async (req, res) => {
    console.log('obteniendo datos de perfil')
    try {
      const perfiles = await PerfilUsuario.find();
      res.status(200).json(perfiles);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los perfiles de usuario' });
    }
  });

app.get('/cargos', async (req, res) => {
  try {
    const cargos = await PerfilUsuario.distinct('cargo');
    res.json(cargos);
  } catch (error) {
    console.error('Error al obtener los cargos:', error);
    res.status(500).json({ message: 'Error al obtener los cargos' });
  }
});

app.post('/llamar-funcion-python', (req, res) => {
  try {
    const data = req.body; 
    const jsonData = JSON.stringify(data); 
    const pythonProcess = exec('python lenticular_function.py', { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    // const pythonProcess = exec('python lenticular_function.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar la función: ${error}`);
        return res.status(500).send('Error interno del servidor');
      }
      const result = JSON.parse(stdout); 
      console.log('se obtuvo result')
      res.json(result); 
    });

    pythonProcess.stdin.write(jsonData); 
    pythonProcess.stdin.end(); 
  } catch (err) {
    console.error(`Error interno del servidor: ${err}`);
    res.status(500).send('Error interno del servidor');
  }
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).send({ error: 'Invalid JSON payload' });
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
 
module.exports = {
PerfilUsuario
};
