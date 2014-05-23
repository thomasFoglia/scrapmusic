var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var app = express();



var download = function(uri, filename, callback){
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

download('http://mp3clan.com/url.php?tid=1331848_78099493&name=2pac%20-%20Lil%27%20Homies',
    'test.mp3', function(){
  console.log('done');
});


app.get('/scrape', function (req, res) {



    url = 'http://mrtzcmp3.net/search/kygo_sexual_healing';

    var search = "claude_francois";

    async.parallel([
        search_mp3clan(search)
    ], function (error,response) {
        console.log(response);
    });


    request(url, function (error, response, html) {
        if (!error) {
            scrapeResultsPage(html, function(results) {
                res.send(results);
            });
        }
    })
})





app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;




function search_mp3list(search) {
    url = 'http://mp3clan.com/mp3/' + search + '.html';

    request(url, function (error, response, html) {
        if (!error) {
            scrapeResultsPage_mp3clan(html, function(results) {
                res.send(results);
            });
        }
    });
}



function scrapeResultsPage_mp3clan(html, callback) {
    var $ = cheerio.load(html);

    var title, bitrate, size;
    var links = [];

    $('.mp3list').each(function (i, el) {
        links.push({
                id_api:  $(this).find('script').text().slice(18, -2).trim(),
                id_file: $(this).find('span.mp3Title').attr('id')
            });
    });
}




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