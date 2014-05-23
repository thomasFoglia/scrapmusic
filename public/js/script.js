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

$('.table-mp3clan').on('click', 'td.th-dl a' , function() {
    link = $(this).data('link');
    title = $(this)
});

function doSearch() {
	var query = $('#search-input').val();
	if (query != "") {
		$('tbody tr').remove();
		$('.status').addClass('fa-refresh').addClass('fa-spin');
		$('table').css({display: ''});
		/*search_mp3bee(query);
		search_mp3skull(query);*/
		search_mp3clan(query);
	}
}

function updateTable(selector, title, duration, kbps, link, site) {
	var tr = $('<tr></tr>')
		.append('<td>' + title + '</td>')
		.append('<td>' + duration + '</td>')
		.append('<td>' + kbps + '</td>')
		.append('<td class="th-dl"><a href="#" data-title="' + title + '" data-link="' + link + '" data-site="' + site + '"><i class="fa fa-lg fa-arrow-down"></i></a></td>');
	$(selector + ' tbody').append(tr);
}

function htmlEncode(s)
{
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}


function search_mp3clan(query) {
	$.ajax({
       url : 'scrape', 
       type : 'GET', 
       dataType : 'json',
       data: {q: query},

       success : function(json, statut){
       		$.each(json[0], function(i, item) {
			    updateTable('.table-mp3clan', this.title, '00', '320', this.link, 'mp3clan')
			});
			$('.table-mp3clan .status').removeClass('fa-refresh').removeClass('fa-spin');
       },
       error : function(resultat, statut, erreur){
       		console.log(resultat);
         
       },
   });

}