<template>
  <div class="form">
    <div class="center">
      <h1>Create Contact</h1>
    </div>
    <div class="center container">
      <img v-if="imagePath" :src="image" height="75" width="75" alt="Icon">
      <svg
        v-else
        height="75"
        width="75"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="icon-user-add"
      >
        <path class="primary" d="M9 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"></path>
        <path
          class="secondary"
          d="M17 9V7a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2zm-1 10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"
        ></path>
      </svg>
      <input
        type="file"
        ref="file"
        @change="onFileChange(
          $event.target.name, $event.target.files)"
      >
      <h5 :class="{ error: errorDialog }">{{errorText}}</h5>
    </div>
    <div class="inputBox">
      <input
        type="text"
        placeholder="John"
        v-model="firstName"
        @input="firstName = sanitizeInput(firstName)"
        required
      >
      <span class="bar"></span>
      <label>First Name</label>
      <h5 :class="{ error: firstNameError }">First name required!</h5>
    </div>
    <div class="inputBox">
      <input
        type="text"
        placeholder="Doe"
        v-model="lastName"
        @input="lastName = sanitizeInput(lastName)"
        required
      >
      <span class="bar"></span>
      <label>Last Name</label>
      <h5 :class="{ error: lastNameError }">Last name required!</h5>
    </div>
    <div class="inputBox">
      <input
        type="text"
        placeholder="(416) 123-4567"
        v-model="phone"
        @input="phone = sanitizeInput(phone)"
        required
      >
      <span class="bar"></span>
      <label>Phone Number</label>
      <h5 :class="{ error: phoneError }">Phone incorrect!</h5>
    </div>
    <div class="inputBox">
      <input
        type="text"
        placeholder="jdoe@company.com"
        v-model="email"
        @input="email = sanitizeInput(email)"
        required
      >
      <span class="bar"></span>
      <label>Email</label>
      <h5 :class="{ error: emailError }">Email incorrect!</h5>
    </div>
    <div class="inputBox">
      <input
        type="text"
        placeholder="123 Moatfield Rd"
        v-model="street"
        @input="street = sanitizeInput(street)"
        required
      >
      <span class="bar"></span>
      <label>Street</label>
      <h5 :class="{ error: streetError }">Street {{streetWord}}!</h5>
    </div>
    <div class="inputBox">
      <input
        type="text"
        placeholder="Toronto"
        v-model="city"
        @input="city = sanitizeInput(city)"
        required
      >
      <span class="bar"></span>
      <label>City</label>
      <h5 :class="{ error: cityError }">City {{cityWord}}!</h5>
    </div>
    <div class="container bonusWidth">
      <vue-single-select
        v-model="province"
        :options="canadianProvincesLong"
        placeholder="Select a Province"
        :required="true"
      ></vue-single-select>
      <h5 :class="{ error: provinceError }">Province {{provinceWord}}!</h5>
    </div>
    <div class="inputBox">
      <input
        type="text"
        placeholder="A1B 2C3"
        v-model="postal"
        @input="postal = sanitizeInput(postal)"
        required
      >
      <span class="bar"></span>
      <label>Postal Code</label>
      <h5 :class="{ error: postalError }">Postal Code {{postalWord}}!</h5>
    </div>
    <div class="center">
      <a class="button" @click="checkForm">Update Contact</a>
    </div>
  </div>
</template>

<script>
import ContactService from '@/services/ContactService'
import VueSingleSelect from 'vue-single-select'

export default {
  name: 'EditContact',
  data () {
    return {
      firstName: '',
      lastName: '',
      imagePath: '',
      phone: '',
      email: '',
      street: '',
      city: '',
      province: '',
      postal: '',
      firstNameError: false,
      lastNameError: false,
      imagePathError: false,
      phoneError: false,
      emailError: false,
      streetError: false,
      cityError: false,
      provinceError: false,
      postalError: false,
      streetWord: 'incorrect',
      cityWord: 'incorrect',
      provinceWord: 'incorrect',
      postalWord: 'incorrect',
      errorDialog: null,
      errorText: '',
      maxSize: 1024,
      formData: new FormData(),
      canadianProvincesLong: [
        'Alberta',
        'British Columbia',
        'Manitoba',
        'New Brunswick',
        'Newfoundland and Labrador',
        'Northwest Territories',
        'Nova Scotia',
        'Nunavut',
        'Ontario',
        'Prince Edward Island',
        'Quebec',
        'Saskatchewan',
        'Yukon Territory'
      ]
    }
  },
  computed: {
    image: function () {
      return 'http://localhost:8081/' + this.imagePath
    }
  },
  mounted () {
    this.fetchContact()
  },
  methods: {
    sanitizeInput: function (model) {
      if (
        model === this.firstName ||
        model === this.lastName ||
        model === this.street ||
        model === this.city
      ) {
        model = this.titleCase(model)
      } else if (model === this.email) {
        model = model.toLowerCase()
      } else if (model === this.postal) {
        model = model.toUpperCase()
        if (model.length > 3 && model.slice(3, 4) !== ' ') {
          model = model.slice(0, 3) + ' ' + model.slice(3)
        }
      } else if (model === this.phone) {
        var cleaned = ('' + model).replace(/\D/g, '')
        var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
        if (match) {
          var intlCode = match[1] ? '+1 ' : ''
          model = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join(
            ''
          )
        }
      }
      return model
    },
    checkForm: function (e) {
      var errors = []

      if (!this.firstName) {
        errors.push('first required.')
        this.firstNameError = true
      } else {
        this.firstNameError = false
      }
      if (!this.lastName) {
        errors.push('last required.')
        this.lastNameError = true
      } else {
        this.lastNameError = false
      }
      if (this.phone && !this.validatePhone(this.phone)) {
        errors.push('Valid phone required.')
        this.phoneError = true
      } else {
        this.phoneError = false
      }
      if (this.email && !this.validateEmail(this.email)) {
        errors.push('Valid email required.')
        this.emailError = true
      } else {
        this.emailError = false
      }
      if (this.street || this.city || this.postal || this.province) {
        this.streetWord = this.cityWord = this.provinceWord = this.postalWord =
          'required'
        if (!this.street || !this.validateStreet(this.street)) {
          errors.push('Valid street required.')
          if (this.street) this.streetWord = 'incorrect'
          this.streetError = true
        } else {
          this.streetError = false
        }
        if (!this.city || !this.validateCity(this.city)) {
          errors.push('Valid city required.')
          if (this.city) this.cityWord = 'incorrect'
          this.cityError = true
        } else {
          this.cityError = false
        }
        if (!this.province) {
          errors.push('Valid province required.')
          this.provinceError = true
        } else {
          this.provinceError = false
        }
        if (!this.postal || !this.validatePostal(this.postal.toUpperCase())) {
          errors.push('Valid postal required.')
          if (this.postal) this.postalWord = 'incorrect'
          this.postalError = true
        } else {
          this.postalError = false
        }
      } else if (!this.street && !this.city && !this.postal && !this.province) {
        this.streetError = false
        this.cityError = false
        this.provinceError = false
        this.postalError = false
      }

      if (errors.length < 1) {
        this.updateContact()
      }
    },
    validateEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    validatePhone: function (phone) {
      var re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
      return re.test(phone)
    },
    validateStreet: function (street) {
      var re = /^\d+\s[A-z]+\s[A-z]+$/
      return re.test(street)
    },
    validateCity: function (city) {
      var re = /([a-zA-Z]+|[a-zA-Z]+\\s[a-zA-Z]+)$/
      return re.test(city)
    },
    validatePostal: function (postal) {
      var re = /[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]$/
      return re.test(postal)
    },
    titleCase: function (str) {
      var splitStr = str.toLowerCase().split(' ')
      for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] =
          splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
      }
      // Directly return the joined string
      return splitStr.join(' ')
    },
    onFileChange: async function (fieldName, file) {
      const { maxSize } = this
      let imageFile = file[0]
      this.errorDialog = false

      // check if user actually selected a file
      if (file.length > 0) {
        let size = imageFile.size / maxSize / maxSize
        if (!imageFile.type.match('image.*')) {
          // check whether the upload is an image
          this.errorDialog = true
          this.errorText = 'Please choose an image file'
        } else if (size > 1) {
          // check whether the size is greater than the size limit
          this.errorDialog = true
          this.errorText = 'Uploaded image is too big!'
        } else {
          // Append file into FormData & turn file into image URL
          this.formData = new FormData()
          this.formData.append('image', imageFile, imageFile.name)
          const response = await ContactService.uploadImage(this.formData)

          if (response.data.path) {
            this.imagePath = response.data.path
            // success
          }
        }
      }
    },
    async fetchContact () {
      const response = await ContactService.fetchContact({
        id: this.$route.params.id
      })
      this.firstName = response.data.name.first
      this.lastName = response.data.name.last
      this.imagePath = response.data.imagePath
      this.phone = response.data.phone
      if (this.phone === '(999) 999-99999') {
        this.phone = ''
      }
      this.email = response.data.email
      if (this.email === 'zzzzzzzzzzzzzzzzzzzzzzzzz') {
        this.email = ''
      }
      this.province = response.data.address.province
      if (this.province !== 'Z') {
        this.street = response.data.address.street
        this.city = response.data.address.city
        this.postal = response.data.address.postal
      } else {
        this.province = ''
      }
    },
    async updateContact () {
      await ContactService.updateContact({
        id: this.$route.params.id,
        name: {
          first: this.firstName,
          last: this.lastName
        },
        imagePath: this.imagePath,
        phone: this.phone,
        email: this.email,
        address: {
          street: this.street,
          city: this.city,
          province: this.province,
          postal: this.postal
        }
      })
      this.$router.push({ name: 'Home' })
    }
  },
  components: {
    VueSingleSelect
  }
}
</script>
<style lang="scss" scoped>
.form {
  margin: 75px 0 75px 0;
  display: grid;
  justify-content: center;
  grid-template-columns: auto auto;
  grid-gap: 1rem;

  > div {
    margin: 25px 0 25px 0;
  }

  > .center {
    grid-column-start: 1;
    grid-column-end: span 2;
    grid-template-columns: auto auto;
    display: grid;
    justify-content: center;

    input {
      align-self: center;
    }
    img,
    svg {
      margin-right: 25px;
    }
    h5 {
      grid-column-start: 1;
      grid-column-end: span 2;
    }
  }
}
.error {
  display: block;
}

.bonusWidth {
  width: 250px;
}

/* Dropdown */
.dropdown {
  display: inline-block;
  z-index: 999;
  position: relative;
}

.dd-button {
  display: inline-block;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 10px 30px 10px 20px;
  background-color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
}

.dd-button:after {
  content: "";
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid black;
}

.dd-button:hover {
  background-color: #eeeeee;
}

.dd-input {
  display: none;
}

.dd-menu {
  position: absolute;
  top: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0;
  margin: 2px 0 0 0;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  list-style-type: none;
}

.dd-input + .dd-menu {
  display: none;
}

.dd-input:checked + .dd-menu {
  display: block;
}

.dd-menu li {
  padding: 10px 20px;
  cursor: pointer;
  white-space: nowrap;
}

.dd-menu li:hover {
  background-color: #f6f6f6;
}

.dd-menu li a {
  display: block;
  margin: -10px -20px;
  padding: 10px 20px;
}

.dd-menu li.divider {
  padding: 0;
  border-bottom: 1px solid #cccccc;
}

/* Input Box
===========================*/
.inputBox {
  text-align: left;
  position: relative;
  margin-top: 45px;
  margin: 30px 0 15px 0;
  width: 250px;

  * {
    width: 100% !important;
  }

  input {
    background-color: inherit;
    font-size: 18px;
    padding: 10px 0 10px 0;
    display: block;
    width: 100vw;
    border: none;
    border-bottom: 1px solid #fff;
    color: #a0a1ae;

    &::-webkit-input-placeholder {
      color: transparent;
    }

    &:-moz-placeholder {
      color: transparent;
    }

    &::-moz-placeholder {
      color: transparent;
    }

    &:-ms-input-placeholder {
      color: transparent;
    }

    &:focus::-webkit-input-placeholder {
      color: #515363;
    }

    &:focus:-moz-placeholder {
      color: #515363;
    }

    &:focus::-moz-placeholder {
      color: #515363;
    }

    &:focus:-ms-input-placeholder {
      color: #515363;
    }

    &:focus {
      outline: none;
    }
  }
}

label {
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  top: 10px;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}

/* active state */
input:focus ~ label,
input:valid ~ label {
  top: -20px;
  font-size: 14px;
  color: $primary;
}

.bar {
  position: relative;
  display: block;
  width: 100%;
}

.bar:before,
.bar:after {
  position: absolute;
  content: "";
  height: 2px;
  width: 0;
  bottom: 0;
  background: $primary;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}

.bar:before {
  left: 50%;
}

.bar:after {
  right: 50%;
}

/* active state */
input:focus ~ .bar:before,
input:focus ~ .bar:after {
  width: 50%;
}

@-webkit-keyframes inputHighlighter {
  from {
    background: $primary;
  }

  to {
    width: 0;
    background: transparent;
  }
}

@-moz-keyframes inputHighlighter {
  from {
    background: $primary;
  }

  to {
    width: 0;
    background: transparent;
  }
}

@keyframes inputHighlighter {
  from {
    background: $primary;
  }

  to {
    width: 0;
    background: transparent;
  }
}
</style>
