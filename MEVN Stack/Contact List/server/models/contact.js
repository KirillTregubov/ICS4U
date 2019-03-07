var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  imagePath: String,
  phone: String,
  email: String,
  address: {
    street: String,
    city: String,
    province: String,
    postal: String
  }
});

var Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
