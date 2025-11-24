import { SourceDeviceStateProps } from "@/hooks/use-media-source";

type Props = {
  state: SourceDeviceStateProps;
  user:
    | ({
        subscription: {
          plan: "FREE" | "PRO";
        } | null;
        studio: {
          id: string;
          screen: string | null;
          mic: string | null;
          camera: string | null;
          preset: "HD" | "SD";
          userId: string | null;
        } | null;
      } & {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        clerkId: string;
      })
    | null;
};

const MediaConfiguration = ({ state, user }: Props) => {
  // Continue from here
  const {} = useStudioSettings();

  return <form className="flex h-full relative w-full flex-col gap-y-5"></form>;
};

export default MediaConfiguration;
