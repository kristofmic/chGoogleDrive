module.exports = {
  lodashJS: {
    expand: true,
    src: [
      '<%= jsPath %>/vendor/google_module.js',
    ],
    dest: '<%= distPath %>',
    flatten: true
  }
};