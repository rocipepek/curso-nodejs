const Products = require('../../mongo/models/products');

const createProduct = async (req, res) => {
  try {
    const { title, desc, price, images, userId } = req.body;

    const product = await Products.create({
      title,
      desc,
      price,
      images,
      user: userId,
    });
    res.send({ status: 'OK', data: product });
  } catch (error) {
    console.log(`createProduct ${error}`);
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

//const deleteProduct = (req, res) => {};

const getProducts = async (req, res) => {
  try {
    const products = await Products.find({
      //obtiene los productos mayores a 400 $gt es prop de mongo
      price: { $gt: 400 },
    })
      .populate('user', 'username email data role')
      .select('title desc price');
    res.send({ status: 'OK', data: products });
  } catch (error) {
    console.log('getProducts', error);
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const getProductByUser = async (req, res) => {
  try {
    const products = await Products.find({
      user: req.params.userId,
    });
    res.send({ status: 'OK', data: products });
  } catch (error) {
    console.log('getProducts', error);
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

module.exports = {
  createProduct,
  //deleteProduct,
  getProducts,
  getProductByUser,
};
