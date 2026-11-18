/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---- 搜推算法知识库设计 token（design.md §2） ----
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        accent: {
          DEFAULT: 'var(--accent)',
          deep: 'var(--accent-deep)',
          tint: 'var(--accent-tint)',
        },
        mark: 'var(--mark)',
        'code-bg': 'var(--code-bg)',
        success: '#5F7A4E',
        warning: '#B98A2F',
        danger: '#A94438',
        // 篇章主题色（design.md §2.2，低饱和）
        chapter: {
          search: '#A9713A',
          recommendation: '#B0503C',
          strategy: '#B08A2E',
          evaluation: '#71803F',
          'llm-frontier': '#4E7A72',
          'engineering-org': '#6E6257',
        },
        // ---- shadcn/ui token（映射到暖纸色系） ----
        border: 'var(--line)',
        input: 'var(--line)',
        ring: 'var(--accent)',
        background: 'var(--paper)',
        foreground: 'var(--ink)',
        primary: {
          DEFAULT: 'var(--accent)',
          foreground: '#FFFDF9',
        },
        secondary: {
          DEFAULT: 'var(--surface-2)',
          foreground: 'var(--ink-2)',
        },
        destructive: {
          DEFAULT: '#A94438',
          foreground: '#FFFDF9',
        },
        muted: {
          DEFAULT: 'var(--surface-2)',
          foreground: 'var(--ink-3)',
        },
        popover: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--ink)',
        },
        card: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--ink)',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        display: ['52px', { lineHeight: '1.15', fontWeight: '700' }],
        h1: ['36px', { lineHeight: '1.25', fontWeight: '700' }],
        h2: ['26px', { lineHeight: '1.35', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '1.45', fontWeight: '600' }],
        'body-l': ['17px', { lineHeight: '1.9' }],
        body: ['15.5px', { lineHeight: '1.75' }],
        small: ['13.5px', { lineHeight: '1.6' }],
        label: ['12px', { lineHeight: '1.4', letterSpacing: '0.18em', fontWeight: '500' }],
        mono: ['14px', { lineHeight: '1.7' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(60,48,32,.06)',
        'card-hover': '0 8px 24px rgba(60,48,32,.10)',
      },
      borderRadius: {
        card: '12px',
        figure: '16px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'scroll-hint': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'scroll-hint': 'scroll-hint 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
