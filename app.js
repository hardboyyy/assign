var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var method = require("method-override");

app.use(method("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost/Assignment");

//MODELS
var productDetails = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number
});

var orderSchema = new mongoose.Schema({
    companyName: String,
    pincode: Number,
    product: String,
    quantity: Number

    //created : {type: Date , default : Date.now}
});

var inventorySchema = new mongoose.Schema({
    productName: String,
    quantity: Number
});
var Product = mongoose.model("Product", productDetails);
var Order = mongoose.model("Order", orderSchema);
var Inventory = mongoose.model("Inventory", inventorySchema);


// var event1 = new Product({
//     name: "mountaindewe",
//     image: "https://cdn.pixabay.com/photo/2016/07/21/11/17/mineral-water-1532300__340.jpg",
//     Description: "this is cold drink",
//     price: 34
// });

// event1.save(function (err, doc) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("successfully saved: ", doc);
//     }
// });
// console.log(event1);
//ROUTES
app.get("/", function (req, res) {
    Product.find({}, function (err, newProduct) {
        if (err) {
            console.log(err);
        } else {
            res.render("mainframe", {
                product: newProduct
            });
        }
    });
});
app.get("/product/:id", function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            res.render("confirm", {
                product: product
            });
            console.log(product);
        }
    });

});

app.post("/confirm", function (req, res) {

    Order.create(req.body.order, function (err, newlyOrder) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyOrder);
        }
    });
    Order.find({}, function (err, updatedOrder) {
        if (err) {
            console.log(err);
        } else {
            res.render("form", {
                order: updatedOrder
            });
        }
    });
});

app.listen(8000, function () {
    console.log("SErver started");
});