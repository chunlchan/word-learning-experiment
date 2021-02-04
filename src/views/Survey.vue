<template>
  <v-container>
    <v-form v-model="valid">
      <h4 class="field-label">What is your age?</h4>
      <v-text-field v-model="age" :rules="ageRules" required></v-text-field>

      <h4 class="field-label">Gender:</h4>
      <v-radio-group v-model="gender" class="radio-container">
        <v-radio label="Non-binary" value="Non-binary"></v-radio>
        <v-radio label="Female" value="Female"></v-radio>
        <v-radio label="Male" value="Male"></v-radio>
        <v-radio label="Prefer not to say" value="Prefer not to say"></v-radio>
        <v-radio label="Other (please specify below)" value="Other"></v-radio>
        <v-text-field
          v-if="gender=='Other'"
          :rules="textRules"
          label="Fill in the blank"
          v-model="genderOther"
        />
      </v-radio-group>

      <h4
        class="field-label"
      >At what age did you first learn English? Enter 0 if this is your first language.</h4>
      <v-text-field v-model="englishAquiredAge" :rules="ageRules" required></v-text-field>

      <h4 class="field-label">Do you know any other languages besides English?</h4>
      <v-radio-group v-model="otherLanguages" class="radio-container">
        <v-radio label="Yes" value="Yes"></v-radio>
        <v-radio label="No" value="No"></v-radio>
        <v-radio label="Decline to answer" value="Decline to answer"></v-radio>
      </v-radio-group>

      <div v-if="otherLanguages=='Yes'">
        <h4 class="field-label">Please tell us about the language you know best other than English.</h4>
        <h4 class="field-label">What is the name of this language?</h4>
        <v-text-field v-model="otherLanguageName" :rules="textRules" required></v-text-field>
        <h4
          class="field-label"
        >At what age did you first learn this language? Enter 0 if this is your first language.</h4>
        <v-text-field v-model="otherLanguageAgeAquired" :rules="ageRules" required></v-text-field>
      </div>
      <h4
        class="field-label"
      >Do you have a history of hearing loss in either ear that you are aware of?</h4>
      <v-radio-group v-model="hearingLoss" class="radio-container">
        <v-radio label="Decline to answer" value="Decline to answer"></v-radio>
        <v-radio label="Yes, in both ears" value="Both Ears"></v-radio>
        <v-radio label="Yes, in my left ear" value="Left Ear"></v-radio>
        <v-radio label="Yes, in my right ear" value="Right Ear"></v-radio>
        <v-radio label="No" value="No"></v-radio>
      </v-radio-group>

      <h4
        class="field-label"
      >Do you have a history of any speech or language impairments that you are aware of?</h4>
      <v-radio-group v-model="speechImpairments" class="radio-container">
        <v-radio label="Decline to answer" value="Decline to answer"></v-radio>
        <v-radio label="Yes" value="Yes"></v-radio>
        <v-radio label="Yes, corrected" value="Corrected"></v-radio>
        <v-radio label="No" value="No"></v-radio>
      </v-radio-group>

      <h4 class="field-label">Do you currently have any vision impairments that you are aware of?</h4>
      <v-radio-group v-model="visionLoss" class="radio-container">
        <v-radio label="Decline to answer" value="Decline to answer"></v-radio>
        <v-radio label="Yes" value="Yes"></v-radio>
        <v-radio label="Yes, corrected" value="Corrected"></v-radio>
        <v-radio label="No" value="No"></v-radio>
      </v-radio-group>

      <h4
        class="field-label"
      >Please list any history of cognitive or neurological conditions that you are aware of.</h4>
      <v-text-field v-model="cognitiveConditions" :rules="textRules" required></v-text-field>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="submit">Submit</v-btn>

      <!--
      {{age}}
      {{gender}}
      {{genderOther}}
      {{englishAquiredAge}}
      {{otherLanguages}}
      {{otherLanguageName}}
      {{otherLanguageAgeAquired}}
      {{hearingLoss}}
      {{speechImpairments}}
      {{visionLoss}}
      {{cognitiveConditions}}
      -->
    </v-form>
  </v-container>
</template>


<script>
import router from "../router/index.js";
import store from "../store/index.js";
import { db } from "../firebase";

export default {
  data: () => ({
    valid: true,
    textRules: [(v) => !!v || "This field is required required"],
    ageRules: [
      (v) => !!v || "Age is required",
      (v) => (v >= 0 && v <= 200) || "Please enter valid age",
    ],
    age: null,
    gender: null,
    genderOther: null,
    englishAquiredAge: null,
    otherLanguages: null,
    otherLanguageName: null,
    otherLanguageAgeAquired: null,
    hearingLoss: null,
    speechImpairments: null,
    visionLoss: null,
    cognitiveConditions: null,
  }),

  methods: {
    submit() {
      db.ref()
        .child("/survey/" + store.state.PROLIFIC_PID)
        .set({
          age: this.age,
          gender: this.gender,
          genderOther: this.genderOther,
          englishAquiredAge: this.englishAquiredAge,
          otherLanguages: this.otherLanguages,
          otherLanguageName: this.otherLanguageName,
          otherLanguageAgeAquired: this.otherLanguageAgeAquired,
          hearingLoss: this.hearingLoss,
          speechImpairments: this.speechImpairments,
          visionLoss: this.visionLoss,
          cognitiveConditions: this.cognitiveConditions,
          timestamp: new Date().getTime(),
        });

      router.push("/preloader");
    },
  },

  beforeRouteLeave(to, from, next) {
    console.log(from);
    if (to.name == "Preloader") {
      next();
    } else {
      next(false);
    }
  },
};
</script>

<style scoped>
.field-label {
  margin-bottom: 0;
  margin-top: 24px;
}
.radio-container {
  margin-top: 0;
}
</style>