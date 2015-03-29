//a js program.
//used to fetch picture in HUPU.com

var request = require('request');
var http = require('http');
var fs = require('fs');
var jsdom = require("jsdom");

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {
    flags: 'a'
});
var log_stdout = process.stdout;

console.logf = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};


var url = 'http://i1.hoopchina.com.cn/u/1109/04/947/1007947/';

//analysisHtmlSource(10);

function analysisHtmlSource(pageCnd) {
    for (var i = 1; i <= pageCnd; ++i) {
        var fileName = './download/' + i.toString() + '.html';
        fs.readFile(fileName, dealWithEachHtml);
    }
    console.log('OK!');
}

function dealWithEachHtml(err, data) {
    if (err) throw err;
    var html = data.toString();
    var re = /src=".*small.jpg/g;
    var i, match = re.exec(data);
    while (match) {
        var src = match[0].substring(5).replace(/small/g, 'big');
        console.logf(src);
        match = re.exec(data);
    }
}

downLoadAll();

var list;

function downLoadAll() {
    var fileName = './debug.log';
    fs.readFile(fileName, function(err, data) {
        if (err) throw err;
        list = data.toString().split('\n');
        oneFile(0);
    });
}

function oneFile(index) {
    var head = 'http://i5.hoopchina.com.cn/u/1109/04/947/1007947/';
    console.log(list[index]);
    download(list[index], 'pic/' + list[index].substring(head.length), oneFile, index);
}

function download(url, dest, cb, index) {

    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb(index+1)); // close() is async, call cb after close completes.
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest); 
    });
}
