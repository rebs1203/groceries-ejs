const Groceries = require('../models/Groceries.js')

const getAllGroceries = async (req, res) => {
    try {
        const groceries = await Groceries.find({ createdBy: req.user.id }).sort("createdAt");
        res.render("groceries", { groceries });
    } catch (error) {
        res.status(500).json({error})
    }
}

const newProduct = async (req, res) => {
    const {
        body: { name, status }
    } = req;
    if (!name || !status) {
        req.flash("error", "Name or Status fields cannot be empty.");
        res.redirect("/groceries/new"); 
    } else {
        const newProduct = {
                name: name,
                createdBy: req.user._id,
                status: status
        }
        Groceries.create(newProduct)
        res.redirect("/groceries")
    }
};

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
        if(!product) {
            req.flash('error', 'Product not found')
            res.redirect("/groceries");     
        }
        res.render("product", { product })
    } catch (error) {
        req.flash('error', 'Undefined error')
        res.redirect("/groceries");
    }
}

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id
        const updatedProduct = {
            name: req.body.name || product.name,
            status: req.body.status || product.status
        }
        let product = await Groceries.findByIdAndUpdate({_id: id}, updatedProduct, { new: true, runValidators: true });

        if (!product) {
            req.flash('error', 'Product not found')
            res.redirect("/groceries"); 
        }
        res.redirect("/groceries")
    } catch (error) {
        req.flash('error', 'Undefined error')
        res.redirect("/groceries"); 
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            req.flash('error', 'Please provide Id')
            res.render("groceries",{errors: req.flash("error")}); 
        }
        const product = await Groceries.findByIdAndDelete(id)
        if (!product) {
            req.flash('error', 'Product not found')
            res.render("groceries",{errors: req.flash("error")}); 
        }
        
        res.redirect("/groceries"); 
    } catch (error) {
        req.flash('error', 'Undefined error')
        res.render("groceries",{errors: req.flash("error")}); 
    }
}


module.exports = {
    getAllGroceries,
    newProduct,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
}
