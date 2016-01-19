var path = require('path');
console.log("handlebars-loader?helperDirs[]=" + __dirname + "/src/helpers");
module.exports = {
  entry: "./src/js/perfBookmarklet.js",
  output: {
    path: __dirname + "/dist/js/",
    filename: "perfBookmarklet.bundle.js"
  },
  module: {
    loaders: [
      { test: /\.hbs$/, loader: "handlebars-loader" },
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, "src/js"),
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
