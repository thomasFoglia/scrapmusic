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
    download('http://mp3clan.com/url.php?tid=1331848_78099493&name=2pac%20-%20Lil%27%20Homies',
        'test.mp3', function() {
            console.log('done');
        });
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;


function search_mp3clan(search, callback) {
    url = 'http://mp3clan.com/mp3/' + search + '.html';

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


function download(uri, filename, callback) {
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

// function scrapeResultsPage(html, callback) {
//     var $ = cheerio.load(html);

//     var title, bitrate, size;
//     var links = [];

//     $('.mp3Play').each(function (i, el) {
//         links.push({
//                     id_api:  $(this).find('script').text().slice(18, -2).trim(),
//                     id_file: $(this).find('span.mp3Title').attr('id')
//                 });
//     });
//     async.map(links, getSongInfos, function(err, results){
//         console.log(results);
//         callback(results);
//     });  
// }

// function getSongInfos(infos, callback) {
//     request.post({
//         uri:        "http://d.mrtzcmp3.net/bitrateY.php",
//         headers:    {'content-type': 'application/x-www-form-urlencoded'},
//         body:       require('querystring').stringify({a: infos.id_api})
//     }, function (err, r, body) {

//         var splitted = body.split('<br />');
//         var kb = splitted[0].replace(/\D/g, '');
//         var taille = splitted[1].replace(/[a-zA-Z]/g, '');    // lettre mais pas point

//         callback(null, {
//             file: 'http://mrtzcmp3.net/d_' + infos.id_file + '.mp3',
//             kbps: kb, 
//             taille : taille
//         });        
//     });
// }