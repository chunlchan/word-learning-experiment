<template>
  <v-container fluid fill-height>
    <v-row justify="center" v-if="firstTime && index ==-1" align="start" class="ma-10">
      <p>
        Let's practice! During this phase, you will see a picture and hear the name of that picture.
        Please pay attention to the word used for the picture.
        <br />
        <br />When you are ready to move on to the next picture and name, press the space bar.
      </p>
    </v-row>
    <v-row justify="center" v-if="firstTime && index ==3" align="start" class="ma-10">
      Practice is complete.
      <br />
      <br />Now, you will start the experiment. The words and pictures in this experiment will be new to you. Please listen to the words and pay attention to the pictures.
      <br />
      <br />Press the space bar to proceed.
    </v-row>
    <v-row
      justify="center"
      v-if="firstTime && index >3"
      align="start"
      class="ma-10"
    >You may now take short break. Press the space bar to proceed to the next round.</v-row>
    <v-row justify="center" v-if="currentItem && showFixation && !firstTime" align="start">
      <h1>+</h1>
    </v-row>
    <v-row justify="center" v-if="currentItem && showImages" align="start">
      <ImagePreloaded :queue="queue" :src="currentItem.training_object" class="mr-10" />
    </v-row>
  </v-container>
</template>

<script>
import store from "../store/index.js";
import ImagePreloaded from "@/components/imagePreloaded.vue";
import { ref, computed } from "@vue/composition-api";
import router from "../router/index.js";
import usePlaySound from "@/composables/usePlaySound.js";
import useKeyPress from "@/composables/useKeyPress.js";

export default {
  name: "Training",
  components: {
    ImagePreloaded,
  },
  beforeRouteLeave(to, from, next) {
    console.log(from);
    if (to.name == "Test") {
      next();
    } else {
      next(false);
    }
  },  
  setup() {
    const {
      currentItem,
      queue,
      nextItem,
      showFixation,
      showImages,
      waitForKey,
      isPlaying,
      index,
    } = useItem();

    const firstTime = ref(true);
    waitForKey(" ").then(() => {
      firstTime.value = false;
      nextItem();
    });

    return {
      currentItem,
      queue,
      nextItem,
      showFixation,
      showImages,
      firstTime,
      index,
      isPlaying,
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
  const { isPlaying, playSound } = usePlaySound();
  const routerOpen = ref(false);

  const { waitForKey } = useKeyPress();

  function nextItem() {
    index.value += 1;
    if (currentItem && currentItem.value.stage == "test") {
      store.state.index = index.value - 1;
      router.push("/test");
      return;
    }
    showFixation.value = true;
    showImages.value = false;

    //fixation cross fo 0.5s
    later(500)
      .then(() => {
        //show images
        showFixation.value = false;
        showImages.value = true;
        console.log("playing sound");
        return playSound(currentItem.value.heard_label).then(() => {
          //wait indefinitely for spacebar
          return waitForKey([" "]);
        });
      })
      .then(() => {
        nextItem();
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
    nextItem,
    showFixation,
    showImages,
    waitForKey,
    isPlaying,
    index,
    routerOpen
  };
}
</script>
