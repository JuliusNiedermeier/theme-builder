"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/app/_components/ui/toggle-group";
import { useTheme } from "next-themes";

type Theme = "light" | "dark" | "system";

export const ThemeToggle = () => {
  const theme = useTheme();

  return (
    <ToggleGroup
      variant="outline"
      type="single"
      size="sm"
      value={theme.theme}
      onValueChange={(value) => value && theme.setTheme(value)}
    >
      <ToggleGroupItem value="system" aria-label="System theme">
        <MonitorIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="light" aria-label="Light theme">
        <SunIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark theme">
        <MoonIcon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
