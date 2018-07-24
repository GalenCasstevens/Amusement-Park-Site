var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override");

var hostname = "127.0.0.1";
var port = 3000;

mongoose.connect("mongodb://localhost:27017/parks");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

var parkSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    description: String
});

var Park = mongoose.model("Park", parkSchema);

// RESTful routes
app.get("/", function(req, res) {
    res.render("landing");
});

// index route
app.get("/amusementparks", function(req, res) {
    Park.find({}, function(err, allParks) {
       if(err) {
           console.log(err);
       } else {
           res.render("index", {parks: allParks});
       }
    });
});

// new route
app.get("/amusementparks/new", function(req, res) {
   res.render("new");
});

// create route
app.post("/amusementparks", function(req, res) {
    Park.create(req.body.park, function(err, newPark) {
       if(err) {
           res.render("new");
       } else {
           res.redirect("/amusementparks");
       }
    });
});

// show route
app.get("/amusementparks/:id", function(req, res) {
   Park.findById(req.params.id, function(err, foundPark) {
       if(err) {
           res.redirect("/amusementparks");
       } else {
           res.render("show", {park: foundPark});
       }
   });
});

// edit route
app.get("/amusementparks/:id/edit", function(req, res) {
   Park.findById(req.params.id, function(err, foundPark) {
      if(err) {
          res.redirect("/amusementparks");
      } else {
          res.render("edit", {park: foundPark});
      }
   });
});

// update route
app.put("/amusementparks/:id", function(req, res) {
   Park.findByIdAndUpdate(req.params.id, req.body.park, function(err, updatedPark) {
      if(err) {
          res.redirect("/amusementparks");
      } else {
          res.redirect("/amusementparks/" + req.params.id);
      }
   });
});

// delete route
app.delete("/amusementparks/:id", function(req, res) {
    Park.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/amusementparks");
        }
         else {
            res.redirect("/amusementparks");
        }
    })
})

app.listen(port, hostname, function() {
    console.log("Server starting...");
});