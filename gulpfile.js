var gulp      = require('gulp')
var cleanCSS  = require('gulp-clean-css')
var uglify    = require('gulp-uglify')

// Copy files from node_modules
gulp.task('node-import', function() {
  gulp.src(['node_modules/jquery/dist/jquery.min.js',
            'node_modules/socket.io-client/dist/socket.io.js'])
      .pipe(gulp.dest('public/js'))
  gulp.src(['node_modules/font-awesome/css/font-awesome.min.css'])
      .pipe(gulp.dest('public/css'))
  gulp.src(['node_modules/font-awesome/fonts/*'])
      .pipe(gulp.dest('public/fonts'))
})

// Minify CSS
gulp.task('minify-css', function() {
  return gulp.src('build/css/*')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('public/css'))
})

// Minify JS
gulp.task('minify-js', function() {
  return gulp.src('build/js/*')
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
})

// Run everything
gulp.task('default', ['minify-css', 'minify-js'])
