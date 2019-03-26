<template>
  <section id="app">
    <Nav @search="search"/>
    <router-view :searchQuery="searchQuery"/>
  </section>
</template>

<script>
import Nav from '@/components/Nav.vue'

export default {
  name: 'App',
  data () {
    return {
      searchQuery: ''
    }
  },
  methods: {
    search: function (searchQuery) {
      this.searchQuery = searchQuery
    }
  },
  components: {
    Nav
  }
}
</script>

<style lang="scss">
/* Reset Styles
===========================*/
html,
body,
ul,
ol {
  overflow: hidden;
  margin: 0;
  padding: 0;
}

nav ul {
  list-style: none;
  a {
    color: inherit;
    text-decoration: none;
  }
}

/* Typography
===========================*/
body {
  background-color: $bg;
  color: $neutrals400;
  font-family: "Eina03", sans-serif;
  @include noInteraction;
}

h1 {
  color: $neutrals100;
  font-size: 2em;
  margin: 0 0 0.5em 0;

  .button {
    padding: 0.2em 0.5em 0.3em 0.5em;
    margin-bottom: 0.5em;
  }

  span.special {
    font-weight: 800;
    color: $primary400;
  }
}

h2 {
  color: $neutrals200;
  font-weight: 100;
  font-size: 1.15em;
  margin: 0 0 0.5em 0;

  &.warning {
    @include error;
    margin-bottom: 1em;
  }

  &.attention {
    color: $destructive500;
    font-size: 1.5em;
    font-weight: 600;
    -webkit-transition: opacity 500ms linear;
    transition: opacity 500ms linear;
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
  }
}

.inputBox h5,
.container h5 {
  display: none;
  margin: 1vh 0;
  font-weight: 100;
  @include error;
}

p {
  span.special {
    font-weight: 800;
    color: $primary400;
  }
}

/* Button
===========================*/
.button {
  @include noInteraction;
  display: inline-block;
  background-color: $primary;
  border-color: $primary;
  color: $neutrals100;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 8px 8px;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid $primary;

  &:hover {
    background-color: $primary500;
    border-color: $primary500;
    border-radius: 15px;
  }

  &:active {
    background-color: $primary700;
    border-color: $primary700;
    border-radius: 15px;
  }

  &.disabled {
    cursor: not-allowed;
    background-color: $neutrals900;
    border: 2px solid $neutrals400;
    color: $neutrals400;

    &:hover {
      border-radius: 10px;
    }
  }

  &.secondary {
    background-color: inherit;
    border: 2px solid $neutrals400;
    color: $neutrals400;

    &:hover {
      color: $primary;
      border-color: $primary;
    }

    &:active {
      background-color: $neutrals900;
    }
  }

  &.destructive {
    background-color: $destructive600;
    border-color: $destructive600;
    color: $neutrals100;

    &:hover {
      background-color: $destructive500;
      border-color: $destructive500;
    }

    &:active {
      background-color: $destructive700;
      border-color: $destructive700;
    }
  }
}
#searchBox input {
  color: $neutrals300 !important;
  background-color: $neutrals800 !important;
  border-radius: 10px;
  margin-right: 10px;
  &::placeholder {
    color: $neutrals500 !important;
  }
}
.single-select-wrapper {
  input {
    color: $neutrals300 !important;
    background-color: $neutrals900 !important;
    border: 1px solid $neutrals900 !important;

    &::placeholder {
      color: $neutrals500 !important;
    }
  }
  ul {
    background-color: $neutrals900 !important;
    color: $neutrals400 !important;
    -ms-overflow-style: none; // IE 10+
    overflow: -moz-scrollbars-none; // Firefox

    &::-webkit-scrollbar {
      display: none; // Safari and Chrome
    }

    .active {
      background-color: $neutrals800 !important;
    }
  }
}
</style>
