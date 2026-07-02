// src/services/mediaCompositor.js
// Merges a camera stream and a screen-share stream into a single MediaStream
// using a Canvas element. This ensures that MediaRecorder captures both
// feeds in a single video file.

export class MediaCompositor {
  constructor(width = 1280, height = 720) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');

    this.cameraVideo = document.createElement('video');
    this.cameraVideo.autoplay = true;
    this.cameraVideo.muted = true;
    this.cameraVideo.playsInline = true;

    this.screenVideo = document.createElement('video');
    this.screenVideo.autoplay = true;
    this.screenVideo.muted = true;
    this.screenVideo.playsInline = true;

    this.animationFrameId = null;
    this.outputStream = null;
  }

  start(cameraStream, screenStream) {
    if (cameraStream) this.cameraVideo.srcObject = cameraStream;
    if (screenStream) this.screenVideo.srcObject = screenStream;

    const stream = this.canvas.captureStream(30);

    if (cameraStream) {
      const audioTrack = cameraStream.getAudioTracks()[0];
      if (audioTrack) {
        stream.addTrack(audioTrack);
      }
    }

    this.outputStream = stream;
    this.render();
    return stream;
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.cameraVideo.srcObject = null;
    this.screenVideo.srcObject = null;
  }

  render = () => {
    const { ctx, canvas, cameraVideo, screenVideo } = this;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, w, h);

    const hasCamera = !!cameraVideo.srcObject && cameraVideo.readyState >= 2;
    const hasScreen = !!screenVideo.srcObject && screenVideo.readyState >= 2;

    if (hasScreen && hasCamera) {
      ctx.drawImage(screenVideo, 0, 0, w, h);

      const pipW = w / 4;
      const pipH = h / 4;
      const margin = 20;

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(w - pipW - margin, h - pipH - margin, pipW, pipH);
      ctx.drawImage(cameraVideo, w - pipW - margin, h - pipH - margin, pipW, pipH);
    } else if (hasScreen) {
      ctx.drawImage(screenVideo, 0, 0, w, h);
    } else if (hasCamera) {
      ctx.drawImage(cameraVideo, 0, 0, w, h);
    }

    this.animationFrameId = requestAnimationFrame(this.render);
  };
}
