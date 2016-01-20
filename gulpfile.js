var gulp = require('gulp'),
	ghPages = require('gulp-gh-pages')
	replace = require('gulp-replace');

// deploys to gh-pages
gulp.task('deploy', function() {
		return gulp.src('./build/**/*')
			.pipe(ghPages());
	})

// fix for prose media destination
gulp.task('media', function() {
	return gulp.src(['./media/**/*'])
			.pipe(gulp.dest('./build/media'));
	})

// fix for prose image urls.
gulp.task('prose-fix', function() {
	return gulp.src(['./src/**/*.md'])
			.pipe(replace('metalsmith-for-newbies/', ''))
			.pipe(gulp.dest('./src'))
	})