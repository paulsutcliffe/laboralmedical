

/* Author:
10.Corregir el :class del botón de agregar en el adminlist de photos. Al momento de agregarle el parametro de :album_id, ha tomado el :class como un parametro más y lo está pasando en el url innecesariamente y no está aplicando la clase css.
11.Corregir el :class en los links de adminlist de albums.



5.Estilizar el la página menu.html.rb del controller access, con el mismo formato que servicios.
8.Estilizar el título de todos los news y los edits



<a href="/images/3-images/sidebar-logo-consulting.png" class="lightbox" rel="group">
	<img src="/images/3-images/logo.png">
</a>
*/


$(document).ready(function() {

	// slider
	$('#slider').jdSlider({
		width  : 615,
		height : 248,
		delay  : 2000,
		transitions : 'slideOver',
		showNavigation : true,
		showSelectors : true
	});

	// links open new window
	$('.social-buttons a').click(function() {
		window.open($(this).attr('href'));
		return false
	});

	jQuery('.a3:eq(1)').addClass('b');
	jQuery('.front-blocks article p span').each(function(){
$(this).appendTo($(this).parent().parent().parent())

});

// for ie
jQuery('body').attr('style', 'background:url(/images/1-backgrounds/bg-main.jpg) repeat');

	// back buttons
	$('.btn-back').attr('href','javascript:history.back(-1)');


	// equal backgrounds
	dark = $('#sidebar-dark').height();
	light = $('#sidebar-light').height();

	if (dark > light) {
 		$('#sidebar-light').css('height', dark);
	} else {
  		$('#sidebar-dark').css('height', light);

	}


	// services text resize
	$('.btn-type-1').each(function() {
	  if ($(this).text().length > 30) {
	    $(this).addClass('btn-type-1-alt');
	  }

	});

	// image not found
	$('img').error(function(){
		$(this).attr('src', '/images/1-backgrounds/img-not-loaded.png');
	});


	// dates format
	$('.date').each(function() {
		hora = $(this).text().substring($(this).text().length - 12,19);
		fecha = $(this).text().substr(0, $(this).text().length - 12);
		$(this).text('Publicado el ' + fecha + 'a las ' + hora);
	});



	// CMS fade images
	$('.btn-edit img').bind({
 		mouseover: function(){
   			$(this).stop().animate({opacity:1});
   		},
   		mouseout: function(){
   			$(this).stop().animate({opacity:0.2});
    	}
	});

	// CMS radio categories
	radio = $('input[name$="[category_id]"]')
	lms = '<label class="radio">LMS</label> <input type="radio" name="category" value="1" checked class="radio left">' // create html tag 1
	lmab = '<label class="radio">LaboralMedical</label><input type="radio" name="category" value="2" class="radio">' // create html tag 2
	radios = lms + lmab
	radio.css({'position':'absolute', 'left':'-1996px', 'opacity':'0'});
	radio.after(radios); // insert both html tags
	$('input[name="category"]').click(function() {
		radio.val($(this).val());
	});


	// lightbox
//	jQuery(document).ready(function(){
	  jQuery('.lightbox').lightbox();

//	});


}); // end






















