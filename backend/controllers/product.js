const Product = require("../models/product");
const formidable = require("formidable")
const _  = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, nexy, id) => {

    Product.findById(id)
    .populate("category")
    .exec((err, product) =>{
        if(err || !user){
            return res.status(400).json({error: "USer not found"});
        }
        req.product = product;
        next();
    })
};

exports.createProduct = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields , file) => {

        if(err){
            return res.status(400).json({error: "some error occured due to image file"});
        }

        // destructure the fields
        const {name, description, price, category, stock} = fields;

        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "Please include all the fields"
            });
        }

        let product = new Product(fields);

        // handle image file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({error: "file size too big"});
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // save to db
        product.save((err, product) => {
            if(err){
                return res.status(400).json({error:"saving product failed"});
            }

            res.json(product);
        });
    });
};

exports.getProduct = (req, res) => {
    
    req.product.photo = undefined;
    return res.json(req.product);
};

// middleware
exports.photo = (req, res, next) => {

    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

// update controller
exports.updateProduct = (req, res) => {
    
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields , file) => {

        if(err){
            return res.status(400).json({error: "some error occured due to image file"});
        }

        // updation code
        let product = req.product;
        product = _.extend(product, fields)

        // handle image file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({error: "file size too big"});
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // save to db
        product.save((err, product) => {
            if(err){
                return res.status(400).json({error:"updation of product failed"});
            }

            res.json(product);
        });
    });
};

// delete controller
exports.removeProduct = (req, res) => {
    
    let product = req.product;
    product.remove((err, deletedProduct) => {

        if(err || !deletedProduct){
            return res.status(400).json(`Failed to delete the product ${product}`);
        }

        res.json({
            message: "product deleted",
            deletedProduct
        })
    })
};

// product listing
exports.getAllProducts = (req, res) => {
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 8 ;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id" ;

    Product.find()
    .sort([[sortBy, "asc"]])
    .populate("category")
    .select("-photo")
    .limit(limit)
    .exec((err, products) => {
        if(err || !products){
            return res.status(400).json({message:" no products found"});
        }

    });
};  

exports.getAllUniqueCategories = (req, res) =>{
    
    Product.distinct("category", {}, (err, categories) =>{
        if(err || !categories){
            return res.status(400).json({error: "no categories found"});
        }

        return res.json(categories);
    });
}

exports.updateStock = (req, res, next) =>{

    let myOperations = req.body.order.products.map((product) => {
        return {
            updateOne: {
                filter: {_id : product._id },
                update: { $inc: {stock: -product.count, sold: +product.count, } }
            }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, result) => {
        if(err || !result){
           return res.status(400).json({message: "bulk updations failed"});
        }

        next();
    });
}
