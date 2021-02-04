import {ref} from "@vue/composition-api";
import createjs from "createjs-cmd";
export default function usePlaySound() {
    const isPlaying = ref(false);
    
    const playSound = (soundId) => {
        isPlaying.value = true;
        let playSoundPromise = new Promise((resolve, reject) => {
            var sound = createjs.Sound.play(soundId);
            sound.on("complete", () => {
                isPlaying.value = false;
                resolve();
            });    
            sound.on("failed", () => {
                reject(new Error("Sound playback failed"));
            })
        });
        return playSoundPromise;
        
    }


    return { isPlaying, playSound };
}