"use client";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <button
        className="text-muted-foreground hover:text-foreground bg-card border-border group relative size-5 cursor-pointer rounded-full border"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <IconSunFilled className="absolute inset-0 m-auto size-4 scale-100 group-hover:rotate-25 dark:scale-0" />
        <IconMoonFilled className="absolute inset-0 m-auto size-4 scale-0 group-hover:rotate-25 dark:scale-100" />
      </button>
    </>
  );
}
