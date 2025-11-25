import { ReactNode, useState } from "react";
import { cn, onCloseApp } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

type Props = {
  children: ReactNode;
  className?: string;
};

const ControlLayout = ({ children, className }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    console.log(event);
    setIsVisible(payload.state);
  });

  return (
    <div
      className={cn(
        className,
        isVisible && "invisible",
        "border-2 border-neutral-700 bg-[#171717] flex px-1 flex-col rounded-3xl overflow-hidden"
      )}
    >
      <div className="flex justify-between items-center p-5 draggable">
        <span className="non-draggable">
          <UserButton />
        </span>
        <XIcon
          onClick={onCloseApp}
          size={20}
          className="text-gray-400 non-draggable hover:text-white cursor-pointer"
        />
      </div>
      <div className="flex-1 h-0 overflow-auto">{children}</div>
      <div className="p-5 flex w-full">
        <div className="flex items-center gap-x-2">
          <img src="/opal-logo.svg" alt="Opal logo" />
          <p className="text-white text-2xl">Opal</p>
        </div>
      </div>
    </div>
  );
};

export default ControlLayout;
