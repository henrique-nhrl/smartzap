const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv({
      path: './.env', // caminho para o seu arquivo .env
    }),
  ],
};
