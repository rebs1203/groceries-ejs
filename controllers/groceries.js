const Groceries = require('../models/Groceries.js')

const getAllGroceries = async (req, res) => {
    try {
        res.status(200).json({ groceries: Groceries });
    } catch (error) {
        res.status(500).json({error})
    }
}

const addProduct = (req, res) => {
    res.render("product", { product: null })
    const product = req.body
    if(product) {
        const newProduct = {
            name: req.body.name,
            addedby: req.user._id,
            status: req.body.status
        }
        Groceries.push(newProduct)
        res.json({groceries: Groceries})
    }
}

const getProduct = async (req, res) => {
    const id = req.params.id

    try {
        const product = await Groceries.findById(id)
        res.status(200).json({product})
    } catch (error) {
        res.status(404).json({msg: 'Id not found'})
        req.flash('error', 'Id not found')
    }
}

const updateProduct = (req, res) => {
    const id = req.params.id

    try {
        let product = Groceries.findById(id)

        if (!product) {
            res.status(404).json({msg: 'Id not found'})
            req.flash('error', 'Id not found')
        }

        const updatedProduct = {
            name: req.body.name || existingProduct.name,
            addedby: existingProduct.addedby,
            status: req.body.status || existingProduct.status
        }

        product = updatedProduct
        res.status(200).json({product})
    } catch (error) {
        res.status(500).json({error})
    }
}

const deleteProduct = (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            req.flash('error', 'Please provide Id')
        }
        Groceries.findByIdAndDelete(id)
        
        res.status(200).json({msg: 'Item deleted'})
    } catch (error) {
        res.status(404).json({msg: 'Id not found'})
        req.flash('error', 'Id not found')
    }
}


module.exports = {
    getAllGroceries,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
}
