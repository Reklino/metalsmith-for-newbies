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
        .pipe(replace('{{site.baseurl}}', '/metalsmith-for-newbies'))
        .pipe(gulp.dest('./src'))
});

// local fix for prose image urls.
gulp.task('prose-fix-local', function() {
    return gulp.src(['./src/**/*.md'])
        .pipe(replace('{{site.baseurl}}', ''))
        .pipe(gulp.dest('./src'))
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    })

    gulp.watch('./style/**/*.scss', ['sass'])
    gulp.watch('./build/**/*.html').on('change', browserSync.reload)
    gulp.watch('./build/media/*').on('change', browserSync.reload)
});

gulp.task('sass', function() {
    return gulp.src("./style/main.scss")
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("./build"))
        .pipe(browserSync.stream())
});

gulp.task('default', ['serve', 'sass', 'prose-fix-local', 'media']);