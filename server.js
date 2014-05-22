var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();


app.get('/scrape', function (req, res) {

    var nbReturn = 0;
    var nbTotal = 0;
    var allSent = false;

    // Let's scrape Anchorman 2
    url = 'http://mrtzcmp3.net/search/kygo_sexual_healing';
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var title, bitrate, size;
            var json = [];

            $('.mp3Play').each(function (i, el) {

                var id = $(this).find('script').text().slice(18, -2).trim();


                var postData = {
                    a: id
                };

                require('request').post({
                    uri: "http://d.mrtzcmp3.net/bitrateY.php",
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    body: require('querystring').stringify(postData)
                }, function (err, r, body) {

                    var kb = body.split('<br />');
                    var kb2 = kb[0].replace(/\D/g, '');
                    var taille = kb[1].replace(/[a-zA-Z]/g, '');	// lettre mais pas point
                    console.log(kb2);
                    json.push({
                        kbps: kb2, taille : taille
                    });

                    nbReturn++;
                    if (allSent && nbTotal == nbReturn)
                        traiterDonnesJson(json);
                });


                nbTotal++;
            })
            allSent = true;
        }



    })

	function traiterDonnesJson(json) {
	    res.send(json);
	}


})

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;


