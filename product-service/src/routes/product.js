const router = require("express").Router();
const Product = require("../models/Product");
const pino = require('pino');

const logger = pino();


// Get Product
router.get("/find/:id", async (req, res) => {
  try {
    logger.info(`GETTING PRODUCT WITH ID ${req.params.id}`);
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Products
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products; 

    if(qNew){
        products = await Product.find().sort({createdAt: -1}).limit(1);
    } else if (qCategory){
        products = await Product.find({categories: {
            $in: [qCategory],
        }})
    }else {
        logger.info("GETTING ALL PRODUCTS");
        products = await Product.find({}, {__v:0, createdAt :0, updatedAt :0})
    }
    res.status(200).json(products)

  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Product
router.patch('/:id', async (req, res) => {
  try{
    const productId = req.params.id
    const updates = req.body

    logger.info(`UPDATED PRODUCT ${updates}`);

    const result = await Product.findByIdAndUpdate(productId, updates)
    res.status(200).json(result);
  
  }catch(err) {
    res.status(500).json(err);
  }
})

// Delete Product
router.delete("/:id", async (req, res) => {
  try {
    logger.info(`DELETED PRODUCT WITH ID ${req.params.id}`);
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;