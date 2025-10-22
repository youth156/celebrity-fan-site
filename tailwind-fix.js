// 临时文件用于修复Tailwind配置
if (typeof tailwind === 'undefined') {
  window.tailwind = {};
}
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#6C38FF',
        secondary: '#FF5E7D',
        dark: '#1A1A2E',
        light: '#F7F7F9'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  }
};