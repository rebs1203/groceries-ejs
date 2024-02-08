const mongoose = require('mongoose')

const GroceriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please type product name']
    },
    status: {
        type: String, 
        enum: ['pending', 'bought', 'not found'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, {timestamps:true})

module.exports = mongoose.model('Groceries', GroceriesSchema)