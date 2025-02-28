const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './app/views/**/*.{rb,erb,html}',
    './app/views/components/**/*rb',
    "../highway/app/javascript/**/*.js",
    "../highway/app/views/admin/**/*",
    "../highway/app/views/components/admin/**/*",
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        jaffa: "#f1821b",
        racing: "#0c3923",
        neutral: {
          150: "#efefef"
        }
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        mid: "0.9375rem"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries')
  ]
}
