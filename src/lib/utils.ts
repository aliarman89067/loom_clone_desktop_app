import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

export const onCloseApp = () => window.ipcRenderer.send("closeApp");

export const fetchUserProfile = async (clerkId: string) => {
  const response = await httpClient.get(`/auth/${clerkId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data.user);
  return response.data;
};

export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke("getSources");
  const enumerateDevice =
    await window.navigator.mediaDevices.enumerateDevices();

  const audioInputs = enumerateDevice.filter(
    (device) => device.kind === "audioinput"
  );

  console.log("getting sources");
  return { displays, audio: audioInputs };
};
