
require('dotenv').config();
const dotenv = require('dotenv');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');


dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('uploads'));
app.use(bodyParser.json());


// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto carlos Cart ${PORT}`));
