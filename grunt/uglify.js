module.exports = {
  dist: {
    options: {
      compress: {
        drop_console: false
      }
    },
    files: {
      '<%= distPath %>/chGoogleDrive.min.js': [
        '<%= distPath %>/chGoogleDrive.js'
      ],
      '<%= distPath %>/google_module.min.js': [
        '<%= distPath %>/google_module.js'
      ]
    }
  }
};