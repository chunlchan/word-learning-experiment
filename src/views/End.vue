<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <h2>Experiment Complete. Thank you for participating.</h2>
    </v-row>
    <v-row justify="center" align="center">
      <v-btn @click="submitExperiment()">Submit & End Session</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store/index.js";
export default {
  mounted: function(){
    window.onbeforeunload = null;
  },
  beforeRouteLeave(to, from, next) {
    console.log(to, from);
    next(false);
  },  
  methods: {
    submitExperiment: function(){
      let completion_url = store.state.completionUrl;
      window.location = completion_url;
    }
  }
}
</script>
