<template>
  <section class="main">
    <div v-if="contacts.length > 0">
      <div v-bind:key="contact.id" v-for="contact in contacts">
        <!-- <p>{{contact._id}}</p> -->
        <p>{{contact.name.first}}</p>
        <p>{{contact.name.last}}</p>
      </div>
    </div>
    <div v-else></div>
  </section>
</template>

<script>
import ContactService from '@/services/ContactService'

export default {
  name: 'mainView',
  data () {
    return {
      contacts: []
    }
  },
  mounted () {
    this.fetchContacts()
  },
  methods: {
    async fetchContacts () {
      const response = await ContactService.fetchContacts()
      this.contacts = response.data.contacts
      console.log(response.data.contacts)
    },
    async deleteContact (id) {
      const response = await ContactService.deleteContact(id)
      this.contacts = response.data.contacts
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
