<template>
  <section class="about">
    <h1>This <span>Vue.js</span> Contact List Project was created by <span>Kirill Tregubov</span></h1>
    <h2>This project was created for <span>Mr. DesLauriers</span> as part of my <span>ICS4U</span> cousework.</h2>
  </section>
</template>

<style lang="scss" scoped>
  section {
    margin-top: 100px;
    display: flex;           /* establish flex container */
    flex-direction: column;  /* make main axis vertical */
    justify-content: center; /* center items vertically, in this case */
    align-items: center;     /* center items horizontally, in this case */
  }
  h1 {
    padding: 25px;
  }
  span {
    color: $primary;
  }
</style>
