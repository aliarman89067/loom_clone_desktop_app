import React from "react";
import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

let videoTransferFileName: string | undefined;
let mediaRecorder: MediaRecorder | undefined;
let userId: string;

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

export const startRecording = (onSources: {
  screen: string;
  audio: string;
  id: string;
}) => {
  hidePluginWindow(true);
  videoTransferFileName = `${uuid()}-${onSources?.id.slice(0, 8)}.webm`;
  if (!mediaRecorder) {
    throw new Error("MediaRecorder was not initialized");
  }

  mediaRecorder.start(1000);
};

export const onStopRecording = () => {
  if (!mediaRecorder) {
    alert("Media recorder in undefined");
    throw new Error("MediaRecorder was not initialized");
  } else {
    alert("Media recorder in exist");
  }

  mediaRecorder.stop();
};

const stopRecording = () => {
  // alert("Recording Stopped");
  hidePluginWindow(false);
  socket.emit("process-video", {
    filename: videoTransferFileName,
    userId,
  });
};

export const onDataAvailable = (e: BlobEvent) => {
  socket.emit("video-chunks", {
    chunks: e.data,
    filename: videoTransferFileName,
  });
};

export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
  },
  videoElement: React.RefObject<HTMLVideoElement>
) => {
  if (onSources && onSources.audio && onSources.id) {
    userId = onSources.id;

    // 1. Capture DESKTOP (new way)
    const screenStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: onSources.preset === "HD" ? 1920 : 1280,
        height: onSources.preset === "HD" ? 1080 : 720,
        frameRate: 30,
      },
      audio: false,
    });

    // 2. Capture MICROPHONE
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: onSources.audio } },
      video: false,
    });

    // 3. Preview desktop in video element
    if (videoElement?.current) {
      videoElement.current.srcObject = screenStream;
      await videoElement.current.play();
    }

    // 4. Combine tracks
    const combined = new MediaStream([
      ...screenStream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    // 5. Record
    mediaRecorder = new MediaRecorder(combined, {
      mimeType: "video/webm; codecs=vp9",
    });
    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.onstop = stopRecording;
  }
};
