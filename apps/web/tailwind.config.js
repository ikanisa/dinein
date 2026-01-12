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
                primary: {
                    DEFAULT: 'var(--color-primary-500)',
                    500: 'var(--color-primary-500)',
                    600: 'var(--color-primary-600)'
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary-500)',
                    500: 'var(--color-secondary-500)',
                    600: 'var(--color-secondary-600)'
                },
                accent: {
                    DEFAULT: 'var(--color-accent-500)',
                    500: 'var(--color-accent-500)'
                },
                ink: 'var(--color-ink)',
            },
            backdropBlur: {
                xs: '2px',
                xl: '20px',
            },
            boxShadow: {
                'glow': '0 0 24px rgba(255, 107, 53, 0.35)',
            },
            fontFamily: {
                display: ['var(--font-display)', 'serif'],
                body: ['var(--font-body)', 'system-ui', 'sans-serif'],
                accent: ['var(--font-accent)', 'serif']
            }
        }
    },
    plugins: [],
}
