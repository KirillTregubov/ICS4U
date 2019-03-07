<template>
  <nav>
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
      <li class="right"><SearchBox @search="search"/></li>
    </ul>
  </nav>
</template>

<script>
import SearchBox from '@/components/SearchBox.vue'

export default {
  name: 'Navigation',
  methods: {
    search: function (searchQuery) {
      this.$emit('search', searchQuery)
    }
  },
  components: {
    SearchBox
  }
}
</script>

<style lang="scss" scoped>
nav {
  height: 3em;
  padding: 0 2vw;
  background-color: $neutrals900;
  font-size: 1.1em;
  -webkit-transition: opacity 200ms linear;
  transition: opacity 200ms linear;

  ul {
    height: 100%;
    list-style: none;
    display: flex;

    li {
      margin-right: 2vw;
      display: flex;

      &::before {
        content: "";
        height: 3vh;
        margin-right: 2vw;
        margin: auto 2vw auto 0;
        border-left: 1px solid $neutrals700;
      }

      &:first-child::before {
        display: none;
      }

      &.right {
        margin-left: auto;
        margin-right: 0;

        &::before {
          display: none;
        }
      }

      a {
        cursor: pointer;
        padding: inherit;
        margin: auto;

        &:hover {
          color: $primary;
        }

        &:active,
        &.router-link-exact-active {
          color: $primary700;
        }

        &.disabled:hover {
          cursor: not-allowed;
          color: inherit;
        }
      }
    }
  }
}
</style>
