const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Allow importing from outside of src directory
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
      );
      
      return webpackConfig;
    },
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
}; 