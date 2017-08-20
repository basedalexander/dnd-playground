module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: './dist/bundle.js',
    path: __dirname
  },
  devtool: 'inline-source-map',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  watch: true
 };