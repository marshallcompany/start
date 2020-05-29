const gulp 		   	 = require ('gulp'),
	  	gulpSass 	   = require ('gulp-sass'),
	  	browserSync  = require ('browser-sync').create(),
	  	autopreFixer = require ('gulp-autoprefixer'),
	  	csscomb 	   = require ('gulp-csscomb'),
	  	notify 	   	 = require ('gulp-notify'),
	  	imageMin     = require ('gulp-imagemin'),
	  	del          = require ('del');

function sass(){
	return gulp.src('./src/sass/**/*.scss')
	.pipe(gulpSass())
	.on("error", notify.onError({
		message: "Error: <%= error.message %>",
		title: "Error"
	}))
	.pipe(autopreFixer({
		browsers: ['last 2 versions'],
		cascade: true
	}))
	.pipe(csscomb())
	.pipe(gulp.dest('./src/css'))
	.pipe(browserSync.stream());
}

function watch(){
	browserSync.init({
        server: {
            baseDir: "./src"
		},
		port:8000,
		open: true,
		tunnel: false
    });
	gulp.watch('./src/sass/**/*.scss', sass);
	gulp.watch('./src/**/*.html').on('change', browserSync.reload);
	gulp.watch('./src/**/*.js').on('change', browserSync.reload);
	gulp.watch('./src/**/*.php').on('change', browserSync.reload);
}

// BUILD PROJECT
function clean(){
	return del(['dist/*']);
}

function build_image(){
	return gulp.src('./src/**/*.+(jpg|png|ico|svg)')
	.pipe(imageMin({
		interlaced: true,
		progressive: true,
		optimizationLevel: 5,
		svgoPlugins: [
			{
				removeViewBox: true
			}
		]
	}))
	.pipe(gulp.dest('dist'));
}

function build_fonts(){
	return gulp.src('./src/**/*.+(otf|ttf|woff|woff2|eot)')
		.pipe(gulp.dest('dist'));
}
function build_js(){
	return gulp.src('./src/**/*.js')
		.pipe(gulp.dest('dist'));
}
function build_html(){
	return gulp.src('./src/**/*.html')
		.pipe(gulp.dest('dist'));
}
function build_css(){
	return gulp.src('./src/**/*.css')
		.pipe(gulp.dest('dist'));
}

// TASK
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, build_image, build_fonts, build_js, build_html, build_css));
