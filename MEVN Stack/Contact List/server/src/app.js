const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  }, filename: function(req, file, cb) {
    cb(null, file.originalname); // Date.now() + 
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 5
}, fileFilter: fileFilter});

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'))
app.listen(process.env.PORT || 8081);

mongoose.connect("mongodb://localhost:27017/posts", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", function(callback) {
  console.log("Connection Success");
});

var Contact = require("../models/contact");

// Uncomment line below to wipe database
//db.dropDatabase();

// Fetch all contacts
app.get("/contacts:filter", (req, res) => {
  var sortingObject = {};
  if (req.params.filter == "name") {
    sortingObject = {
      "name.last": 1,
      "name.first": 1
    };
  } else if (req.params.filter == "email") {
    sortingObject = {
      "email": 1,
      "name.last": 1,
      "name.first": 1
    };
  } else if (req.params.filter == "phone") {
    sortingObject = {
      "phone": 1,
      "name.last": 1,
      "name.first": 1
    };
  } else if (req.params.filter == "address") {
    sortingObject = {
      "address.province": 1,
      "address.city": 1,
      "name.last": 1,
      "name.first": 1
    };
  } else if (req.params.filter == "image") {
    sortingObject = {
      "imagePath": -1,
      "name.last": 1,
      "name.first": 1
    };
  }
  Contact.find({}, "", function(error, contacts) {
    // replace "" with "name" when done testing
    if (error) {
      console.error(error);
    }
    res.send({
      contacts: contacts
    });
  }).sort(sortingObject);
});

// Upload image
app.post("/upload", upload.single('image'), (req, res) => {
  if(req.file) {
    res.send({
      path: req.file.path
    });
  }
});

// Post new contact
app.post("/contact", (req, res) => {
  var data = req.body;
  var newContact = new Contact({
    name: data.name,
    imagePath: data.imagePath,
    phone: data.phone,
    email: data.email,
    address: data.address
  });
  console.log(data.email)
  if (data.email == "") {
    newContact.email = "zzzzzzzzzzzzzzzzzzzzzzzzz";
  }
  if (data.phone == "") {
    newContact.phone = "(999) 999-99999";
  }
  if (data.address.province == "") {
    newContact.address.province = "Z";
  }
    
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
    contact.email = data.email;
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
    }
  );
});
