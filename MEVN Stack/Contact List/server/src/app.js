const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT || 8081);

mongoose.connect("mongodb://localhost:27017/posts");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", function(callback) {
  console.log("Connection Success");
});

var Contact = require("../models/contact");

// Uncomment line below to wipe database
// db.dropDatabase();

/* Upload photo
app.use( multer({
    dest: "./uploads/",
    rename: function(fieldname, filename) {
      return filename;
    }
  })
);*/

// Fetch all contacts
app.get("/contacts", (req, res) => {
  Contact.find({}, "", function(error, contacts) {
    // replace "" with "name" when done testing
    if (error) {
      console.error(error);
    }
    res.send({
      contacts: contacts
    });
  }).sort({
    "name.last": 1,
    "name.first": 1
  });
});

// Post new contact
app.post("/contact", (req, res) => {
  var data = req.body;
  var newContact = new Contact({
    name: data.name,
    img: data.img,
    phone: data.phone,
    email: data.email,
    address: data.address
  });

  newContact.save(function(error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true
    });
  });
});

// Fetch single post
app.get("/contact/:id", (req, res) => {
  Contact.findById(req.params.id, "", function(error, contact) {
    if (error) {
      console.error(error);
    }
    res.send(contact);
  });
});

// Update a post
app.put("/contact/:id", (req, res) => {
  Contact.findById(req.params.id, "", function(error, contact) {
    if (error) {
      console.error(error);
    }

    var data = req.body;
    contact.name = data.name;
    contact.img = data.img;
    contact.phone = data.phone;
    contact.emai = data.email;
    contact.address = data.address;

    contact.save(function(error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true
      });
    });
  });
});

// Delete a post
app.delete("/contact/:id", (req, res) => {
  Contact.remove(
    {
      _id: req.params.id
    },
    function(err, contact) {
      if (err) res.send(err);

      Contact.find({}, "", function(error, contacts) {
        if (error) {
          console.error(error);
        }
        console.log(JSON.stringify(contacts));
        res.send({
          contacts: contacts
        });
      }).sort({
        "name.last": 1,
        "name.first": 1
      });
    }
  );
});
