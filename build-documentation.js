
var glob = require('glob');
var fs = require('fs');
var markdox = require('markdox');
var async = require('async');
var path = require('path');
var _ = require('lodash');

var doxTemplate = __dirname + '/src/documentation/file-dox-template.ejs';
var docFolder = __dirname + '/documentation/';
var configDocFolder = docFolder + 'config/';
var docSrcFolder = __dirname + '/src/documentation/';

var options = {
    src: [
        'src/scripts/**/*.js'
    ],

    configTarget: 'config'
};

var allFiles = getSourceFileList(options.src);
var filesToCopy = ['connectors.md'];

ensureDirectory([docFolder]);

generatePerFileDoc(allFiles);
generateAllFilesDoc(allFiles);

copyDocViewer(filesToCopy);


function ensureDirectory(paths) {

    function ensure(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir); }
    _.each(paths, ensure);
}

function copyDocViewer(srcFiles) {
    srcFiles.forEach(function (file) {
        var src = docSrcFolder + file;
        var dst = docFolder + file;
        if(fs.existsSync(docSrcFolder + file)) {
            console.log('copying file ' + src + ' -> ' + dst);
            copyFile(src, dst, function(err) { if(err) console.log(err); });
        } else {
            console.log('file ' + src + ' does not exists!');
        }
    });
}

function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

function getSourceFileList(srcSpec) {
    var allFiles = [];
    srcSpec.forEach(function (spec) {
        glob(spec, { sync: true, nosort: true }, function (er, files) {
            allFiles = _.union(allFiles, files);
        });
    });

    return allFiles;
}

function commentNormalizer(data) {
    // change simple /* comments to /*! comments
    // so Dox does not treat them as jsdoc documentation comments
    return data.replace(/\/\*(?!\*)/gm, '/*!');
}

function generatePerFileDoc(allFiles) {
    // One file per Javascript file
    async.forEach(allFiles, function(file, next) {
        markdox.process(file, {
            output: docFolder + path.basename(file) + '.md',
            template: doxTemplate,
            formatter: function(docfile){
                return docfile;
            },
            compiler: function(filepath, data){
                return commentNormalizer(data);
            }
        }, next);
    }, function(err) {
        if (err) {
            throw err;
        }

        console.log('Documents generated with success');
    });
}

function generateAllFilesDoc(allFiles) {
    // One file for all Javascript files
    var output = docFolder + 'all.md';
    markdox.process(allFiles, {
        output:output,
        template: doxTemplate,
        formatter: function(docfile){
            return docfile;
        },
        compiler: function(filepath, data){
            return commentNormalizer(data);
        }
    }, function() {
        console.log('File `all.md` generated with success');
    });
}

