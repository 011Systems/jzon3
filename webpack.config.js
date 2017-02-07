module.exports = {
  entry: {
    json_z3: "./src/jzon3.js",
  },
  output: {
    path: __dirname+'/build/',
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
