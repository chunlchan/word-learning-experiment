export default function useKeyPress() {
    let onKeyPress;

    function waitForKey(keys) {
      console.log("waiting for " + keys);
      let promise = new Promise((resolve) => {
        onKeyPress = function (e) {
          let keyPressed = String.fromCharCode(e.keyCode).toLowerCase();
          if (keys.indexOf(keyPressed) !== -1) {
            window.removeEventListener("keypress", onKeyPress);
            resolve(keyPressed);
          }
        };
        window.addEventListener("keypress", onKeyPress);
      });
      return promise;
    }
  
    function cancelWaitForKey() {
      window.removeEventListener("keypress", onKeyPress);
    }
  
    return { waitForKey, cancelWaitForKey };
}