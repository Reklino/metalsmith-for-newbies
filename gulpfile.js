var gulp = require('gulp'),
	ghPages = require('gulp-gh-pages'),
	replace = require('gulp-replace'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create();

// deploys to gh-pages
gulp.task('deploy', function() {
		return gulp.src('./build/**/*')
			.pipe(ghPages());
	});

// fix for prose media destination
gulp.task('media', function() {
	return gulp.src(['./media/**/*'])
			.pipe(gulp.dest('./build/media'));
	});

// fix for prose image urls.
gulp.task('prose-fix', function() {
	return gulp.src(['./src/**/*.md'])
			.pipe(replace('{{site.baseurl}}', 'metalsmith-for-newbies/'))
			.pipe(gulp.dest('./src'))
	});

gulp.task('watch', function() {
		browserSync.init({
			server: {
				baseDir: "./build"
			}
		})
	});

gulp.task('sass', function() {
	return gulp.src("./style")
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest("./build/style"))
	});