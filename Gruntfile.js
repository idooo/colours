/* global module:false */
module.exports = function(grunt) {

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			main: {
				options: {
					// banner: '<%= meta.banner %>\n'
				},
				files: {
					'dist/ido.colours.min.js': 'js/ido.colours.js'
				}
			}
		},

		less: {
			main: {
				options: {
					style: 'compressed'
				},
				files: {
					'dist/ido.colours.min.css': [ 'css/ido.colours.less' ]
				}
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				loopfunc: true,
				globals: {
					head: false,
					module: false,
					console: false,
					define: false
				}
			},
			files: [ 'Gruntfile.js', 'js/ido.colours.js' ]
		},

		connect: {
			server: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		},

		watch: {
			main: {
				files: [ 'Gruntfile.js', 'js/ido.colours.js' ],
				tasks: 'js'
			},
			theme: {
				files: [ 'css/ido.colours.less' ],
				tasks: 'css'
			}
		}

	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );

	// Default task
	grunt.registerTask( 'default', [ 'js', 'css' ] );

	// Theme task
	grunt.registerTask( 'js', [ 'jshint', 'uglify' ] );
	grunt.registerTask( 'css', [ 'less' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

};
