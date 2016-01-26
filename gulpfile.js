var gulp = require('gulp'),
    ghPages = require('gulp-gh-pages'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

var metalsmith = require('metalsmith'),
    layouts = require('metalsmith-layouts'),
    inPlace = require('metalsmith-in-place'),
    markdown = require('metalsmith-markdown'),
    moment = require('moment'),
    collections = require('metalsmith-collections'),
    beautify = require('metalsmith-beautify'),
    permalinks = require('metalsmith-permalinks'),
    gulpsmith = require('gulpsmith'),
    gulp_front_matter = require('gulp-front-matter'),
    assign = require('lodash.assign');

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

var plugin = function(files, metalsmith, done) {
    console.log('ran content');
    done();
};

gulp.task('content', function() {
    gulp.src('./src/**/*')
        .pipe(gulp_front_matter()).on("data", function(file) {
            assign(file, file.frontMatter);
            delete file.frontMatter;
        })
        .pipe(gulpsmith()
            .metadata({
                site: {
                    title: 'MetalSmith for Newbies',
                    url: 'http://reklino.github.io/ms'
                },
                navigation: [{
                    name: "Blog",
                    url: "index.html"
                }, {
                    name: "About",
                    url: "guide.html"
                }]
            })
            .use(plugin)
            .use(collections({
                posts: {
                    pattern: 'posts/*.md',
                    sortBy: 'date',
                    reverse: true
                }
            }))
            .use(markdown())
            .use(permalinks({
                pattern: ':title',
                date: 'YYYY'
            }))
            .use(layouts({
                engine: 'jade',
                moment: moment
            }))
            .use(beautify({
                'js': false,
                'html': {
                    'wrap_line_length': 80
                }
            })))
        .pipe(gulp.dest("./build"))
});

gulp.task('sass', function() {
    return gulp.src("./style/main.scss")
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("./build"))
        .pipe(browserSync.stream())
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
    gulp.watch('./src/**/*.md', ['content'])
    gulp.watch('./layouts/**/*.jade', ['content'])
});

gulp.task('default', ['prose-fix-local', 'content', 'sass', 'media', 'serve']);