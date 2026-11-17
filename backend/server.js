const express = require('express');
const cors = require ('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Sikeres csatlakozás a MongoDB adatbázishoz!'))
  .catch((err) => console.error('MongoDB csatlakozási hiba:', err));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

app.get('/', (req, res) => {
    res.send('Website is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

