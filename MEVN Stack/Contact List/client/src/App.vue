<template>
  <section id="app">
    <Nav/>
    <router-view/>
  </section>
</template>

<script>
import Nav from '@/components/Nav.vue'

export default {
  name: 'app',
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

.inputBox h5 {
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
</style>
