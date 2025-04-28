// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // adjust if your project structure is different
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/line-clamp'),
    ],
  }
