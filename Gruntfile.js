'use strict';

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    // grunt-contrib-watch
    watch: {
      options: {
        spawn: false
      },
      compass: {
        files: [
          'app/_scss/**/*.{sass,scss}'
        ],
        tasks: ['compass:server']
      },
      jekyll: {
        files: [
          'app/**/*.{html,yml,md,mkd,markdown}',
          '_config.yml',
          '!app/_bower_components'
        ],
        tasks: ['jekyll:server']
      }
    },

    // grunt-contrib-connect
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      dist: {
        options: {
          open: true,
          base: ['dist']
        }
      },
      server: {
        options: {
          open: true,
          base: [
            '.tmp',
            '.jekyll',
            'app'
          ]
        }
      }
    },

    // grunt-contrib-clean
    clean: {
      dist: {
        dot: true,
        src: [
          '.tmp',
          'dist/*',
          '!dist/.git*'
        ]
      },
      server: [
        '.tmp',
        '.jekyll'
      ]
    },

    // grunt-contrib-compass
    compass: {
      options: {
        bundleExec: true,
        sassDir: 'app/_scss',
        cssDir: '.tmp/css'
      },
      dist: {},
      server: {
        options: {
          cssDir: '.tmp/css'
        }
      }
    },

    // grunt-contrib-copy
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'app',
            src: ['fonts/**/*', 'img/**/*'],
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'app/_bower_components/bootstrap/dist',
            src: ['fonts/**/*'],
            dest: 'dist/'
          }
        ]
      }
    },

    // grunt-jekyll
    jekyll: {
      options: {
        bundleExec: true,
        config: '_config.yml',
        src: 'app'
      },
      server: {
        options: {
          dest: '.jekyll'
        }
      },
      dist: {
        options: {
          config: '_config.yml,_config.build.yml',
          dest: 'dist'
        }
      },
      check: {
        options: {
          doctor: true
        }
      }
    },

    // grunt-contrib-jshint
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      check: ['Gruntfile.js', 'app/js/**/*.js']
    },

    // grunt-rev
    rev: {
      dist: {
        files: {
          src: [
            'dist/js/**/*.js',
            'dist/css/**/*.css',
            'dist/img/**/*.{gif,jpg,jpeg,png,svg,webp}',
            'dist/fonts/**/*.{eot,otf,svg,svgz,ttf,woff}',
            '!dist/img/back.png'
          ]
        }
      }
    },

    // grunt-usemin
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist'
      }
    },
    usemin: {
      html: ['dist/**/*.html'],
      css: ['dist/css/**/*.css'],
      options: {
        dirs: ['dist/**/*'],
        basedir: 'dist'
      }
    },
    concat: {},
    uglify: {},

    concurrent: {
      server: [
        'compass:server',
        'jekyll:server'
      ],
      dist: [
        'compass:dist',
        'copy:dist'
      ]
    }
  });

  grunt.registerTask('check', [
    'jekyll:check',
    'jshint:check'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jekyll:dist',
    'concurrent:dist',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:server',
      'watch'
    ]);
  });

  grunt.registerTask('default', [
    'check',
    'build'
  ]);
};
