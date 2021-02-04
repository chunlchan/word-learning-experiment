<template>
  <v-container fluid fill-height>
    <v-row justify="center" v-if="firstTime" align="start">
      Now, you will see two pictures on the screen and hear one word.
      <br />You will first see the pictures, then see a red square.
      <br />When you see the red square and are ready to hear the word, press the space bar.
      <br />Please press "z" if the word corresponds with the image on the left,
      or press "m" if the word corresponds with the image on the right.
      <br />
      <br />
      <br />Press the space bar to proceed.
    </v-row>
    <v-row justify="center" v-if="currentItem && showFixation && !firstTime" align="start">
      <h1>+</h1>
    </v-row>
    <v-row justify="center" v-if="showRedBox" align="start">
      <v-icon style="color:red;font-size:4em">stop</v-icon>
    </v-row>
    <v-row justify="center" v-if="currentItem && showImages" align="start">
      <ImagePreloaded :queue="queue" :src="currentItem.left_img" class="mr-10" />
      <ImagePreloaded :queue="queue" :src="currentItem.right_img" />
    </v-row>
    <!--
    <v-row justify="center" v-if="list[index]">
      {{list[index].training_object}}
      {{list[index].new_object}}
      {{list[index].heard_label}}
    </v-row>
    -->
    <!--
    <v-row justify="center" align="start">
      <v-btn @click="nextItem()">next</v-btn>
    </v-row>
    -->
  </v-container>
</template>

<script>
import store from "../store/index.js";
import ImagePreloaded from "@/components/imagePreloaded.vue";
import { ref, computed } from "@vue/composition-api";
import usePlaySound from "@/composables/usePlaySound.js";
import useKeyPress from "@/composables/useKeyPress.js";
import router from "../router/index.js";
import { db } from "../firebase";

export default {
  name: "Test",
  components: {
    ImagePreloaded,
  },
  beforeRouteLeave(to, from, next) {
    console.log(from);
    if (to.name == "Training" || to.name == "End") {
      next();
    } else {
      next(false);
    }
  },
  setup() {
    const {
      currentItem,
      queue,
      isPlaying,
      nextItem,
      showFixation,
      showImages,
      showRedBox,
      waitForKey,
    } = useItem();

    const firstTime = ref(true);
    waitForKey(" ").then(() => {
      firstTime.value = false;
      nextItem();
    });

    return {
      currentItem,
      queue,
      isPlaying,
      nextItem,
      showFixation,
      showImages,
      showRedBox,
      firstTime,
    };
  },
};

function useItem() {
  const list = ref(store.state.list);
  const index = ref(store.state.index);
  const queue = ref(store.state.queue);
  const currentItem = computed(() => list.value[index.value]);
  const showFixation = ref(true);
  const showImages = ref(false);
  const showRedBox = ref(false);
  const { isPlaying, playSound } = usePlaySound();
  const { waitForKey, cancelWaitForKey } = useKeyPress();

  function nextItem() {
    index.value += 1;
    if (index.value >= list.value.length) {
      router.push("/end");
      return;
    } else if (currentItem.value.stage == "training") {
      store.state.index = index.value - 1;
      router.push("/training");
      return;
    }
    showFixation.value = false;
    showImages.value = false;
    showRedBox.value = false;

    //blank screen for 1s
    later(1000)
      .then(() => {
        showFixation.value = true;
        showImages.value = false;
        showRedBox.value = false;
        return later(500);
      })
      .then(() => {
        //fixation cross for 0.5s
        showFixation.value = false;
        showImages.value = true;
        showRedBox.value = false;
        return later(1000);
      })
      .then(() => {
        //redbox for 1s
        showFixation.value = false;
        showImages.value = false;
        showRedBox.value = true;

        //wait indefinitely for spacebar
        return waitForKey([" "]);
      })
      .then(() => {
        //play sound and show pictures when spacebar is pressed
        showFixation.value = false;
        showImages.value = true;
        showRedBox.value = false;
        playSound(currentItem.value.heard_label);

        //data to push to firebase
        var dataToPush = JSON.parse(JSON.stringify(currentItem)).value;

        //start 100ms interval timer
        var timeElapsed = 0;
        var responseGiven = 0;
        var interval = setInterval(() => {
          timeElapsed += 100;
          if (timeElapsed > 1000 && responseGiven == 1) {
            responseGiven = 0;
            clearInterval(interval);
            // z/m key pressed too soon. wait 1 second before moving to next item
            nextItem();
          }
          if (timeElapsed > 3000) {
            //took too long to press a key, save as null response and move to next item
            cancelWaitForKey();
            clearInterval(interval);
            dataToPush.keyPressed = 0;
            dataToPush.timeElapsed = 3000;
            db.ref()
              .child("/responses/" + store.state.PROLIFIC_PID + "/")
              .push(dataToPush);
            nextItem();
          }
        }, 100);

        //wait for z or m key press
        waitForKey(["z", "m"]).then((keyPressed) => {
          if (timeElapsed > 1000) {
            clearInterval(interval);
            dataToPush.keyPressed = keyPressed;
            dataToPush.timeElapsed = timeElapsed;
            db.ref()
              .child("/responses/" + store.state.PROLIFIC_PID + "/")
              .push(dataToPush);
            nextItem();
          } else {
            responseGiven = 1;
            dataToPush.keyPressed = keyPressed;
            dataToPush.timeElapsed = timeElapsed;
            db.ref()
              .child("/responses/" + store.state.PROLIFIC_PID + "/")
              .push(dataToPush);
          }
        });
      });

    function later(delay) {
      return new Promise(function (resolve) {
        setTimeout(resolve, delay);
      });
    }
  }

  return {
    currentItem,
    queue,
    isPlaying,
    nextItem,
    showFixation,
    showImages,
    showRedBox,
    waitForKey,
  };
}
</script>
