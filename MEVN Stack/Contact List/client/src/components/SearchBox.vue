<template>
  <div id="searchBox">
    <!-- <form id class method="post">
      <input
        type="text"
        v-model="searchQuery"
        class="main-input"
        placeholder="John Doe"
      />
      <button type="button" class="main-btn" @click="popup">
        <p class="search-small">SEARCH BY</p>
        <p class="search-large">Name</p>
      </button>
      <ul class="search-description">
        <li>By Location</li>
        <li>By Name</li>
      </ul>
      <input id="main-submit" type="submit" value="Search">
    </form>-->
    <input type="text" v-model="searchQuery" @input="send" placeholder="Search title.."/>
    <!-- <svg class="submit-button">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#search"></use>
    </svg> -->
    <!-- <label>Search title:</label> -->
    <!-- <p>Message: {{ searchQuery }}</p> -->
  </div>
</template>

<script>
import JQuery from 'jquery'
let $ = JQuery

/* $(".main-btn").click(function() {
  $(".search-description").slideToggle(100);
});
$(".search-description li").click(function() {
  var target = $(this).html();
  var toRemove = "By ";
  var newTarget = target.replace(toRemove, "");
  // remove spaces
  newTarget = newTarget.replace(/\s/g, "");
  $(".search-large").html(newTarget);
  $(".search-description").hide();
  $(".main-input").hide();
  newTarget = newTarget.toLowerCase();
  $(".main-" + newTarget).show();
});
$(window).resize(function() {
  replaceMatches();
});

function replaceMatches() {
  var width = $(window).width();
  if (width < 516) {
    $(".main-location").attr("value", "City or postal code");
  } else {
    $(".main-location").attr("value", "Search by city or postal code");
  }
}
replaceMatches(); */

export default {
  data () {
    return {
      searchQuery: ''
    }
  },
  methods: {
    popup: function () {
      $('.search-description').slideToggle(100)
      this.searchQuery = ''
    },
    send: function () {
      this.$emit('search', this.searchQuery)
    }
  }
}
</script>

<style lang="scss" scoped>
/* Pull in your reset css and fonts http://seodesigns.com/projects/TD/css/reset.css */
#searchBox {
    margin: auto;
    position: relative;
    label {
      position: absolute;
      font-size: 12px;
      color: rgba(0,0,0,.50);
      top: 8px;
      left: 12px;
      z-index: -1;
      transition: .15s all ease-in-out;
    }
    input {
      padding: 4px 12px;
      color: rgba(0,0,0,.70);
      border: 1px solid rgba(0,0,0,.12);
      transition: .15s all ease-in-out;
      background: white;
      &:focus {
        outline: none;
        transform: scale(1.05);
        & + label  {
          font-size: 10px;
          transform: translateY(-24px) translateX(-12px);
        }
      }
      &::-webkit-input-placeholder {
          font-size: 12px;
          color: rgba(0,0,0,.50);
          font-weight: 100;
      }
    }
}
</style>
