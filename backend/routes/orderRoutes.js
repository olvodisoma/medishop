const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Token ellenőrző middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Nincs hitelesítési token.' });
  
  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'titkos_kulcs');
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Érvénytelen token.' });
  }
};

// Új rendelés leadása
router.post('/', verifyToken, async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'A kosár üres.' });
    }

    const order = new Order({
      user: req.user.id || req.user._id,
      orderItems: orderItems.map(item => ({
        name: item.name,
        price: item.price,
        product: item._id
      })),
      shippingAddress,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json({ message: 'Sikeres rendelés!', order: createdOrder });
  }catch (err) {
    console.error('Hiba rendelés mentésekor:', err);
    res.status(500).json({ message: 'Szerverhiba történt a rendelés során.' });
  }
});

// Összes rendelés lekérése (Kizárólag Admin számára)
router.get('/', verifyToken, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id || req.user._id);

    // Itt a role === 'admin' ellenőrzést használjuk, ami az adatbázisodban is van
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Hozzáférés megtagadva. Admin jogosultság szükséges.' });
    }

    // Helyes Mongoose sort használat a rendezéshez
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Hiba rendelések lekérésekor:', err);
    res.status(500).json({ message: 'Szerverhiba történt a rendelések lekérésekor.' });
  }
});

// Rendelés státuszának frissítése (Kizárólag Admin számára)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id || req.user._id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Hozzáférés megtagadva. Admin jogosultság szükséges.' });
    }

    const { status } = req.body; // Pl. "Elfogadva", "Teljesítve", "Elutasítva"
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'A rendelés nem található.' });
    }

    order.status = status || 'Elfogadva';
    const updatedOrder = await order.save();

    res.json({ message: 'Rendelés státusza sikeresen frissítve!', order: updatedOrder });
  } catch (err) {
    console.error('Hiba a státusz frissítésekor:', err);
    res.status(500).json({ message: 'Szerverhiba történt a státusz módosításakor.' });
  }
});

module.exports = router;