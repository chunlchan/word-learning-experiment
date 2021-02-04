<template>
  <v-container fluid fill-height>
    <v-row justify="center" align="center" class="ma-10">
      <v-col cols="12">
        <h2>Introduction</h2>
        <p>Thank you for participating in our research. In this study, you will learn some new words. You'll first hear some words and see some pictures, and then you'll be asked to match the word with the picture.</p>
        <v-btn @click="nextClicked()">
          next
          <v-icon>navigate_next</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from "../router/index.js";
export default {
  methods: {
    nextClicked: () => {
      router.push("/training");
    },
  },
  beforeRouteLeave(to, from, next) {
    console.log(from);
    if (to.name == "Training") {
      next();
    } else {
      next(false);
    }
  },
  mounted: function () {
    window.addEventListener("beforeunload", (event) => {
      event.returnValue = "Are you sure you want to leave?";
    });
  },
};
</script>