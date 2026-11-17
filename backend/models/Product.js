const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, 'A termék nevének megadása kötelező!'],
            trim: true
        },
        description:{
            type: String,
            required: [true, 'A termék leírásának megadása kötelező!'],
        },
        price:{
            type: Number,
            required: [true, 'A termék árának megadása kötelező!'],
            min: [0, 'Az ár nem lehet negatív!']
        },
        category:{
            type: String,
            required: [true, 'A termék kategóriájának megadása kötelező!'],
            enum: 
            [
                'Diagnosztikai eszközök',
                'Védőfelszerelések',
                'Elsősegély készletek',
                'Ápolási kellékek',
                'Fertőtlenítő szerek',
            ]
        },
        stock:{
            type: Number,
            required: [true, 'A termék készletének megadása kötelező!'],
            min: [0, 'A készlet nem lehet negatív!']
        },
        imageUrl:{
            type: String,
            default: 'https://via.placeholder.com/300'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);