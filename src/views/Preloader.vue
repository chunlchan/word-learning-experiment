<template>
  <v-container fluid fill-height>
    <v-col cols="12">
      <v-row align="center" justify="center" v-if="progress!=100">
        <p>Loading... Please wait</p>
      </v-row>
      <v-row align="center" justify="center">
        <v-progress-circular :value="progress" size="50" color="primary" rotate="-90">{{progress}}%</v-progress-circular>
      </v-row>
      <v-row align="center" justify="center" class="mt-5" v-if="progress==100">
        <v-btn @click="nextClicked()">
          Next
          <v-icon>navigate_next</v-icon>
        </v-btn>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import { ref } from "@vue/composition-api";
import createjs from "createjs-cmd";
import store from "../store/index.js";
import router from "../router/index.js";
import { db } from "../firebase";

export default {
  beforeRouteLeave(to, from, next) {
    console.log(from);
    if (to.name == "GeneralInstructions") {
      next();
    } else {
      next(false);
    }
  },
  setup() {
    const progress = ref(0); //progress indicator

    loadList()
      .then((list) => {
        console.log(list);
        store.state.list = list; //store list array here
        return preloadImages(list, progress);
      })
      .then((queue) => {
        store.state.queue = queue; //pass to state
      });

    const nextClicked = function () {
      router.push("/generalInstructions");
    };

    return { progress, nextClicked };
  },
};

async function loadList() {
  let practiceFetch = await fetch("lists/0_practice_block.json");
  let list = await practiceFetch.json();

  let masterFetch = await db.ref().child("/master/").once("value");
  let masterJson = masterFetch.val();
  //let masterFetch = await fetch("master.json");
  //let masterJson = await masterFetch.json();
  let blocks = shuffle(masterJson.blocks);

  for (var b = 0; b < blocks.length; b++) {
    let trainingFetch = await fetch("lists/" + blocks[b].training);
    let training = await trainingFetch.json();
    training = shuffle(training);
    for (var t = 0; t < training.length; t++) {
      training[t].stage = "training";
      list.push(training[t]);
    }

    let testFetch = await fetch("lists/" + blocks[b].test);
    let test = await testFetch.json();
    test = shuffle(test);
    for (t = 0; t < test.length; t++) {
      var coinFlip = Math.floor(Math.random() * 2) == 0;
      if (coinFlip) {
        test[t].left_img = test[t].training_object;
        test[t].right_img = test[t].new_object;
      } else {
        test[t].left_img = test[t].new_object;
        test[t].right_img = test[t].training_object;
      }
      test[t].stage = "test";
      list.push(test[t]);
    }
  }
  return list;
}

/*
async function loadFlow() {
  let jsonFetch = await fetch("list1.json");
  let list = await jsonFetch.json();
  return list;
}
*/

async function preloadImages(list, progress) {
  let manifest = [];

  //search json data recursively for all images and sounds
  traverse(list, function (key, value) {
    if (key == "training_object" || key == "new_object") {
      manifest.push({ id: value, src: "images/" + value });
    } else if (key == "heard_at_test" || key == "heard_at_training") {
      manifest.push({ id: value, src: "sounds/" + value });
    }
  });

  manifest = trim(manifest, "id");

  var queue = new createjs.LoadQueue();
  queue.installPlugin(createjs.Sound);
  queue.loadManifest(manifest);
  const queuePromise = new Promise((resolve, reject) => {
    queue.on("complete", () => {
      resolve(queue);
    });
    queue.on("error", () => {
      reject("failed to preload items");
    });
    queue.on("progress", (event) => {
      progress.value = Math.round(event.loaded * 100);
    });
  });

  return queuePromise;
}

//travese json and extract all key+value pairs
function traverse(o, fn) {
  for (var i in o) {
    fn.apply(this, [i, o[i]]);
    if (o[i] !== null && typeof o[i] == "object") {
      traverse(o[i], fn);
    }
  }
}

//remove duplicate items from array
function trim(arr, key) {
  var values = {};
  return arr.filter(function (item) {
    var val = item[key];
    var exists = values[val];
    values[val] = true;
    return !exists;
  });
}

function shuffle(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
</script>

