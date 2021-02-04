<template>
  <v-container fluid>
    <v-col cols="12">
      <h2>Online Consent to Participate in Research</h2>
      <br />
      <p>
        <strong>Title of Research Study:</strong> Phonetic Sensitivity in Word Learning
      </p>
      <p>
        <strong>IRB Study Number:</strong> STU00210741
      </p>
      <p>
        <strong>Principal Investigator:</strong> Matt Goldrick
      </p>
      <p>
        <strong>Supported By:</strong> This research is supported by the Northwestern University Department of Linguistics.
      </p>
      <p>
        <strong>Key Information about this research study:</strong>
        <br />The following is a short summary of this study to help you decide whether to be a part of this study. The purpose of this study is to investigate how people learn words in a new language. You will be asked to learn some words for objects and remember them later. We expect that you will be in this research study for no more than 30 minutes. The primary risk of participation is participation is no greater than the risks that you would encounter in daily life. The main benefit is helping scientists better understand language learning.
      </p>
      <p>
        <strong>Why am I being asked to take part in this research study?</strong>
        <br />I am asking you to take part in this research study because you are an English-speaking adult with no history of speech, language, or hearing impairment.
      </p>
      <p>
        <strong>How many people will be in this study?</strong>
        <br />We expect about 256 people will be in this research study.
      </p>
      <p>
        <strong>What should I know about a research study?</strong>
      </p>
      <ul>
        <li>Whether or not you take part is up to you.</li>
        <li>You can choose not to take part.</li>
        <li>You can agree to take part and later change your mind.</li>
        <li>Your decision will not be held against you.</li>
      </ul>
      <br />
      <p>
        <strong>If you say that "Yes, you want to be in this research," here is what you will do</strong>
        <br />You will first be asked to put on headphones. You will then hear a few words to test your volume levels. Following this, you will be asked to listen to some words and remember them later. You will then be tested on the words.
      </p>

      <p>
        <strong>What happens if I do not want to be in this research or if I say “Yes”, but I change my mind later?</strong>
        <br />Participation in research is voluntary. You can decide to participate or not to participate.
        You can decide not to participate in this research or you can start and then decide to leave the research at any time and it will not be held against you. To do so, simply exit the survey. Any data already collected will not be saved.
      </p>

      <p>
        <strong>What happens to the information collected for the research?</strong>
        <br />Efforts will be made to limit the use and disclosure of your personal information, including research study records to people who have a need to review this information. We cannot promise complete secrecy. Organizations that may inspect and copy your information include the IRB and other representatives of this institution.
        This survey is being hosted by Northwestern University and involves a secure connection.
        Upon receiving results of your survey, any possible identifiers will be deleted. You will be identified only by a unique subject number. All information will be kept on a password protected computer only accessible by the research team. The results of the research study may be published, but your name will not be used.
      </p>

      <p>
        <strong>Data Sharing</strong>
        <br />De-identified data from this study may be shared with the research community at large to advance science and health. We will remove or code any personal information that could identify you before files are shared with other researchers to ensure that, by current scientific standards and known methods, no one will be able to identify you from the information we share. Despite these measures, we cannot guarantee anonymity of your personal data.
      </p>

      <p>
        <strong>What else do I need to know?</strong>
        <br />If you agree to take part in this research study, we will provide you with $6 as compensation for doing the experiment, granted through Prolific.
      </p>

      <p>
        <strong>Who can I talk to?</strong>
        <br />If you have questions, concerns, or complaints talk to the Principal Investigator Matt Goldrick (matt-goldrick@northwestern.edu) and Lisa Cox (lmcox@u.northwestern.edu).
        This research has been reviewed and approved by an Institutional Review Board ("IRB"). You may talk to them at +1 (312) 503-9338 or irb@northwestern.edu if:
      </p>
      <ul>
        <li>Your questions, concerns, or complaints are not being answered by the research team.</li>
        <li>You cannot reach the research team.</li>
        <li>You want to talk to someone besides the research team.</li>
        <li>You have questions about your rights as a research participant.</li>
        <li>You want to get information or provide input about this research.</li>
      </ul>
      <br />
      <p>
        <strong>Consent</strong>
        <br />If you want a copy of this consent for your records, you can print it from the screen.
        If you wish to participate, please click the “I Agree” button and you will be taken to the study.
        If you do not wish to participate in this study, please select “I Disagree” or select X in the corner of your browser.
      </p>
      <v-row no-gutters>
        <v-btn color="success" class="mr-10" @click="agree()">
          I agree
          <v-icon>check</v-icon>
        </v-btn>
        <v-btn color="error" @click="disagree()">
          I disagree
          <v-icon>close</v-icon>
        </v-btn>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import router from "../router/index.js";
import store from "../store/index.js";
import { db } from "../firebase";

export default {
  methods: {
    agree: function () {
      db.ref()
        .child("/consent/" + store.state.PROLIFIC_PID)
        .set({ timestamp: new Date().getTime() });
      router.push("/survey");
    },
    beforeRouteLeave(to, from, next) {
      console.log(from);
      if (to.name == "Survey") {
        next();
      } else {
        next(false);
      }
    },
    disagree: function () {
      alert(
        "You have declined consent. Please close the browser and return this study."
      );
    },
  },
};
</script>