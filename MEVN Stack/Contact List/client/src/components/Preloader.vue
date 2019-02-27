<template>
  <div></div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
div {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $bg;
  z-index: 1;

  &::after {
    content: "";
    width: 50px;
    height: 50px;
    margin: 10px;
    position: fixed;
    left: calc(50% - 25px);
    top: calc(50% - 25px);
    border-radius: 50%;
    border: 2px solid $primary;
    border-right-color: $bg;
    -webkit-animation: rotate-center 0.8s ease-in-out infinite both;
    animation: rotate-center 0.8s ease-in-out infinite both;
    z-index: 100000;
  }

  img {
    position: absolute;
  }
}
</style>
