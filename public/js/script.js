var resultLim = 20;

$('#search-input').keyup(function(e){
    if(e.keyCode == 13)
    {
        doSearch();
    }
});

$('#search-btn').click(function(){
	doSearch();
})

function doSearch() {
	var query = $('#search-input').val();
	if (query != "") {
		$('tbody tr').remove();
		$('.status').addClass('fa-refresh').addClass('fa-spin');
		$('table').css({display: ''});
		search_mp3bee(query);
		search_mp3skull(query);
	}
}

function updateTable(selector, artist, title, duration, kbps, link) {
	var tr = $('<tr></tr>')
		.append('<td>' + artist + '</td>')
		.append('<td>' + title + '</td>')
		.append('<td>' + duration + '</td>')
		.append('<td>' + kbps + '</td>')
		.append('<td class="th-dl"><a href="' + link + '"><i class="fa fa-lg fa-arrow-down"></i></a></td>');
	$(selector + ' tbody').append(tr);
}

function htmlEncode(s)
{
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}



function search_mp3bee(query) {
	$.get('http://www.mp3bee.ru/music/' + encodeURIComponent(query), function(data) {
		var page = $(data.responseText.replace(/<img[^>]*>/g, ''));
		var links = $(page).find('li.x-track');
		if (links.length > 0) {
			$('.table-mp3bee table').css({display: 'block'});
			links.each(function(index){
				if (index < resultLim) {
					var artist = $(this).find('.title > strong').text().trim();
					var title = $(this).find('.title .name a').text().trim();
					var duration = $(this).find('.time').text().trim();
					var kbps = "";
					var link = 'http://www.mp3bee.ru' + $(this).find('a.x-icon-download').attr('href');
					updateTable('.table-mp3bee', artist, title, duration, kbps, link)
				}
			});
			$('.table-mp3bee .status').removeClass('fa-refresh').removeClass('fa-spin').addClass('fa-check');
		}
		else {
			$('.table-mp3bee .status').removeClass('fa-refresh').removeClass('fa-spin').addClass('fa-times');
		}
	});
}


function search_mp3skull(query) {
	var queryR = query.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(-)+|(-)+$/g,'');
	$.get('http://mp3skull.com/mp3/' + queryR + '.html', function(data) {
		var page = $(data.responseText.replace(/<img[^>]*>/g, ''));
		var links = $(page).find('#song_html');

		if (links.length > 0) {
			$('.table-mp3skull table').css({display: 'block'});
			links.each(function(){
				var art_title = $(this).find('#right_song div:first').text().trim().split(" - ");
				var infos = $(this).find('.left').html().split("<br>");
				if (typeof infos[1] != 'undefined') {
					var artist = art_title[0].trim();
					var title = art_title.slice(1).toString().trim();
					var duration = infos[1].trim();
					var kbps = infos[0].split("<p>")[1].replace(/[^0-9]/g, '').trim();
					var link = 'http://www.mp3bee.ru' + $(this).find('a.x-icon-download').attr('href');
					updateTable('.table-mp3skull', artist, title, duration, kbps, link);
				}
			});
			$('.table-mp3skull .status').removeClass('fa-refresh').removeClass('fa-spin').addClass('fa-check');
		}
		else {
			$('.table-mp3skull .status').removeClass('fa-refresh').removeClass('fa-spin').addClass('fa-times');
		}
	});
}