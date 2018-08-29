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

mongoose.connect("mongodb://localhost/hata");

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
    quantity: Number,
    totalprice : Number

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
//     name: "sprite",
//     image: "https://cdn.pixabay.com/photo/2016/07/21/11/17/mineral-water-1532300__340.jpg",
//     Description: "this is cold drink",
//     price: 34
// });
// var event = new Inventory({
//       productName: "sprite",
//     quantity: 10
// });
// event.save();
// event1.save();
//ROUTES
app.get("/", function (req, res) {
    Product.find({}, function (err, newProduct) {
        if (err) {
            console.log(err);
        } else {
            res.render("mainframe", {product: newProduct});
        }
    });
});
app.get("/product/:id", function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            Inventory.findOne({productName:product.name},function(err,InventoryStock){
                if(err){
                    console.log(err);
                }else{
                   res.render("order", {product: product,stock:InventoryStock.quantity}); 
                }
            });
        }
    });

});

app.post("/confirm", function (req, res) {
        var updating = req.body.order['quantity'];
//        console.log(req.body.order['quantity']);
        var productName = req.body.order['product'];
            //console.log(req.body.order['product']);
    Order.create(req.body.order, function (err, newlyOrder) {
        if (err) 
        {
            console.log(err);
        } else 
        {
            Inventory.updateOne({productName:productName},{$inc:{"quantity": -updating}},function(err,updated){
                if(err)
                {
                    console.log(err);
                } else
                    {
                        console.log(updated);
                    }
            });
            res.render("orderSummary", {order: newlyOrder});
            //console.log(newlyOrder);
        }
    });
  
});

//After Cancelling the order
app.post("/confirm/:id", function(req,res){
    console.log(req.params.id);
    Order.findByIdAndRemove(req.params.id,function(err,founded){
        if(err){throw err;}
        else {
        var updating = founded.quantity;
         Inventory.updateOne({productName:founded.product},{$inc:{"quantity": updating}} ,function(err,cancelled){
        if(err){
            console.log(err);
        }else{
            console.log(cancelled);
        }
    });
    res.redirect("/");
        }
    });
  
});

app.listen(process.env.PORT,process.env.IP, function () {
    console.log("SErver started");
});