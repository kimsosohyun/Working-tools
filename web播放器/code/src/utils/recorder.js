const defaultEncodeType = "video/webm;codecs=vp8",
  defaultFps = 10;

export default class Recorder {
  recorder = null;
  stream = null;
  chunks = [];
  constructor(canvas, fps = defaultFps, encodeType = defaultEncodeType) {
    this.canvas = canvas;
    this.fps = fps;
    this.encodeType = encodeType;

    this.initRecorder();
  }

  start() {
    this.recorder.start(10);
  }
  stop() {
    this.recorder.stop();
  }
  stopThenDownload(name) {
    this.stop();
    this.download(name);
  }

  initRecorder() {
    this.stream = this.canvas.captureStream(this.fps);
    this.recorder = new MediaRecorder(this.stream, {
      mimeType: this.encodeType
    });

    //收集录制数据
    this.recorder.ondataavailable = e => {
      this.chunks.push(e.data);
    };
  }

  //下载录制内容
  download(fileName = new Date().getTime()) {
    let blob = new Blob(this.chunks);
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.mp4`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
