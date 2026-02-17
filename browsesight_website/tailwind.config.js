module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF", // White background
        "surface-primary": "#F8F9FA", // Light grey panel
        "surface-secondary": "#F0F2F5", // Slightly darker panel
        primary: "#3B74DE", // Blue accent
        "primary-hover": "#2B5EBC",
        "text-primary": "#0B0B0B", // Near-black text
        "text-secondary": "#4B5563", // Medium grey
        border: "#1A1A1A", // Strong near-black border
        success: "#2ECC71",
        warning: "#F5A524",
        danger: "#E5484D",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderWidth: {
        3: "3px",
      },
      borderRadius: {
        DEFAULT: "6px",
        panel: "6px",
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #000000",
        "brutal-hover": "2px 2px 0px 0px #000000",
      },
    },
  },
  plugins: [],
};
