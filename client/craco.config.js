const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Allow importing from outside of src directory
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
      );

      // Could process constants for types that has 'as const' ending.
      // Make sure TypeScript files from shared directory are properly processed
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      if (oneOfRule) {
        const tsRule = oneOfRule.oneOf.find(
          (rule) => rule.test && rule.test.toString().includes('ts|tsx')
        );

        if (tsRule) {
          // Modify the include pattern to also include the shared directory
          tsRule.include = [tsRule.include, path.resolve(__dirname, '../shared')];
        }
      }

      return webpackConfig;
    },
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
};
