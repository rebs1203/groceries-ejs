const express = require('express')
const router = express.Router()

const {
    getAllGroceries,
    newProduct,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/groceries.js')

router.route('/').get(getAllGroceries).post(addProduct)
router.route('/new').get(newProduct)
router.route('/update/:id').get(getProduct).post(updateProduct)
router.route('/delete/:id').post(deleteProduct)

module.exports = router