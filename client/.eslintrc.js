module.exports = {
  extends: [
    '../.eslintrc.js',
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'import/prefer-default-export': 'off'
  }
}; 