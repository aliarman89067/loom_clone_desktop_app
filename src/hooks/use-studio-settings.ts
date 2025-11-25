import { updateStudioSettingSchema } from "@/schemas/studio-setting.schema";
import { useZodForm } from "./use-zod-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateStudioSettings } from "@/lib/utils";
import { toast } from "sonner";

export const useStudioSettings = (
  id: string,
  screen?: string | null,
  audio?: string | null,
  preset?: "HD" | "SD",
  plan?: "FREE" | "PRO"
) => {
  const [onPreset, setPreset] = useState<"SD" | "HD" | undefined>();

  const { register, watch } = useZodForm(updateStudioSettingSchema, {
    screen: screen!,
    audio: audio!,
    preset: preset!,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      id: string;
      screen: string;
      audio: string;
      preset: "HD" | "SD";
    }) => updateStudioSettings({ ...data }),
    onSuccess: (data) => {
      return toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
  });

  useEffect(() => {
    if (screen && audio) {
      window.ipcRenderer.send("media-sources", {
        screen,
        id,
        audio,
        preset,
        plan,
      });
    }
  }, [screen, audio]);

  useEffect(() => {
    const subscribe = watch((value) => {
      setPreset(value.preset);
      mutate({
        screen: value.screen,
        id,
        audio: value.audio,
        preset: value.preset,
      });
      window.ipcRenderer.send("media-sources", {
        id,
        plan,
        screen: value.screen,
        audio: value.audio,
        preset: value.preset,
      });
    });

    return () => subscribe.unsubscribe();
  }, [watch]);

  return { register, isPending, onPreset };
};
