// postcss.config.js
export default {
  plugins: {
    //tailwindcss: {},  //Versão antiga
    '@tailwindcss/postcss': {}, // CORRETO (para v4)
    autoprefixer: {},
  },
}