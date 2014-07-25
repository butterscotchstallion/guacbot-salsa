module.exports = function(grunt) {
    grunt.initConfig({
        express: {
            dev: {
                options: {
                    script: '/home/salsa/src/salsa/bin/www'
                }
            }
        },
        watch: {
            express: {
                files:  [ 'Gruntfile.js', 'app.js', 'routes/*.js' ],
                tasks:  [ 'express:dev' ],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['scss/**/*.scss'],
                tasks: ['scsslint', 'sass'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ['public/javascripts/**/*.js'],
                tasks: ['requirejs'],
                options: {
                    spawn: false
                }
            },
            html: {
                files: ['views/**.html'],
                tasks: ['htmlmin'],
                options: {
                    spawn: false
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: "compressed",
                    debugInfo: true
                },
                files: {
                    'public/build/screen.min.css': 'scss/screen.scss'
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl       : "public/javascripts",
                    mainConfigFile: "public/javascripts/main.js",
                    name          : "main",
                    out           : "public/build/app.min.js",
                    include       : ["requireLib"]
                }
            }
        },
        htmlmin: {   
            dist: {
                options: {
                    removeComments    : true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'src/index.html',     // 'destination': 'source'
                    'dist/contact.html': 'src/contact.html'
                }
            }
        },
        scsslint: {
            allFiles: [
              'scss/modules/**/*.scss',
              'scss/*.scss'
            ],
            options: {
                config        : './config/scss-lint.yml',
                //reporterOutput: 'scss-lint-report.xml',
                colorizeOutput: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    //grunt.loadNpmTasks('grunt-contrib-htmlmin');
    //grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-scss-lint');
    
    grunt.registerTask('server', ['express:dev', 'watch:express']);
    grunt.registerTask('watchassets', [
        'watch:css', 
        'watch:js'
        //'watch:html'
    ]);
    
    grunt.registerTask('default', ['server']);
};







