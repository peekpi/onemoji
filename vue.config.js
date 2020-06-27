const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  publicPath: isProduction
    ? '/onemoji/dist/'
    : '/',
    productionSourceMap: isProduction
      ? false : true,
}