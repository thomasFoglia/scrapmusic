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
		/*search_mp3bee(query);
		search_mp3skull(query);*/
		search_mp3clan(query);
	}
}

function updateTable(selector, title, duration, kbps, link) {
	var tr = $('<tr></tr>')
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


function search_mp3clan(query) {

	$.ajax({
       url : 'scrape?q='+ query, 
       type : 'GET', 

       dataType : 'json' ,

       success : function(json, statut){
       		console.log(json);

       		$.each(json[0], function(i, item) {
			    updateTable('.table-mp3clan', this.title, '00', '320', this.link)
			})

       		
       },
       error : function(resultat, statut, erreur){
       		console.log(resultat);
         
       },
   });

}