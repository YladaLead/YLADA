/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // HerbaLead Brand Colors
        herbalead: {
          green: {
            primary: '#10B981',
            light: '#34D399',
            dark: '#059669',
            lighter: '#D1FAE5',
          },
          blue: {
            primary: '#1E40AF',
            light: '#3B82F6',
            dark: '#1E3A8A',
          },
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            500: '#6B7280',
            900: '#111827',
          },
        },
        // Legacy support
        primary: {
          green: '#10B981',
          'green-dark': '#059669',
          'green-light': '#D1FAE5',
        },
        accent: {
          gold: '#F59E0B',
          blue: '#3B82F6',
        },
      },
    },
  },
  plugins: [],
}
