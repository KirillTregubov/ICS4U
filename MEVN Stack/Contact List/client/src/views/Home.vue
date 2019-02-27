<template>
  <section v-if="loading">
    <Preloader/>
  </section>
  <section class="home" v-else>
    <div v-if="contacts.length > 0">
      <div class="contactContainer">
        <div>
          <div class="container">
            <p @click="fetchContacts('image')">Picture</p>
            <p @click="fetchContacts('name')">Name</p>
            <p @click="fetchContacts('email')">Email</p>
            <p @click="fetchContacts('phone')">Phone</p>
            <p @click="fetchContacts('address')">Address</p>
            <p></p>
            <p></p>
          </div>
        </div>
        <div v-bind:key="contact._id" v-for="contact in slicedContacts">
          <Contact :contact="contact" @deleteContact="deleteContact"/>
        </div>
      </div>
      <div class="pagination">
        <a class="button" :class="{ disabled: !canPrevious }" @click="previousPage">Prev</a>
        <p>{{currentPage}}</p>
        <a class="button" :class="{ disabled: !canNext }" @click="nextPage">Next</a>
      </div>
    </div>
    <div id="error" v-else>
      <svg width="75" height="75" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-target"><path class="primary" d="M15.23 2.53l-.35.35a3 3 0 0 0-.8 1.4 8.01 8.01 0 1 0 5.64 5.63 3 3 0 0 0 1.4-.79l.35-.35A9.99 9.99 0 0 1 12 22a10 10 0 1 1 3.23-19.47zM13.55 6.2L11.75 8a4 4 0 1 0 4.24 4.25l1.8-1.8a6 6 0 1 1-4.24-4.25z"/><path class="secondary" d="M16 6.59V5a1 1 0 0 1 .3-.7l2-2A1 1 0 0 1 20 3v1h1a1 1 0 0 1 .7 1.7l-2 2a1 1 0 0 1-.7.3h-1.59l-4.7 4.7a1 1 0 0 1-1.42-1.4L16 6.58z"/></svg>
      <h2>Your contact list is empty! Consider adding a contact.</h2>
    </div>
    <div class="create">
      <router-link v-bind:to="{ name: 'NewContact' }" class="button">Create New</router-link>
    </div>
  </section>
</template>

<script>
import ContactService from '@/services/ContactService'
import Contact from '@/components/Contact.vue'
import Preloader from '@/components/Preloader.vue'

export default {
  name: 'Home',
  data () {
    return {
      loading: true,
      currentPage: 1,
      contacts: []
    }
  },
  computed: {
    searchedContacts: function () {
      return this.contacts.filter(contact => {
        return contact.name.first
          .toLowerCase()
          .match(this.searchQuery.toLowerCase())
      })
    },
    slicedContacts: function () {
      return this.searchedContacts.slice(
        this.currentPage * 5 - 5,
        this.currentPage * 5
      )
    },
    canPrevious: function () {
      return this.currentPage > 1
    },
    canNext: function () {
      return this.searchedContacts.length > this.currentPage * 5
    }
  },
  created () {
    this.fetchContacts('name')
  },
  methods: {
    async fetchContacts (sort) {
      const response = await ContactService.fetchContacts(sort)
      this.loading = false
      this.contacts = response.data.contacts
    },
    async deleteContact (id) {
      const response = await ContactService.deleteContact(id)
      this.contacts = response.data.contacts
    },
    previousPage: function () {
      if (this.canPrevious) {
        this.currentPage--
      }
    },
    nextPage: function () {
      if (this.canNext) {
        this.currentPage++
      }
    }
  },
  props: {
    searchQuery: String
  },
  components: {
    Contact,
    Preloader
  }
}
</script>

<style lang="scss">
.pagination, .create {
  display:flex;
  justify-content: center;
}
#error {
  display:grid;
  margin-top:100px;

  * {
    justify-self: center;
    align-self: center;
  }
  h2 {
    margin:10px;
    padding: 10px;
    background-color: $neutrals900;
    border: 2px solid $neutrals800;
    border-radius: 10px;
  }
}
.contactContainer{
  margin-top:100px;
}
.contactContainer > div {
  border: 2px solid $neutrals800;
  background-color: $neutrals900;
  border-radius: 10px;
  list-style: none;
  margin: 5px 25px 5px 25px;
  padding: 0;

  // &:first-child {
  //   border-bottom: none;
  //   border-bottom-left-radius: 0;
  //   border-bottom-right-radius: 0;

  //   + div {
  //     border-top-left-radius: 0;
  //     border-top-right-radius: 0;
  //     top-margin: 0;
  //   }
  // }

  // &:last-child {
  //   border-bottom: 2px solid $neutrals900;
  // }

  > div {
    margin: 0;
    padding: 1rem;
    display: grid;
    grid-template-columns: 50px 1fr 1fr 1fr 1fr 0.5fr 0.5fr;
    grid-gap: 1rem;

    * {
      justify-self: center;
      align-self: center;
    }
    svg,
    img {
      height: 50px;
    }
  }
}

</style>
