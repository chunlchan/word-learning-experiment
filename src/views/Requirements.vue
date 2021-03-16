<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <h2>Requirements</h2>
        <p>Please use headphones and a computer with an attached physical keyboard.</p>
        <p>Please do not use the browser back button.</p>
        <h2>Audio Test</h2>
        <p>Play the sounds below and type what you hear.</p>
        <p>If you cannot hear the audio, please adjust the volume until you can comfortably hear the recordings.</p>
        <v-row justify="center" align="baseline" no-gutters>
          <v-btn @click="play1()" :disabled="isPlaying || soundsLoaded < 2">
            Play
            <v-icon>play_circle_filled</v-icon>
          </v-btn>
          <v-text-field
            v-model="transcription1"
            :rules="textRules"
            label="Type what you hear"
            class="ml-10"
            :disabled="!sound1Played"
          ></v-text-field>
        </v-row>
        <v-row justify="center" align="center" no-gutters>
          <v-btn @click="play2()" :disabled="isPlaying || soundsLoaded < 2">
            Play
            <v-icon>play_circle_filled</v-icon>
          </v-btn>
          <v-text-field
            v-model="transcription2"
            :rules="textRules"
            label="Type what you hear"
            class="ml-10"
            :disabled="!sound2Played"
          ></v-text-field>
        </v-row>
        <v-row justify="center" align="center" no-gutters>
          <v-btn @click="checkAnswer()" :disabled="transcription1=='' || transcription2==''">Next</v-btn>
        </v-row>
        <v-row justify="center" align="center" no-gutters>
          <p style="color:red" v-if="valid===false">Some answers incorrect!</p>
        </v-row>
        <v-row justify="center" align="center" no-gutters>
          <p class="caption">version 2.2</p>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import createjs from "createjs-cmd";
import router from "../router/index.js";
import store from "../store/index.js";
export default {
  data: () => {
    return {
      textRules: [(v) => !!v || "This field is required required"],
      transcription1: "",
      transcription2: "",
      sound1Played: false,
      sound2Played: false,
      isPlaying: false,
      soundsLoaded: 0,
      valid: null,
    };
  },
  beforeRouteLeave(to, from, next) {
    console.log(from);
    if (to.name == "Consent") {
      next();
    } else {
      next(false);
    }
  },
  created: function () {
    //warning before closing browser
    window.onbeforeunload = function () {
      return "Are you sure you want to leave?";
    };

    //get participant ID
    store.state.PROLIFIC_PID = router.app.$route.query.PROLIFIC_PID;

    //get list group
    if(router.app.$route.query.listGroup){
      store.state.listGroup = router.app.$route.query.listGroup;
    }

    createjs.Sound.on("fileload", () => {
      this.soundsLoaded += 1;
      console.log(this.soundsLoaded);
    });
    createjs.Sound.registerSound("sounds/yellow.wav", "audioTest1");
    createjs.Sound.registerSound("sounds/blanket.wav", "audioTest2");
  },
  methods: {
    play1: function () {
      this.isPlaying = true;
      var instance = createjs.Sound.play("audioTest1");
      instance.on("complete", () => {
        this.isPlaying = false;
        this.sound1Played = true;
      });
    },
    play2: function () {
      this.isPlaying = true;
      var instance = createjs.Sound.play("audioTest2");
      instance.on("complete", () => {
        this.isPlaying = false;
        this.sound2Played = true;
      });
    },
    checkAnswer: function () {
      console.log(this.transcription1.toLowerCase());
      console.log(this.transcription2.toLowerCase());
      if (
        this.transcription1.toLowerCase() == "yellow" &&
        this.transcription2.toLowerCase() == "blanket"
      ) {
        this.valid = true;
        router.push("/consent");
      } else {
        this.valid = false;
      }
    },
  },
};
</script>