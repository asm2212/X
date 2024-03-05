/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
     colors: {
      xwhite: "#e7e9ea",
      xblue: "#308CD8",
      xborder: "#2f3336",
      xlightgray: "#71767b",
      xdarkgray: "#17181c",
     }
    },
  },
  plugins: [],
};
