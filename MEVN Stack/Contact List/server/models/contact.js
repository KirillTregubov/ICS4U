var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  img: {
    data: Buffer,
    contentType: String
  },
  phone: [
    {
      type: Number
    }
  ],
  email: [
    {
      type: String
    }
  ],
  address: {
    street: String,
    city: String,
    province: String,
    postal: String
  }
});

var Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
