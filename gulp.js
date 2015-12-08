'use strict';

var gulp = require('gulp'),
    pngquant = require('imagemin-pngquant'),
    gulpSequence = require('gulp-sequence'),
    plugins = require('gulp-load-plugins')();

var publishdir = './source';

gulp.task('default', ['watch']);
gulp.task('bower', ['bower-files']);
gulp.task('build', ['clean-dist','rev']);
gulp.task('mincss', ['clean-css', 'sass', 'libcss']);
gulp.task('minjs', ['clean-js', 'minify-js','minify-config-js']);

gulp.task('watch', ['mincss', 'minjs'], function () {
    gulp.watch('source/js/**/*.js', ['minjs']);
    gulp.watch(publishdir+'/sass/**/*.scss', ['mincss']);

});


gulp.task('bower-files', ['clean-bower-files'], function () {
    return gulp.src('./bower.json')
        .pipe(plugins.mainBowerFiles({
            overrides: {
                'jquery': {
                    main: [
                        'jquery.min.js'
                    ]
                },
                'modernizr': {
                    main: [
                        'modernizr.js'
                    ]
                },
                'respond': {
                    main: [
                        'dest/respond.min.js'
                    ]
                },
                'html5shiv': {
                    main: [
                        'dist/html5shiv.min.js'
                    ]
                }
            },
            includeDev: true
        }))
        .pipe(gulp.dest(publishdir + '/libs'));
});

gulp.task('clean-bower-files', function () {
    return gulp.src(publishdir + '/libs/*', {read: false})
        .pipe(plugins.clean({force: true}));
});

gulp.task('clean-css', function () {
    return gulp.src(publishdir + '/css/*', {read: false})
        .pipe(plugins.clean({force: true}));
});

gulp.task('clean-js', function () {
    return gulp.src(publishdir + '/js/*', {read: false})
        .pipe(plugins.clean({force: true}));
});
gulp.task('clean-dist', function () {
    return gulp.src('web/dist', {read: false})
        .pipe(plugins.clean({force: true}));
});
gulp.task('sass', function () {
    gulp.src(['sass/**/*.scss','!sass/ie8.scss'], {base: 'web'})
        .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
        .pipe(plugins.cssUrlAdjuster({
            replace: ['images', 'assets/images']
        }))

        .pipe(plugins.concatCss('vendor.css'))
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(publishdir + '/css'))


});

gulp.task('libcss', function () {
    gulp.src(['web/assets/libs/**/*.css'])
        .pipe(plugins.concatCss('base.css'))
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(publishdir + '/css'))
});

gulp.task('minify-js', function () {
    return gulp.src(['web/assets/libs/**/*.js', '!web/assets/libs/jquery/**/*.js','!web/assets/libs/respond/**/*.js','!web/assets/libs/html5shiv/**/*.js'])
        .pipe(plugins.order([
            'web/assets/libs/jquery/**/*.js'
        ]))
        .pipe(plugins.concat('vendor.js'))
        .pipe(plugins.uglify().on('error', plugins.util.log))
        .pipe(plugins.rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(publishdir + '/js'))
});
gulp.task('minify-config-js', function () {
    return gulp.src(['web/assets/config/**/*.js'])
        .pipe(plugins.concat('config.js'))
        .pipe(plugins.uglify().on('error', plugins.util.log))
        .pipe(plugins.rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(publishdir + '/js'))
});
gulp.task('rev', function () {
    return gulp.src(['web/assets/css/*.css', 'web/assets/js/*.js'], {base: 'web'})
        .pipe(plugins.rev())
        .pipe(gulp.dest('web/dist'))
        .pipe(plugins.rev.manifest({
            base: 'web',
            merge: true
        }))
        .pipe(gulp.dest(publishdir + '/css'));
});

gulp.task('minimage', function () {
    return gulp.src('web/assets/images/*')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('web/assets/images'));
});
