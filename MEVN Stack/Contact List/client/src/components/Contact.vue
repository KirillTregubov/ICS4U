<template>
    <div class="container">
        <div v-if="contact.imagePath" class="inline">
          <img :src="image" height="50" width="50" alt="Icon">
        </div>
        <div v-else>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-user"><path class="primary" d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/><path class="secondary" d="M21 20v-1a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v1c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2z"/></svg>
        </div>
        <p>{{contact.name.first}} {{contact.name.last}}</p>
        <p v-if="contact.email && contact.email != 'zzzzzzzzzzzzzzzzzzzzzzzzz'">{{contact.email}}</p>
        <p v-else>No Email</p>
        <p v-if="contact.phone && contact.phone != '(999) 999-99999'">{{contact.phone}}</p>
        <p v-else>No Phone</p>
        <p v-if="contact.address.street">{{contact.address.street}}<br/>{{contact.address.city}}<br/>{{contact.address.province}}<br/>{{contact.address.postal}}</p>
        <p v-else>No Address</p>
        <router-link v-bind:to="{ name: 'EditContact', params: { id: contact._id } }" class="button">Edit</router-link>
        <a @click="deleteContact(contact._id)" class="button">Delete</a>
    </div>
</template>

<script>
export default {
  name: 'Contact',
  props: {
    contact: Object
  },
  computed: {
    image: function () {
      return 'http://localhost:8081/' + this.contact.imagePath
    }
  },
  methods: {
    deleteContact: function (id) {
      this.$emit('deleteContact', id)
    }
  }
}
</script>

<style lang="scss">
svg, img, p, .inline {
  display: inline-block;
}
svg {
  .primary {
    fill: $primary;
  }
  .secondary {
    fill: $primary800;
  }
}
img {
  border-radius: 50%;
}
</style>
