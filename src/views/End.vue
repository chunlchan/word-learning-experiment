<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <h2>Experiment Complete. Thank you for participating.</h2>
    </v-row>
    <v-row justify="center" align="center">
      <v-btn @click="submitExperiment()">Submit & Return to Prolific</v-btn>
    </v-row>
  </v-container>
</template>

<script>
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
      window.location = "https://app.prolific.co/submissions/complete?cc=8AF68756";
    }
  }
}
</script>
