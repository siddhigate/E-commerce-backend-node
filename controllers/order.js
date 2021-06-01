const {Order,ProductCart} = require("../models/order");

exports.getOrderById = (req,res, next,id) =>{

    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order)=>{
        if(err || !order){
            return res.status(400).json({error: "no orders found in db"});
        }
        req.order = order;
        next();
    })
};

exports.createOrder = (req, res) => {

    req.body.order.user = req.profile;

    const order = new Order(req.body.order);

    order.save((err, order) => {
        if(err){
            res.status(400).json({error: "couldn't save"});
        }
        res.json(order)
    })
    
};

exports.getAllOrders = (req, res) => {

    Order.find()
    .populate("user"," _id name")
    .exec((err, orders) => {
        if(err || !orders){
            return res.status(404).json({message: "no orders found"});
        }
        res.json(orders);
    })
};

exports.getOrderStatus = (req,res) => {

    res.json(Order.schema.path("status").enumValues)
};

exports.updateStatus = (req,res) => {
    
    Order.findOneAndUpdate(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err){
                return res.status(400).json({
                    error: "can't update order"
                })
            }
            res.json(order)
        }
    )
};