var gulp = require('gulp'),
stylus = require('gulp-stylus');


var paths = {
  css: ['./resource/css/*.css'],
  styl: ['./resource/stylus/*.styl']
};

gulp.task('styl', function () {
  gulp.src(paths.styl)
  .pipe(stylus({
    compress: false
  }))
  .pipe(gulp.dest('./resource/css'));
});

gulp.task('css', function () {
  return gulp.src(paths.css);
});


gulp.task('watch', function() {

  gulp.watch(paths.styl, ['styl']);
  gulp.watch(paths.css, ['css']);

});

gulp.task('run', ['styl', 'watch']);
