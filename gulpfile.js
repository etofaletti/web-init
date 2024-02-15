const {src, dest, watch, parallel} = require('gulp');

//CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//IMG
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JS
const terser = require('gulp-terser-js');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    images: 'src/img/**/*'
}

function css(done){
    src(paths.scss)  
        .pipe(sourcemaps.init())
        .pipe(plumber()) 
        .pipe(sass())  
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css')); 
    done();
}

function images(done){
    const options = {
        optimizationLevel: 3
    }

    src(paths.images)
        .pipe(cache(imagemin(options))) 
        .pipe(dest('build/img')); 
    done();
}

function toWebp(done){
    const options = {
        quality: 50
    }

    src('src/img/**/*.{png,jpeg}')
        .pipe(webp(options)) 
        .pipe(dest('build/img')); 
    done();
}

function toAvif(done){
    const options = {
        quality: 50
    }

    src('src/img/**/*.{png,jpeg}')
        .pipe(avif(options)) 
        .pipe(dest('build/img')); 
    done();
}

function javascript(done){
    src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));
    done();
}

function dev(done){
    watch(paths.scss, css);
    watch(paths.js, javascript);
    watch(paths.images, images);
    watch(paths.images, toWebp);
    watch(paths.images, toAvif);
    done();
}

exports.css = css;
exports.js = javascript;
exports.images = images;
exports.toWebp = toWebp;
exports.toAvif = toAvif
exports.dev = parallel(css, images, toWebp, toAvif, javascript, dev);