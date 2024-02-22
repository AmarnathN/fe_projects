import React from "react";
import { TypewriterEffectSmooth } from "../components/animations/components/ui/typewriter-effect.tsx";
import { Card } from "../components/shadcn/components/ui/card.jsx";
import { Label } from "flowbite-react";
import { ScrollArea } from "../components/shadcn/components/ui/scroll-area.jsx";

export default function Home() {
  const words = [
    {
      text: "Match",
      className: "text-xl sm:text-2xl xl:text-5xl",
    },
    {
      text: "your",
      className: "text-xl sm:text-2xl xl:text-5xl",
    },
    {
      text: "Soulmate",
      className: "text-xl sm:text-2xl xl:text-5xl",
    },
    {
      text: " @ ",
      className: "text-xl sm:text-2xl xl:text-5xl",
    },
    {
      text: "Parinaye.",
      className: "text-2xl sm:text-3xl xl:text-10xl text-primary",
    },
  ];
  return (
    <div className="mx-auto shadow-lg h-screen">
      <div className="flex flex-col h-2/3 items-center justify-center">
        <Label className="text-sm sm:text-base">
          The road to "US" starts from here
        </Label>
        <TypewriterEffectSmooth words={words} className="flex items-center" />
      </div>
    </div>
  );
}
