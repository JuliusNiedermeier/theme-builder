"use client";

import { ThemeToggle } from "@/app/_components/theme-toggle";
import Image from "next/image";
import Logo from "@/app/_assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { ChevronsUpDownIcon, CopyIcon, MonitorIcon, PlusIcon } from "lucide-react";
import { Toggle } from "@/app/_components/ui/toggle";
import { useSizeCollection } from "@/app/(routes)/_state/size-store";
import { resolveSizeConfig } from "../_core/size";
import { Fragment, useEffect, useState } from "react";
import { SizeEditor } from "./_components/size-editor";
import { SizeBar } from "./_components/size-bar";
import { Ruler } from "./_components/ruler";
import { getSimulatedSizeCSSValue } from "../_core/size-simulation";
import { AddToClipboard } from "../_components/add-to-clipboard";

export default function ThemeBuilderPage() {
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  const sizeCollection = useSizeCollection();

  const selectedSize = useSizeCollection((state) => {
    return state.sizes.find((size) => size.id === selectedSizeId) || null;
  });

  const fluidSizeData = selectedSize ? resolveSizeConfig(selectedSize.size).data : null;

  const simulatedView = useSizeCollection((state) => state.simulatedView);

  useEffect(() => {
    addEventListener("keydown", handleEscapeDown, {
      capture: true,
    });

    return () => {
      removeEventListener("keydown", handleEscapeDown, { capture: true });
    };
  }, [selectedSizeId]);

  const handleEscapeDown = (e: globalThis.KeyboardEvent) => {
    if (e.key === "Escape" && selectedSizeId && document.activeElement === document.body) {
      setSelectedSizeId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Ruler />
      <div className="flex-1 relative overflow-y-auto">
        <div>
          {sizeCollection.sizes.map((item) => {
            const resolvedSize = resolveSizeConfig(item.size).data;
            if (!resolvedSize || simulatedView === null) return <Fragment key={item.id} />;

            const simulatedCss = getSimulatedSizeCSSValue({
              simulatedView,
              rem: resolvedSize.rem,
              vw: resolvedSize.vw,
              min: resolvedSize.min,
              max: resolvedSize.max,
            });

            if (!simulatedCss.ok) return <Fragment key={item.id} />;

            return (
              <div
                key={item.id}
                className="px-8 py-4 hover:bg-card/30 data-[selected=true]:bg-card/60 grid grid-cols-[16rem_min-content_1fr] gap-2 items-center"
                data-selected={selectedSizeId === item.id}
                onClick={() => setSelectedSizeId(item.id)}
              >
                <span className="font-mono">{item.name}</span>
                <AddToClipboard value={resolvedSize.css} />
                <SizeBar size={{ ...resolvedSize, css: simulatedCss.data }} className="overflow-hidden" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-4 pointer-events-none">
        {selectedSize && (
          <SizeEditor
            key={selectedSize.id}
            item={selectedSize}
            className="bg-card border rounded-xl ml-auto max-w-120 pointer-events-auto"
          />
        )}
        <div className="h-12 rounded-xl bg-card border flex gap-8 items-center pointer-events-auto">
          <Image src={Logo} alt="Logo" className="aspect-square size-8 ml-2 border rounded-md" />
          <Button size="sm" variant="ghost">
            <span>ACME Website</span>
            <ChevronsUpDownIcon />
          </Button>
          <span className="font-mono text-xs text-muted-foreground">{fluidSizeData?.css}</span>
          <Button size="icon-sm" className="ml-auto" onClick={() => sizeCollection.add()}>
            <PlusIcon />
          </Button>
          <ThemeToggle />
          <Avatar className="mr-2">
            <AvatarImage src="https://avatars.githubusercontent.com/u/55204325" alt="@juliusniedermeier" />
            <AvatarFallback>JN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
