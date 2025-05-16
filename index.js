require('dotenv').config();
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();

const sessionRoutes = require('./routes/sessionRoutes');

app.use(express.json());  // Para poder manejar JSON en las peticiones
app.use('/api/wa', sessionRoutes);  // Define las rutas para interactuar con las sesiones

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
