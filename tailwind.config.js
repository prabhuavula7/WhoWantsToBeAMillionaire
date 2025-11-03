module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Core brand palette
        'wwtbam-bg': '#0a0a1a',
        'wwtbam-ink': '#03051a',
        'wwtbam-navy': '#07103a',
        'wwtbam-panel': '#191928',
        'wwtbam-indigo': '#4f46e5',
        'wwtbam-violet': '#6d28d9',
        'wwtbam-gold': '#fbbf24',
        'wwtbam-emerald': '#10b981',
        'wwtbam-cyan': '#06b6d4',
        'wwtbam-foam': 'rgba(255,255,255,0.06)'
      },
      boxShadow: {
        'glass': '0 8px 30px rgba(0,0,0,0.6)',
        'neon-sm': '0 6px 22px rgba(79,70,229,0.18)',
        'neon-lg': '0 18px 48px rgba(79,70,229,0.22)',
        'gold-sm': '0 10px 30px rgba(251,191,36,0.10)',
        'emerald-sm': '0 12px 36px rgba(16,185,129,0.10)'
      },
      ringColor: {
        'wwtbam-indigo': '#4f46e5',
        'wwtbam-gold': '#fbbf24',
        'wwtbam-emerald': '#10b981'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.92' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 1.8s ease-in-out infinite',
        'shimmer-fast': 'shimmer 1.2s linear infinite'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};