var project = require('grunt-coffee-browser-project');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  project.init(grunt, {
    coffeeBrowserProject: {
      environments: {
        'default': {},
        content: {
          basename: 'quoter-chrome-content'
        }
      }
    },
    watch: {
      'default': {
        files: [ 'src/**/*.coffee', 'node_modules/quoter/dist/**/*.js' ],
        tasks: [ 'default', 'content' ]
      }
    }
  });
};
