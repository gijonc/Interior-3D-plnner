module.exports = function (grunt) {

	require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

	var globalConfig = {
		moduleName: "blueprint3d",
		sources: ["src/*.ts", "src/*/*.ts"],
		srcDir: "src",
		outDir: "dist",
		docDir: "doc",
		appDir: "app/js",
		buildDir: ".build",
		appSources: [".build/*.ts", ".build/*/*.ts"],
	};

	var configuration = {
		clean: [
			globalConfig.outDir,
			globalConfig.docDir,
			globalConfig.appDir + "/" + globalConfig.moduleName + ".js",
			globalConfig.appDir + "/" + globalConfig.moduleName + ".js.map",
			globalConfig.appDir + "/three.min.js",
			globalConfig.buildDir,
			'.tscache',
		]
	};

	configuration.copy = {
		source: {
			src: globalConfig.srcDir + "/**",
			dest: globalConfig.buildDir + "/"
		},

		compiled: {
			src: globalConfig.outDir + "/" + globalConfig.moduleName + ".js",
			dest: globalConfig.appDir + "/" + globalConfig.moduleName + ".js"
		},

		three: {
			src: "node_modules/three/build/three.min.js",
			dest: globalConfig.appDir + "/three.min.js"
		},
	};

	configuration.ts = {
		options: {
			target: "es6",
			declaration: false,
			sourceMap: true,
			removeComments: false,
			options: {
				types: [
					"three"
				]
			}
		},
		debug: {
			src: globalConfig.appSources,
			dest: globalConfig.appDir + "/" + globalConfig.moduleName + ".js"
		},
		release: {
			src: globalConfig.sources,
			dest: globalConfig.outDir + "/" + globalConfig.moduleName + ".js"

		}
	};

	//Watch, Browser Sync and Concurrent

	configuration.watch = {
		scripts: {
			files: ['src/**/*.ts'],
			tasks: ["copy:source", "ts:debug"],
			options: {
				spawn: true,
				livereload: true,
			}
		}
	};

	configuration.browserSync = {
		dev: {
			bsFiles: {
				src: globalConfig.appDir + "/" + globalConfig.moduleName + ".js"
			},
			options: {
				server: {
					watchTask: true,
					baseDir: "./app"
				}
			}
		}
	};

	configuration.concurrent = {
		target1: ["browserSync", "watch"]
	};

	//TypeDoc and Uglify

	configuration.typedoc = {
		options: {
			name: globalConfig.moduleName,
			target: "es6",
			mode: "file",
			readme: "none"
		}
	};

	configuration.typedoc[globalConfig.moduleName] = {
		options: {
			out: globalConfig.docDir + "/" + globalConfig.moduleName,
			name: globalConfig.moduleName
		},
		src: globalConfig.sources
	};

	configuration.uglify = {
		options: {
			mangle: true,
			beautify: false,
			sourceMap: true
		}
	};
	configuration.uglify[globalConfig.moduleName] = {
		files: {}
	};

	configuration.uglify[globalConfig.moduleName].files[globalConfig.outDir + "/" + globalConfig.moduleName + ".min.js"] = globalConfig.outDir + "/" + globalConfig.moduleName + ".js";

	grunt.initConfig(configuration);

	grunt.registerTask("app", [
		"copy:three",
	]);

	grunt.registerTask("release", [
		"clean",
		"ts:release",
		"uglify:" + globalConfig.moduleName,
		"typedoc:" + globalConfig.moduleName
	]);

	grunt.registerTask("debug", [
		"clean",
		"copy:source",
		"ts:debug",
		"app",
		"concurrent:target1"
	]);

	grunt.registerTask("default", [
		"debug"
	]);

	grunt.event.on('watch', function (action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};
