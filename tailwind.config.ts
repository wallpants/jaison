import type { Config } from "tailwindcss";

function color(cssVar: string) {
   return `hsl(var(--${cssVar}) / <alpha-value>)`;
}

export default {
   darkMode: ["class"],
   content: [
      "./pages/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./src/**/*.{ts,tsx}",
   ],
   prefix: "",
   theme: {
      extend: {
         colors: {
            border: color("mauve-6"),
            input: color("violet-7"),
            ring: color("violet-9"),
            background: color("mauve-1"),
            foreground: color("mauve-12"),
            primary: {
               DEFAULT: color("violet-11"),
               foreground: color("violet-1"),
            },
            secondary: {
               DEFAULT: color("mauve-6"),
               foreground: color("mauve-12"),
            },
            success: {
               DEFAULT: color("grass-11"),
               foreground: color("grass-1"),
            },
            destructive: {
               DEFAULT: color("tomato-11"),
               foreground: color("tomato-1"),
            },
            muted: {
               DEFAULT: color("mauve-3"),
               foreground: color("mauve-12"),
            },
            accent: {
               DEFAULT: color("violet-6"),
               foreground: color("mauve-12"),
            },
            popover: {
               DEFAULT: color("mauve-1"),
               foreground: color("mauve-12"),
            },
            card: {
               DEFAULT: color("mauve-1"),
               foreground: color("mauve-12"),
            },
         },
         borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
         },
         keyframes: {
            "accordion-down": {
               from: { height: "0" },
               to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
               from: { height: "var(--radix-accordion-content-height)" },
               to: { height: "0" },
            },
         },
         animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
         },
      },
   },
   // eslint-disable-next-line
   plugins: [require("tailwindcss-animate")],
} satisfies Config;
