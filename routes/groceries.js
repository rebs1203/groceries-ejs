const express = require('express')
const router = express.Router()

const {
    getAllGroceries,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/groceries.js')

router.route('/').get(getAllGroceries).post(addProduct)
router.route('/new').get(getProduct)
router.route('/update/:id').post(updateProduct)
router.route('/delete/:id').post(deleteProduct)

module.exports = router