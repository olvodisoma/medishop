const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token és Admin ellenőrző middleware
const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Nincs hitelesítési token.' });

  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'titkos_kulcs');
    const user = await User.findById(verified.id || verified._id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Hozzáférés megtagadva. Admin jogosultság szükséges.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Érvénytelen token.' });
  }
};

// Összes termék lekérése
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Egy adott termék lekérése ID alapján
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Termék nem található' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Új termék hozzáadása
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Termék sikeresen létrehozva!', product: savedProduct });
  } catch (err) {
    console.error('Hiba termék mentésekor:', err);
    res.status(500).json({ message: 'Szerverhiba történt a termék mentése során.' });
  }
});

module.exports = router;