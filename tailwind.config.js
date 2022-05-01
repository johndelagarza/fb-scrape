function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    
    if (opacityValue === undefined || opacityValue === 'var(--tw-bg-opacity)') {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
};

module.exports = {
    content: [
      './src/pages/**/*.js',
      './src/components/**/*.js',
      './src/helpers/**/*.js',
      './src/*.js',
      "./node_modules/flowbite/**/*.js"
    ],
     important: true,
    theme: {
      extend: {
        colors: {
          primaryText: withOpacityValue('--color-primary-text'),
          onHoverPrimaryText: 'var(--color-on-hover-primary-text)',
          primaryBtn: 'var(--color-primary-btn)',
          primaryBg: withOpacityValue('--color-primary-bg'),
          onPrimaryBg: withOpacityValue('--color-on-primary-bg'),
          onPrimaryBgSoft: withOpacityValue('--color-on-primary-bg-soft'),
          onPrimaryBgSofter: 'var(--color-on-primary-bg-softer)',
          secondaryBg: 'var(--color-secondary-bg)',
          primaryBody: 'var(--color-primary-body)',
          nanoGreen: withOpacityValue('--color-nano-green'),
          nanoBlue: '#1EBAC4',
          error: withOpacityValue('--color-error')
        },
        height: {
          sm: '16px',
          md: '24px',
          lg: '48px',
          xl: '64px',
          '2xl': '300px',
          '4xl': '600px'
        },
        width: {
          '1/2': '50%',
          '1/7': '14.2857143%',
          '2/7': '28.5714286%',
          '3/7': '42.8571429%',
          '4/7': '57.1428571%',
          '5/7': '71.4285714%',
          '6/7': '85.7142857%',
          'sidebarWidth': `calc((100%) - (394px))`,
          'xl': '200px',
          '3xl': '400px',
          '4xl': '600px'
        },
        minWidth: {
          '0': '0',
          '1/4': '25%',
          '1/2': '50%',
          '3/4': '75%',
          '3xl': '400px',
          'full': '100%',
         },
         maxHeight: {
          '2xl': '300px'
         },
        fontSize: {
          'xs': '.75rem',
          'sm': '.875rem',
          'tiny': '.875rem',
           'base': '1rem',
           'lg': '1.125rem',
           'xl': '1.25rem',
           '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
           '5xl': '3rem',
           '6xl': '4rem',
          '7xl': '5rem'
        },
        fontFamily: {
          'sans': ['Montserrat', 'sans-serif']
         },
        textShadow: {
          'default': "0 0 20px var(--color-primary-bg)",
          'md': '0 2px 2px #000',
          'h2': '0 0 3px #FF0000, 0 0 5px #0000FF',
          'h1': '0 0 3px rgba(0, 0, 0, .8), 0 0 5px rgba(0, 0, 0, .9)',
       },
        gradientColorStops: theme => ({
          ...theme('colors'),
          'primary': '#57FE76',
          'secondary': '#1EBAC4',
          'danger': '#e3342f',
         }),
         keyframes: {
          'fade-in-down': {
              '0%': {
                  opacity: '0',
                  transform: 'translateY(-10px)'
              },
              '100%': {
                  opacity: '1',
                  transform: 'translateY(0)'
              },
          },
          
      },
      animation: {
          'fade-in-down': 'fade-in-down 0.5s ease-out',
          'spin-slow': 'spin 3s linear infinite',
          'animate-spin': ''
      },
      screens: {
        '3xl': {'min': '1600px'}
      }
      },
  },
  variants: {
    scrollbar: ['rounded']
  },
    plugins: [
      require('tailwindcss-textshadow'),
      require('tailwind-scrollbar'),
      require('flowbite/plugin')
    ]
  }