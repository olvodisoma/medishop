const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Név megadása kötelező'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email cím megadása kötelező'],
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Érvénytelen email cím formátum'],
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Jelszó megadása kötelező'],
            minlength: [6, 'A jelszónak legalább 6 karakter hosszúnak kell lennie'],
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);