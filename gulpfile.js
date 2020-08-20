const { watch, series, parallel, dest, src } = require('gulp');
const { execSync } = require('child_process');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssDeclarationSorter = require('css-declaration-sorter');
const cssnano = require('cssnano');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssCalc = require('postcss-calc');
const postcssMergeRules = require('postcss-merge-rules');

const paths = {
    src: 'src',
    build: 'dist',
};

// eslint-disable-next-line no-unused-vars
const copyToDist = () => {
    return src(`${paths.src}/**/*.*`).pipe(dest(paths.build));
};

const minifyCss = (cb) => {
    const postcssPlugins = [
        cssDeclarationSorter({ order: 'concentric-css' }),
        postcssFlexbugsFixes(),
        postcssCustomProperties(),
        postcssCalc(),
        postcssMergeRules(),
        cssDeclarationSorter({ order: 'concentric-css' }),
        autoprefixer(),
        cssnano(),
    ];

    src(`${paths.build}/**/*.css`)
        .pipe(postcss(postcssPlugins))
        .pipe(dest(paths.build));
    cb();
};
const minifyHtml = (cb) => {
    src(`${paths.build}/**/*.html`)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest(paths.build));
    cb();
};
const minifyJs = (cb) => {
    src(`${paths.build}/**/*.js`)
        .pipe(
            terser({
                keep_fnames: true,
                mangle: false,
            })
        )
        .pipe(dest(paths.build));

    cb();
};

const minifyCssDev = (cb) => {
    const postcssPlugins = [
        cssDeclarationSorter({ order: 'concentric-css' }),
        postcssFlexbugsFixes(),
        postcssMergeRules(),
        cssDeclarationSorter({ order: 'concentric-css' }),
    ];

    src(`${paths.src}/**/*.css`)
        .pipe(postcss(postcssPlugins))
        .pipe(dest(paths.src));
    cb();
};

const trueSyncSeries = (...tasks) => {
    return (cb) => {
        execSync(tasks.map((f) => `gulp ${f}`).join('&&'));
        cb();
    };
};

const afterBuild = parallel(minifyCss, minifyHtml, minifyJs);
const build = trueSyncSeries('minifyCssDev', 'copyToDist', 'afterBuild');

const browserSyncInit = (cb) => {
    browserSync.init({ server: { baseDir: paths.build } });
    cb();
};
const browserSyncReload = (cb) => {
    browserSync.reload();
    cb();
};

const watchAll = (cb) => {
    const watchOptions = {
        ignored: paths.build,
        delay: 300,
        awaitWriteFinish: true,
    };
    const taskWhenChange = series(build, browserSyncReload);

    watch(paths.src, watchOptions, taskWhenChange);
    cb();
};

exports.minifyStyleDev = minifyCssDev;

exports.build = build;
exports.afterBuild = afterBuild;
exports.default = series(build, browserSyncInit, watchAll);
