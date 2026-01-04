/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                background: 'var(--bg-main)',
                surface: 'var(--bg-surface)',
                'surface-highlight': 'var(--bg-surface-highlight)',
                foreground: 'var(--text-main)',
                muted: 'var(--text-muted)',
                border: 'var(--border-color)',
                glass: "var(--glass-bg)",
                glassBorder: "var(--glass-border)",
                primary: "#3b82f6",
                secondary: "#ec4899",
            },
            backdropBlur: {
                xs: '2px',
                xl: '20px',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
            }
        },
    },
    plugins: [],
}
