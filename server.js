var express = require('express');
    fs      = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    async   = require('async'),
    path    = require('path'),
    app     = express();

var html_dir = './views/';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile(html_dir + 'index.html');
});

app.get('/scrape', function (req, res) {
    async.parallel([
        function(callback){
            search_mp3clan(req.query.q, callback);
        }
    ], function (error, response) {
        res.json(response);
    });
});

app.get('/dl', function (req, res) {
    if (req.query.site == 'mp3clan') {
        download_mp3clan(req.query.link,
            req.query.title + '.mp3', function() {
                console.log('done');
            });
    }
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;


function search_mp3clan(search, callback) {
    var query = search.replace(/\s+/g, '_').toLowerCase();
    url = 'http://mp3clan.com/mp3/' + query + '.html';
    request(url, function (error, response, html) {
        if (!error) {
            scrapeResultsPage_mp3clan(html, function(results) {
                callback(null, results);
            });
        }
        else {
            callback(null, 'error');
        }
    });    
}

function scrapeResultsPage_mp3clan(html, callback) {
    var $ = cheerio.load(html);
    var title, bitrate, size;
    var results = [];

    $('#mp3list .mp3list-table').each(function (i, el) {
        results.push({
            title:  $(this).find('.unselectable').text().trim(),
            link:   $(this).find('.mp3list-download a').attr('href')
        });
    });

    callback(results);
}


function download_mp3clan(uri, filename, callback) {
    var jar = request.jar();
    var cookie = request.cookie("download=approved");
    jar.setCookie(cookie, uri);

    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request({
            uri: uri,
            jar: jar
        }).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};