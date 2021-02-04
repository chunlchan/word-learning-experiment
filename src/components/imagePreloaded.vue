<!-- displays an image from createjs preload queue -->
<template>
  <div>
    <v-img :src="imgSrc" v-if="imgSrc!=null" contain="" max-width="300px"/>
  </div>
</template>

<script>
import {computed} from "@vue/composition-api";
export default {
  name: "ImagePreloaded",
  props: {
    src: String,
    queue: Object
  },
  setup(props){
    const imgSrc = computed(() => {
      if (props.queue != null && props.queue.getResult && props.src != null) {
          return URL.createObjectURL(props.queue.getResult(props.src, true));
        } else {
          return null;
        }
    })
    return{imgSrc};
  }
};
</script>
