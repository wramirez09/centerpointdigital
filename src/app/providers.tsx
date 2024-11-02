"use client";

import { ThemeProvider } from "next-themes";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <MantineProvider theme={theme}>{children}</MantineProvider>
    </ThemeProvider>
  );
}
