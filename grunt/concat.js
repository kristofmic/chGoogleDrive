module.exports = {
  dev: {
    options: {
      process: function(src, filepath) {
        return '\n// ' + filepath + '\n' + src;
      }
    },
    src: [
      '<%= jsPath %>/google_drive_module.js',
      '<%= jsPath %>/**/*.js'
    ],
    dest: '<%= distPath %>/chGoogleDrive.js'
  }
};
