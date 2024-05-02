// import productsModel from '../models/product.model.js';

// const productsController = {};

// productsController.getAllProducts = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10; 
//         const skip = (page - 1) * limit;

//         const totalProducts = await productsModel.countDocuments();
//         const totalPages = Math.ceil(totalProducts / limit);

//         const products = await productsModel.find().skip(skip).limit(limit);

//         const prevPage = page > 1 ? page - 1 : null;
//         const nextPage = page < totalPages ? page + 1 : null;

//         res.send({
//             status: "success",
//             payload: products,
//             total_pages: totalPages,
//             current_page: page,
//             prev_page: prevPage,
//             next_page: nextPage,
//             has_prev_page: prevPage !== null,
//             has_next_page: nextPage !== null
//         });
//     } catch (error) {
//         console.error("No se pudo obtener productos con mongoose: " + error);
//         res.status(500).send({ error: "No se pudo obtener productos con mongoose", message: error });
//     }
// };

// productsController.createProduct = async (req, res) => {
//     try {
//         let { title, description, code, price, stock, category } = req.body;
//         let product = await productsModel.create({ title, description, code, price, stock, category });
//         res.send({ result: "success", payload: product });
//     } catch (error) {
//         console.error("No se pudo crear el producto con Mongoose: " + error);
//         res.status(500).send({ error: "No se pudo crear el producto con Mongoose", message: error });
//     }
// };

// export default productsController;
import productsRepository from '../repositories/productsRepository.js';

const productsController = {};


productsController.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { payload: products, total_pages: totalPages } = await productsRepository.getAllProducts(page, limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        res.render('viewProducts', {
            status: "success",
            payload: products,
            total_pages: totalPages,
            current_page: page,
            prev_page: prevPage,
            next_page: nextPage,
            has_prev_page: prevPage !== null,
            has_next_page: nextPage !== null
        });
    } catch (error) {
        console.error("No se pudo obtener productos:", error);
        res.status(500).send({ error: "No se pudo obtener productos", message: error });
    }
};


productsController.getProductById = async (req, res) => {
    try {
        const product = await productsMongoRepository.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }
        res.render('productDetails', { product });
    } catch (error) {
        console.error("Error al obtener detalles del producto:", error);
        res.status(500).send({ error: "Error al obtener detalles del producto", message: error });
    }
};

productsController.addProductToCart = async (req, res) => {
    try {
        const productId = req.params.pid;
        const cart = await cartsRepository.getCart(); 
        if (!cart) {
            return res.status(404).send({ error: "No hay carritos disponibles" });
        }
        cart.products.push(productId);
        await cart.save();
        res.redirect('/api/products'); 
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send({ error: "Error al agregar producto al carrito", message: error });
    }
};


productsController.createProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;
        const product = await productsRepository.createProduct({ title, description, code, price, stock, category });
        res.status(201).send({ status: "success", payload: product });
    } catch (error) {
        console.error("No se pudo crear el producto:", error);
        res.status(500).send({ error: "No se pudo crear el producto", message: error });
    }
};

productsController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { title, description, code, price, stock, category } = req.body;
        const updatedProduct = await productsRepository.updateProduct(productId, { title, description, code, price, stock, category });
        if (!updatedProduct) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }
        res.status(200).send({ status: "success", payload: updatedProduct });
    } catch (error) {
        console.error("No se pudo actualizar el producto:", error);
        res.status(500).send({ error: "No se pudo actualizar el producto", message: error });
    }
};

productsController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await productsRepository.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }
        res.status(200).send({ status: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error("No se pudo eliminar el producto:", error);
        res.status(500).send({ error: "No se pudo eliminar el producto", message: error });
    }
};

export default productsController;
