var gulp = require('gulp'),
	browserSync = require('browserSync'),
	var ghPages = require('gulp-gh-pages');

gulp.task('deploy', function() {
		return gulp.src('./build/**/*')
			.pipe(deploy());
	})