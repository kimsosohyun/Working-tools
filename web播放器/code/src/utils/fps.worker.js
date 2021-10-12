/* xx.worker.js */
const maxTime = 5000;
let fpsTickId;
let loopEndTime;
let loopBeginTime;
let count = 0;
let isStop = false;

onmessage = function(e) {
  const data = e.data;

  switch (data) {
    case "loop":
      loopBeginTime = new Date().getTime();
      isStop = false;
      count = 0;
      fpsTick();
      break;
    case "stop":
      stopTick();
      break;
  }
};

function fpsTick() {
  fpsTickId = requestAnimationFrame(() => {
    loopEndTime = new Date().getTime();
    count++;
    cancelAnimationFrame(fpsTickId);
    if (loopEndTime - loopBeginTime >= maxTime && !isStop) {
      postMessage(parseInt((1000 * count) / (loopEndTime - loopBeginTime)));
      return;
    }
    fpsTick();
  });
}
function stopTick() {
  isStop = true;
  cancelAnimationFrame(fpsTickId);
}

/* xx.vue */
// loopGetFPS() {
//     if (this.worker === null) {
//         this.worker = new Worker();
//         this.count = 0;
//         this.loopBeginTime = new Date().getTime();
//         this.worker.onmessage = () => {
//             this.loopGetFPS();
//         };
//     }
//     requestAnimationFrame(() => {
//         this.count++;
//         this.loopEndTime = new Date().getTime();
//         if (this.loopEndTime - this.loopBeginTime >= 5000) {
//             console.log(
//                 parseInt(
//                     (1000 * this.count) / (this.loopEndTime - this.loopBeginTime)
//                 )
//             );
//             this.count = 0;
//             this.loopBeginTime = this.loopEndTime;
//         }

//         if (this.worker !== null) {
//             this.worker.postMessage(0);
//         }
//     });
// },
// cancelLoop() {
//     if (this.worker === null) return;

//     this.worker.terminate();
//     this.worker = null;
// }
