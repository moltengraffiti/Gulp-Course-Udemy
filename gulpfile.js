let gulp = require("gulp");
var uglify = require("gulp-uglify");
var livereload = require("gulp-livereload");
var concat = require("gulp-concat");
var minifyCss = require("gulp-minify-css");
var autoprefixer = require("gulp-autoprefixer");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
var del = require("del");
var zip=require('gulp-zip');

//Image Compression
var imagemin = require("gulp-imagemin");
var imageminPngQuant = require("imagemin-pngquant");
var imageminJpegRecompress = require("imagemin-jpeg-recompress");

//File Paths
var SCRIPTS_PATH = "public/scripts/**/*.js";
//var CSS_PATH = "public/css/**/*.css";
var SCSS_PATH = "public/scss/**/*.scss";
var DEST_PATH = "public/dist";
var IMAGES_PATH = "public/images/*";

//Styles - SASS
gulp.task("styles", function() {
  console.log("Starting styles task");
  return (
    gulp
      .src("public/scss/styles.scss")
      .pipe(
        plumber(function(err) {
          console.log("Styles task error");
          console.log(err);
          this.emit("end");
        })
      )
      .pipe(sourcemaps.init())
      .pipe(
        autoprefixer({
          browsers: ["last 3 versions"]
        })
      )
      //We don't need concat or minify wirh SASS, as they're built into the plugin. Replace with a call to sass
      // .pipe(concat("styles.css"))
      //.pipe(minifyCss())
      .pipe(
        sass({
          outputStyle: "compressed"
        })
      )
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DEST_PATH))
      .pipe(livereload())
  );
});

/*Styles - CSS
gulp.task("styles", function() {
  console.log("Starting styles task");
  return gulp
    .src(["public/css/reset.css", CSS_PATH])
    .pipe(
      plumber(function(err) {
        console.log("Styles task error");
        console.log(err);
        this.emit('end');
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      autoprefixer({
        browsers: ["last 3 versions"]
      })
    )
    .pipe(concat("styles.css"))
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DEST_PATH))
    .pipe(livereload());
});
*/

//Scripts
gulp.task("scripts", function() {
  console.log("Starting scripts task");
  return gulp
    .src(SCRIPTS_PATH)
    .pipe(
      plumber(function(err) {
        console.log("Scripts task error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(uglify())
    .pipe(concat("scripts.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DEST_PATH))
    .pipe(livereload());
});

//Images
gulp.task("images", function() {
  console.log("Starting images task");
  return gulp
    .src(IMAGES_PATH)
    .pipe(
      imagemin([
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.svgo(),
        imagemin.optipng(),
        imageminPngQuant(),
        imageminJpegRecompress()
      ])
    )
    .pipe(gulp.dest(DEST_PATH + "/images"));
});

//Clean
gulp.task("clean", function() {
  return del.sync([DEST_PATH]);
});

//Zip
gulp.task("export", function(){
return gulp.src('public/**/*')
.pipe(zip('website.zip'))
.pipe(gulp.dest('./'))
})

//Default
gulp.task("default", ["clean", "images", "styles", "scripts"], function() {
  console.log("Starting default task");
});

// Watch
gulp.task("watch", ["default"], function() {
  console.log("Starting watch task");
  require("./server.js");
  livereload.listen();
  gulp.watch(SCRIPTS_PATH, ["scripts"]);
  //gulp.watch(CSS_PATH, ["styles"]);
  gulp.watch(SCSS_PATH, ["styles"]);
});
