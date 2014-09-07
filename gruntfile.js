module.exports = gruntConfig;

function gruntConfig(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    jsPath: 'assets/javascripts',
    componentsPath: 'assets/components',
    distPath: 'dist',

    concat: require('./grunt/concat'),
    copy: require('./grunt/copy'),
    watch: require('./grunt/watch'),
    uglify: require('./grunt/uglify'),
    //bgShell: require('./grunt/bgShell'),
    karma: require('./grunt/karma')
  });

  for (var task in pkg.devDependencies) {
    if (task !== 'grunt' && !task.indexOf('grunt')) {
      grunt.loadNpmTasks(task);
    }
  }

  grunt.registerTask('build:dev', [
    'concat',
  ]);
  grunt.registerTask('build:dist', [
    'build:dev',
    'copy',
    'uglify',
  ]);
  //grunt.registerTask('protractor', ['bgShell:protractor']);
  grunt.registerTask('test:dev', [
    'build:dev',
    'karma:dev'
    //'protractor'
  ]);
  grunt.registerTask('default', [
    'build:dist'
  ]);
}