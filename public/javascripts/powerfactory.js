/*
 * @name JawDropper Slider
 * @desc plugin for jQuery
 *
 * @author Holydog
 * @version 0.1
 * @requires jQuery v1.4+ 
 *
 */
;(function($) {

$.jdSlider = function(args, options) {
	var opts = $.extend({}, $.jdSlider.defaults, options);
	return window;
} // $.jdSlider

//
// Defaults 
//
$.jdSlider.defaults = {
	autoAdvance        : true,     // Change slides automatically
	delay              : 2000,     // Delay between slide change (in ms)
	transitionDuration : 1000,     // Duration of the transition in ms
	                               // note : Its hard to come up with a single value that suits well to every transition.
	                               //        so this value is not followed EXACTLIY by all transitions(*).
                                   // Trasitions available : 
 								   //   blinds*, blocksDiagonalIn*, clock, circle, diamond, exitStageLeft, exitStageRight, fade,
								   //   fountain*, lightBeam, randomBlocks*, randomSlicesVertical*, randomSlicesHorizontal*,
								   //   shrink, sliceFade, sliceSlideVertical*, sliceSlideHorizontal*, slide, slideOver, 
								   //   stretchOut, zipper**, slide, slideOver, stretchOut, zipper*
	transitions        : "all",    // List of the transitions used by the slider. for example "sliderIn, zipper, diamond, fade". default "all" for all transitions available
	randomTransitions  : false,    // If true, the slider will show a random transition listed in "transitions" option. If false, will cycle through the transitions sequentially
	pauseOnHover       : true,     // Pause slide show when mouse over the slider 
    showCaption        : "hover",  // Show image captions. Can be true, false or "hover", in this case the captions will be show on mouseover  
    showSelectors      : "hover",  // Show image selectors. Can be true, false or "hover", in this case the selectors will be show on mouseover  
    showNavigation     : "hover",  // Show previous and next buttons. Can be true, false or "hover", in this case the selectors will be show on mouseover  
	width              : 600,      // Width of the slider
	height             : 300       // Height of the slider
};

// Constants
var LIGHTBEAM_GLOW_WIDTH = 74;
var SCRIPT_PATH = "";



$.fn.jdSlider = function(options) {
	var	opts = $.extend({}, $.jdSlider.defaults, options);
	return this.each(function() {
		var $this = $(this);
		$this.data('jdSlider:options', opts);
		buildSliderFor(this, opts);
	});	
}; // fn.jdSlider

$.fn.jdSliderPrev = function(options) {
	var	opts = $.extend({}, $.jdSlider.defaults, options);
	return this.each(function() {
		prevSlide($(this), options);
	});	
}; // fn.jdSliderPrev

$.fn.jdSliderNext = function(options) {
	var	opts = $.extend({}, $.jdSlider.defaults, options);
	return this.each(function() {
		nextSlide($(this), options);
	});	
}; // fn.jdSliderNext

$.fn.jdSliderStop = function(options) {
	var	opts = $.extend({}, $.jdSlider.defaults, options);
	return this.each(function() {
		stopSlider( $(this) );
	});	
}; // fn.jdSliderStop

$.fn.jdSliderPlay = function(options) {
	var	opts = $.extend({}, $.jdSlider.defaults, options);
	return this.each(function() {
		playSlider( $(this) );
	});	
}; // fn.jdSliderPlay


function buildSliderFor(elem, options) {
	var slider = $(elem),
		slides = [];

	// adjust slider CSS
	if (slider.css('position')=='static') slider.css('position', 'relative');
	slider.css({
		overflow      : 'hidden',
		width         : options.width,
		height        : options.height
	})

	// find slides inside element
	var slide;
	slider.children('img, a').each(function(){
		var img, $this=$(this), next;
		img = $this.is("a") ? $this.children('img:first') : $this;
		slide = {
			elem  : $this,
			image : img,
			title : img.attr('title')
		}
		next = img.next();
		if ( next.length>0 && !next.is("a") && !next.is("img") ) {
			slide.caption = next.html();
			next.css('display', 'none');
		} else {
			slide.caption = img.attr('title');
		}
		
		slides.push(slide);
		img.css({ border : 'none' });
		$this.css({
			outline  : 0,
			display  : "none",
			position : 'absolute'
		})

	})
	slider.data('jdslider:slides', slides);

	// create slider caption
	slider.append( $('<div class="jdslider-caption"></div>').css({ display:'none' }) );

	// create prev, next, play & pause buttons
	$('<div class="jdslider-control jdslider-prev"></div>')
		.css({'display': 'none',
		'width':'15px', 'height':'55px', 'border':'none', 'margin-left':'10px'} )
		.click(function(){ prevSlide(slider) })
		.appendTo(slider);
	$('<div class="jdslider-control jdslider-next"></div>')
		.css({'display': 'none', 
		'width':'15px', 'height':'55px', 'border':'none', 'margin-right':'10px'} )
		.click(function(){ nextSlide(slider) })
		.appendTo(slider);
	
	// create slide selector
	var selectors = $('<div class="jdslider-selectors"></div>').css('display','none').appendTo(slider),
	    selector;
	for(var i=0; i<slides.length; i++) {
		selector = $('<div class="jdslider-selector"></div>').html(i+1).appendTo(selectors);
		selector.data('jdslider:slide_number', i)
		        .click(function(){ showSlide(slider, $(this).data('jdslider:slide_number'));	});
	}
	slider.data("jdslider:selector", selectors);

	// pauseOnHover 
	var showCaptionIsHover = false;
	slider.hover(function(e){
		if (e.originalTarget!=slider && 
		    ( $(e.originalTarget).hasClass('jdslider_light_right') || $(e.originalTarget).hasClass('jdslider_light_left') ) ) return;
		if (options.pauseOnHover) pauseSlider(slider);
		if (options.showCaption=='hover') {
			showCaptionIsHover  = true;
			options.showCaption = true;
			showCaption(slider);	
		}
		if (options.showSelectors=='hover') showSelectors(slider);
		if (options.showNavigation=='hover') showNavigation(slider);
	}, function(){
		if (options.pauseOnHover) unpauseSlider(slider);

		if (showCaptionIsHover) {
			options.showCaption='hover';
			showCaptionIsHover = false;
			hideCaption(slider);
		}
		if (options.showSelectors=='hover') hideSelectors(slider);
		if (options.showNavigation=='hover') hideNavigation(slider);
	});
	

	// show first slide and set timeout to transition
	showSlide(slider, 0, 'fade');
	updateControlsVisibility(slider);
} // buildSliderFor

function prevSlide(slider, options) {
	var current_slide = slider.data('jdslider:current-slide'),
	    slides = slider.data('jdslider:slides'),
	    prev, 
	    transition;
	    
	if (options) {
		transition = options.transition;
	}

	if (current_slide > 0) { prev = current_slide-1 } else { prev = slides.length-1 };
	showSlide(slider, prev, transition);
} // prevSlide

function nextSlide(slider, options) {
	var current_slide = slider.data('jdslider:current-slide'),
	    slides = slider.data('jdslider:slides'),
	    next, 
	    transition;
	    
	if (options) {
		transition = options.transition;
	}

	if (current_slide < slides.length-1) { next = current_slide+1 } else { next = 0};
	showSlide(slider, next, transition);

} // nextSlide


function showSlide(slider, slideIndex, transition){
	if (slider.data('jdslider:current-slide')==slideIndex) return;
	var showing = slider.data('jdslider_showing');
	if (showing) return;
	if (inTransition(slider)) return;

	clearTimeout( slider.data('jdSlider:timer') );

	inTransition(slider,true);
	hideCaption(slider);
	slider.data('jdslider_showing', true);
	
	if (!transition) transition = getNextTransitionName(slider);
	if (!transition) transition = 'fade';

	var trans = $.jdSlider.transitions[transition];
	trans(slider, slideIndex);

} // showSlide

function slideShowed(slider, slideIndex) {
	var slides = slider.data('jdslider:slides');

	if ( slider.data('jdslider:current-slide')!=undefined ) {
		slides[slider.data('jdslider:current-slide')].elem.hide();
	}

	slider.css('background','url('+ $(slides[slideIndex].image).attr('src') +') no-repeat');
	slider.data('jdslider:current-slide', slideIndex);
	
	slides[slideIndex].elem.css({ left:0, top:0, display:'block' });
	slides[slideIndex].image.css({ display:'block' });
	
	$('.jdslider_block', slider).css('display', 'none');
	slider.data('jdslider_showing', false);
	var selector = slider.data("jdslider:selector");
	$('.jdslider-current', selector).removeClass('jdslider-current');
	$(selector[0].childNodes[slideIndex]).addClass('jdslider-current')

	inTransition(slider, false);
	showCaption(slider);
	setTimerForAutoAdvance(slider);
} // slideShowed

function inTransition(slider, value) {
	if (value==undefined) return slider.data('jdslider:inTransition'); 
	slider.data('jdslider:inTransition', value); 
} // inTransition


function setTimerForAutoAdvance(slider) {
	var	options = getOptions(slider);
	if (options.autoAdvance && (!options.paused)) {
		var timer = setTimeout(function(){ 
			nextSlide(slider);
		}, options.delay);
		slider.data('jdSlider:timer', timer);
	}
} // setTimerForAutoAdvance

function stopSlider(slider) {
	getOptions(slider).autoAdvance = false;
	clearTimeout( slider.data('jdSlider:timer') );
}; // stopSlider

function playSlider(slider) {
	getOptions(slider).autoAdvance = true;
	getOptions(slider).paused = false;
	setTimerForAutoAdvance(slider);
}; // playSlider

function pauseSlider(slider) {
	getOptions(slider).paused = true;
	clearTimeout( slider.data('jdSlider:timer') );
}; // pauseSlider

function unpauseSlider(slider) {
	getOptions(slider).paused = false;
	setTimerForAutoAdvance(slider);
}; // unpauseSlider

function getNextTransitionName(slider) {
	var options = getOptions(slider);
	var transitions = slider.data("jdslider:transitions");
	if (!transitions) {
		if (options.transitions && options.transitions!="all") {
			transitions = options.transitions.replace(/ /g, "").split(",");
		} else {
			transitions = [];
			for(i in $.jdSlider.transitions) transitions.push(i);
		}
		slider.data("jdslider:transitions", transitions);
	}
	if (options.randomTransitions) {
		return transitions[ random(transitions.length) ];
	} else {
		var i = slider.data("jdslider:last_transition_index");
		if ((i==undefined) || (++i>=transitions.length)) i=0;
		slider.data("jdslider:last_transition_index", i);
		return transitions[ i ];
	}
}; // getNextTransitionName

// 
// update controls visibility
//
function updateControlsVisibility(slider) {
	var options=getOptions(slider);
	if (options.showSelectors==true) showSelectors(slider)
	else hideSelectors(slider);
	if (options.showNavigation==true) showNavigation(slider)
	else hideNavigation(slider);
} // updateControlsVisibility

function hideCaption(slider) {
	$(".jdslider-caption", slider).fadeOut(300);
} // hideCaption

function showCaption(slider) {
	if (!(getOptions(slider).showCaption==true)) return;
	if ( inTransition(slider) ) return;
	var current_slide = slider.data('jdslider:current-slide'),
	    slides  = slider.data('jdslider:slides'),
	    caption = slides[current_slide].caption; 
	if (caption=="") return;
	$(".jdslider-caption", slider).html(caption).fadeIn();
} // showCaption

function hideSelectors(slider) {
	$(".jdslider-selectors", slider).fadeOut(300);
} // hideSelectors

function showSelectors(slider) {
	$(".jdslider-selectors", slider).fadeIn();
} // showSelectors

function hideNavigation(slider) {
	$(".jdslider-prev, .jdslider-next", slider).fadeOut(300);
} // hideNavigation

function showNavigation(slider) {
	$(".jdslider-prev, .jdslider-next", slider).fadeIn(300);
} // showNavigation


// *********************************
//
// Transitions
//
// *********************************
$.jdSlider.transitions = {

	//
	// Blinds
	//
	blinds : function(slider, slideIndex, direction) {
		var blocks;
		var number_of_slices = 10;
	
		var DIRECTIONS = ['l', 'r', 't', 'b']
		if (!direction) direction = DIRECTIONS[ random(4) ];
		var cols = isVertical(direction) ? 1 : number_of_slices;
		var rows = isVertical(direction) ? number_of_slices : 1;
	
		blocks = getBlocks(slider, cols, rows, {
			backgroundImage  : 'url('+getSlideUrl(slider, slideIndex)+')'
		});

		var finished = 0;
		function animation_finished(){ 
			finished++;
			if (finished==number_of_slices) slideShowed(slider, slideIndex); 
		}
	
		var property = (direction=='l' || direction=='r') ? 'width' : 'height' ;
		if (direction=='r' || direction=='b') blocks = blocks.toArray().reverse();

		var duration = getOptions(slider).transitionDuration;
		$.each(blocks, function(index, val){
			var block = $(val);
			var animated_prop = {};
			animated_prop[property] = block[property]();
			block.css('display', 'block')
				 .css(property, 0);
			setTimeout(function(){
				block.animate(animated_prop, duration*0.75, animation_finished);
			}, index*duration/blocks.length*0.75 );
		});

	}, // blinds

	//
	// Blocks Diagonal In
	//
	blocksDiagonalIn :function(slider, slideIndex, options) {
		var blocks, cols = 8, rows = 4, number_of_blocks = cols*rows;
	
		blocks = getBlocks(slider, cols, rows, {
			backgroundImage : 'url('+getSlideUrl(slider, slideIndex)+')',
			opacity : 0,
			display : 'block'
		});
	
		var finished = 0;
		function animation_finished(){ 
			finished++;
			if (finished==number_of_blocks) slideShowed(slider, slideIndex); 
		}

		var duration = getOptions(slider).transitionDuration;
		$.each(blocks, function(index, val){
			var block = $(val);
			var lefty = block.css('left');
			var topy  = block.css('top');
			block.css({ left: block.height()*1.5+parseInt(lefty), top: block.width()*1.5+parseInt(topy) });
			setTimeout(function(){
				block.animate({ left: lefty, top: topy, opacity: 1 }, duration*0.5, animation_finished);
			}, (val.slider_x+val.slider_y)*duration/(cols*(rows-1)) );
		});
	}, // blocks_diagonal_in


	//
	// Clock
	//
	clock : function(slider, slideIndex, direction) {
		slider = $(slider);
		var blocks, number_of_slices = Math.floor(slider.height()/5+0.5);
		blocks = getLayers(slider, slideIndex, number_of_slices);
		slider.data('jdslider:blocks', blocks);
		slider.data('jdslider:showing', slideIndex);
		slider.attr('jdslider:clock', 0);
		slider.animate({ 'jdslider:clock': 1 }, getOptions(slider).transitionDuration, 'linear');
	}, // clock


	//
	// Circle
	//
	circle : function(slider, slideIndex, direction) {
		slider = $(slider);
		var blocks, number_of_slices = Math.floor(slider.height()/5+0.5);
		blocks = getLayers(slider, slideIndex, number_of_slices);
		slider.data('jdslider:blocks', blocks);
		slider.data('jdslider:showing', slideIndex);
		slider.attr('jdslider:circle', 0);
		slider.animate({ 'jdslider:circle': 1 }, getOptions(slider).transitionDuration, 'linear');
	}, // circle


	//
	// Diamond
	//
	diamond : function(slider, slideIndex, direction) {
		slider = $(slider);
		var blocks, number_of_slices = Math.floor(slider.height()/4);
		blocks = getLayers(slider, slideIndex, number_of_slices);
		slider.data('jdslider:blocks', blocks);
		slider.data('jdslider:showing', slideIndex);
		slider.attr('jdslider:diamond', 0);
		slider.animate({ 'jdslider:diamond': 1 }, getOptions(slider).transitionDuration, 'linear');
	}, // diamond


	//
	// Exit_stage_left & Exit_stage_right
	//
	exitStageLeft : function(slider, slideIndex, direction) {
		if (direction!='left' && direction!='right') direction='left';
		var current_slide = slider.data('jdslider:current-slide'),
		slider = $(slider);
		var blocks, number_of_slices = Math.floor(slider.height()/5+0.5);
		blocks = getBlocks(slider, 1, number_of_slices, {
			backgroundImage : 'url('+getSlideUrl(slider, current_slide)+')',
			display: 'block'
		});

		slider.css('background','url('+ getSlideUrl(slider, slideIndex) +') no-repeat');
		var slides = slider.data('jdslider:slides');
		slides[slider.data('jdslider:current-slide')].elem.hide();

		slider.data('jdslider:blocks', blocks);
		slider.data('jdslider:showing', slideIndex);
		slider.attr('jdslider:exit_stage_'+direction, 0);
		if (direction=='left')  slider.animate({ 'jdslider:exit_stage_left'  : 1 }, getOptions(slider).transitionDuration, 'easeInOutBack');
		if (direction=='right') slider.animate({ 'jdslider:exit_stage_right' : 1 }, getOptions(slider).transitionDuration, 'easeInOutBack');
	}, // exit_stage

	//
	// Exit_stage_right
	//
	exitStageRight : function(slider, slideIndex, direction) {
		$.jdSlider.transitions.exitStageLeft(slider, slideIndex, 'right');
	}, // exit_stage_right

	
	//
	// Fade
	//
	fade : function(slider, slideIndex) {
		var block = getBlocks(slider, 1, 1, {
			background : 'url('+getSlideUrl(slider, slideIndex)+') no-repeat',
			display : 'none'
		});
		block.fadeIn( getOptions(slider).transitionDuration,  function(){ slideShowed(slider, slideIndex) } );
	}, // fade


	//
	// Fountain
	//
	fountain : function(slider, slideIndex, direction) {
		var blocks;
		var number_of_slices = 20;
	
		var DIRECTIONS = ['t', 'b'];
		if (!direction) direction = DIRECTIONS[ random(2) ];
		var cols = number_of_slices; rows = 1;
		blocks = getBlocks(slider, cols, rows, {
			backgroundImage : 'url('+getSlideUrl(slider, slideIndex)+')',
			opacity : 0
		});

		var finished = 0;
		function animation_finished(){ 
			finished++;
			if (finished==number_of_slices) slideShowed(slider, slideIndex); 
		}
	
		var value = (direction=='t') ? -slider.height() : slider.height();
		var duration = getOptions(slider).transitionDuration;
		var tmp, to_radians = Math.PI/blocks.length, 
	//		delay_sum = 50*blocks.length;
			delay_sum = duration*0.5;
		$.each(blocks, function(index, val) {
			var block = $(val) ,lefty;
			lefty = "-"+block.css('left');
			block.css({ display : 'block',
				        top     :  value,
				        backgroundPosition : lefty+" "+(-value)+"px"  });
			tmp = Math.sin(index*to_radians);
			setTimeout(function(){
				block.animate({ top : 0, opacity: 1, backgroundPosition : lefty+" 0px"  }, duration*0.750, animation_finished);
			}, delay_sum-(delay_sum * tmp));
		});

	}, // fountain

	//
	// LightBeam
	//
	lightBeam : function(slider, slideIndex, direction) {
		slider = $(slider);
		var blocks;
		blocks = getBlocks(slider, 1, 1, {
			background : 'url('+getSlideUrl(slider, slideIndex)+') no-repeat',
			display: 'block'
		});
		slider.data('jdslider:blocks', blocks);
		slider.data('jdslider:showing', slideIndex);
		slider.attr('jdslider:lightbeam', 0);
		slider.animate({ 'jdslider:lightbeam': 1 }, getOptions(slider).transitionDuration, 'linear');
	}, // lightBeam



	//
	// Random Blocks
	//
	randomBlocks : function(slider, slideIndex, acols, arows) {
		var blocks, cols = acols || 8, rows = arows || 4, number_of_blocks = cols*rows;
		
		blocks = getBlocks(slider, cols, rows, {
			backgroundImage : 'url('+getSlideUrl(slider, slideIndex)+')',
			opacity : 0,
			display : 'block'
		});
	
		var finished = 0;
		function animation_finished(){ 
			finished++;
			if (finished==number_of_blocks) slideShowed(slider, slideIndex); 
		}

		blocks = blocks.toArray();
		// shuffle array
		var i=blocks.length*2, tmp, r1, r2;
		while(i--) {
			r1 = random(number_of_blocks);
			r2 = random(number_of_blocks);
			tmp = blocks[r1]; blocks[r1]=blocks[r2]; blocks[r2]=tmp;
		}

		var duration = getOptions(slider).transitionDuration;
		$.each(blocks, function(index, val){
			var block = $(val);
			setTimeout(function(){
				block.animate({ opacity: 1 }, duration*0.4, animation_finished);
			//}, Math.random()*1000 );
			}, (index*duration/blocks.length*0.8));
		});

	}, // random_blocks

	//
	// Random Slices Vertical 
	//
	randomSlicesVertical :function(slider, slideIndex, options) {
		$.jdSlider.transitions.randomBlocks(slider, slideIndex, 10, 1);
	}, // random_slices_vertical

	//
	// Random Slices Horizontal 
	//
	randomSlicesHorizontal :function(slider, slideIndex, options) {
		$.jdSlider.transitions.randomBlocks(slider, slideIndex, 1, 5);
	}, // random_slices_horizontal
	

	//
	// Shrink
	//
	shrink : function(slider, slideIndex, direction) {
		var current_slide = slider.data('jdslider:current-slide'),
			width  = slider.width(), 
			height = slider.height();
		var block=$('.jdslider_img', slider).first();
		if (block.length==0) block=$('<img class="jdslider_img"/>').appendTo(slider);
		block.attr('src', getSlideUrl(slider, current_slide) );
		block.css({
			display    : 'block',
			width      : width,
			height     : height,
			left       : 0,
			top        : 0,
			opacity    : 1,
			position   : 'absolute'
		});
		slider.css('background','url('+ getSlideUrl(slider, slideIndex) +') no-repeat');

		var slides = slider.data('jdslider:slides');
		slides[slider.data('jdslider:current-slide')].elem.hide();

		block.animate({ 
			width   : 0,
			left    : width/2+"px",
			height  : 0,
			top     : height/2+"px",
			opacity : 1
		}, getOptions(slider).transitionDuration, "easeInBack", function(){ slideShowed(slider, slideIndex); });
	}, // shrink


	//
	// Slice Fade
	//
	sliceFade : function(slider, slideIndex, direction) {
		var blocks;
		var number_of_slices = 10;
	
		var DIRECTIONS = ['l', 'r', 't', 'b']
		if (!direction) direction = DIRECTIONS[ random(4) ];
		//console.log(direction)	
		var cols = isVertical(direction) ? 1 : number_of_slices;
		var rows = isVertical(direction) ? number_of_slices : 1;
		blocks = getBlocks(slider, cols, rows, {
			backgroundImage : 'url('+getSlideUrl(slider, slideIndex)+')',
			display : 'block',
			opacity : 0
		});

		var finished = 0;
		function animation_finished(){ 
			finished++;
			if (finished==number_of_slices) slideShowed(slider, slideIndex); 
		}
	
		if (direction=='r' || direction=='b') blocks = blocks.toArray().reverse();
		var duration = getOptions(slider).transitionDuration; 
		$.each(blocks, function(index, val){
			var block = $(val);
			setTimeout(function(){
				block.animate({ opacity: 1 }, duration*0.5, "linear", animation_finished);
		//	}, (50 + index*75));
			}, (index*duration/blocks.length*0.9));
		});

	}, // sliceFade


	//
	// Slice Slide
	//
	sliceSlideVertical : function(slider, slideIndex, direction) {
		var blocks;
		var number_of_slices = 10;
	
		var DIRECTIONS = ['l', 'r', 't', 'b']
		if (!direction) direction = DIRECTIONS[ random(4) ];
		//console.log(direction)	
		var cols = isVertical(direction) ? 1 : number_of_slices;
		var rows = isVertical(direction) ? number_of_slices : 1;
		cols = 10; rows = 1;
		blocks = getBlocks(slider, cols, rows, {
			backgroundImage : 'url('+getSlideUrl(slider, slideIndex)+')',
			opacity : 0
		});

		var finished = 0;
		function animation_finished(){ 
			finished++;
			if (finished==number_of_slices) slideShowed(slider, slideIndex); 
		}
	
		var property = (direction=='l' || direction=='r') ? 'width' : 'height' ;
		if (direction=='r' || direction=='b') blocks = blocks.toArray().reverse();
		var value = (direction=='l' || direction=='r') ? -slider.height() : slider.height();
		var duration = getOptions(slider).transitionDuration; 
		$.each(blocks, function(index, val){
			var block = $(val);
			block.css('display', 'block')
				 .css('top', value);
		//	     .css(property, 0);
			setTimeout(function(){
				block.animate({ top : 0, opacity: 1 }, duration*0.5, animation_finished);
		//	}, (50 + index*75));
			}, (index*duration/blocks.length*0.75));
		});

	}, // slice_slide_vertical

	sliceSlideHorizontal : function(slider, slideIndex, direction) {
		var blocks;
		var number_of_slices = 10;
	
		var DIRECTIONS = ['l', 'r', 't', 'b']
		if (!direction) direction = DIRECTIONS[ random(4) ];
		//console.log(direction)	
		var cols = isVertical(direction) ? 1 : number_of_slices;
		var rows = isVertical(direction) ? number_of_slices : 1;
		cols = 10; rows = 1;
		cols = 1; rows = 10;
		blocks = getBlocks(slider, cols, rows, {
			backgroundImage : 'url('+getSlideUrl(slider, slideIndex)+')',
			opacity : 0
		});

		var finished = 0;
		function animation_finished(){ 
			finished++;
			if (finished==number_of_slices) slideShowed(slider, slideIndex); 
		}
	
		var property = (direction=='l' || direction=='r') ? 'width' : 'height' ;
		if (direction=='r' || direction=='b') blocks = blocks.toArray().reverse();
		var value = (direction=='l' || direction=='r') ? -slider.height() : slider.height();
		var value = (direction=='l' || direction=='r') ? -slider.width() : slider.width();
		var duration = getOptions(slider).transitionDuration; 
		$.each(blocks, function(index, val) {
			var block = $(val);
			block.css('display', 'block')
				 .css('left', value);
		//	     .css(property, 0);
			setTimeout(function(){
				block.animate({ left : 0, opacity: 1 }, duration*0.5, animation_finished);
			//}, (index*75));
			}, (index*duration/blocks.length*0.75));
		});

	}, // slice_slide_horizontal


	//
	// Slide
	//
	slide : function(slider, slideIndex, direction) {
		DIRECTIONS = ['l', 'r', 't', 'b'];
		if (!direction) direction = DIRECTIONS[ random(4) ];

		var slides = slider.data('jdslider:slides'),
			current_slide = slides[slider.data('jdslider:current-slide')].elem,
			_left=0, _top=0;

		var block = getBlocks(slider, 1, 1, {
			backgroundImage : 'url('+getSlideUrl(slider, slideIndex)+')',
			display    : 'block'
		});

		if (direction=='l') _left =  slider.width();
		if (direction=='r') _left = -slider.width();
		if (direction=='t') _top  =  slider.height();
		if (direction=='b') _top  = -slider.height();
		block.css({ left: -_left, top: -_top })
			 .animate({ left: 0, top: 0 }, getOptions(slider).transitionDuration, function(){ slideShowed(slider, slideIndex) });
		current_slide.animate({ left: _left, top: _top }, getOptions(slider).transitionDuration );
	}, // slide


	//
	// SlideOver
	//
	slideOver : function(slider, slideIndex, direction) {
		DIRECTIONS = ['l', 'r'];
		if (!direction) direction = DIRECTIONS[ random(2) ];
		var block = getBlocks(slider, 1, 1, {
			backgroundImage : 'url('+getSlideUrl(slider, slideIndex)+')',
			display    : 'block'
		});

		if (direction=='l') block.css('left', -slider.width() );
		if (direction=='r') block.css('left',  slider.width() );
		//if (direction=='t') block.css('top',  -slider.height() );
		//if (direction=='b') block.css('top',  slider.height() );
	
		block.animate({ left: 0, top: 0 }, getOptions(slider).transitionDuration, function(){ slideShowed(slider, slideIndex) });
	}, // slideOver



	//
	// Strech_out
	//
	stretchOut : function(slider, slideIndex, direction) {
		var current_slide = slider.data('jdslider:current-slide'),
			width  = slider.width(), 
			height = slider.height();
		var block=$('.jdslider_img', slider).first();
		if (block.length==0) block=$('<img class="jdslider_img"/>').appendTo(slider);
		block.attr('src', getSlideUrl(slider, current_slide) );
		block.css({
			display    : 'block',
			width      : width,
			height     : height,
			left       : 0,
			top        : 0,
			opacity    : 1,
			position   : 'absolute'
		});
		slider.css('background','url('+ getSlideUrl(slider, slideIndex) +') no-repeat');

		var slides = slider.data('jdslider:slides');
		slides[slider.data('jdslider:current-slide')].elem.hide();

		block.animate({ 
			width   : "+="+width*2,
			left    : "-"+width+"px",
			height  : "+="+height/2,
			top     : "-"+height/4+"px",
			opacity : 0
		}, getOptions(slider).transitionDuration, function(){ slideShowed(slider, slideIndex); });
	}, // stretch_out

	//
	// Wipe
	//
	wipe : function (slider, slideIndex, direction) {
		slider = $(slider);
		var blocks, number_of_slices = 20;
		blocks = getLayers(slider, slideIndex, number_of_slices);
		slider.data('jdslider:blocks', blocks);
		slider.data('jdslider:showing', slideIndex);
		slider.attr('jdslider:wipe', 0);
		slider.animate({ 'jdslider:wipe': 1 }, 1000, 'linear');
	}, // wipe
	
	//
	// Zipper
	//
	zipper : function(slider, slideIndex, direction) {
		var blocks, number_of_slices = 10;
	
		var DIRECTIONS = ['l', 'r', 't', 'b']
		if (!direction) direction = DIRECTIONS[ random(4) ];

		var cols = isVertical(direction) ? 1 : number_of_slices;
		var rows = isVertical(direction) ? number_of_slices : 1;
	
		blocks = getBlocks(slider, cols, rows, {
			backgroundImage : 'url('+getSlideUrl(slider, slideIndex)+')'
		});
	
		var finished = 0;
		function animation_finished(){ 
			finished++;
			if (finished==number_of_slices) slideShowed(slider, slideIndex); 
		}
	
		if (direction=='r' || direction=='b') blocks = blocks.toArray().reverse();
		var value    = isVertical(direction) ? slider.width() : slider.height();
		var property = isVertical(direction) ? 'left' : 'top';
		var animated_prop = {};
		animated_prop[property] = 0;
		var duration = getOptions(slider).transitionDuration;
		$.each(blocks, function(index, val){
			var block = $(val);
			block.css('display', 'block')
				 .css(property, value);
			value = -value;
			setTimeout(function(){
				block.animate(animated_prop, duration*0.75, animation_finished);
			//}, (100 + index*100));
			}, (index*duration/blocks.length));
		});

	} // zipper

}; // transitions



//
// Clock
//
$.fx.step['jdslider:clock'] = function slider_clock(fx) {
	var slider = $(fx.elem);
	var blocks = slider.data('jdslider:blocks');

	if (fx.state == 0 ) { // Initialisation
		fx.start = 0.0; fx.end   = 1.0;
		fx.half_width    = Math.round( slider.width()/2 );
		fx.half_height   = Math.round( slider.height()/2 );
		fx.clock_blocks  = $('.jdslider_clock', slider);
		if (fx.clock_blocks.length==0) {
			for(i=0;i<4;i++) $('<div class="jdslider_clock" style="display:none"></div>').appendTo(slider);
			fx.clock_blocks  = $('.jdslider_clock', slider);
		}
		fx.clock_blocks.css({ 
			background : blocks.css('background'),
			display:'none', width: fx.half_width, height: fx.half_height+1, position:'absolute' 
		});
		$(fx.clock_blocks[0]).css({ left: fx.half_width+'px', top: 0                   });
		$(fx.clock_blocks[1]).css({ left: fx.half_width+'px', top: fx.half_height+'px' });
		$(fx.clock_blocks[2]).css({ left: 0,                  top: fx.half_height+'px' });
		$(fx.clock_blocks[3]).css({ left: 0,                  top: 0                   });
		$(fx.clock_blocks[0]).css('background-position', -fx.half_width+'px 0px');
		$(fx.clock_blocks[1]).css('background-position', -fx.half_width+'px -'+fx.half_height+'px');
		$(fx.clock_blocks[2]).css('background-position', '0px -'+fx.half_height+'px');
		$(fx.clock_blocks[3]).css('background-position', '0px 0px');

		fx.increment  = fx.half_height / blocks.length;
	}

	//fx.pos = 0.2
	var angle = 2*Math.PI * fx.pos;
	var tg = Math.tan(angle);
	var rect;
	var height = fx.half_height*2;
	fx.clock_blocks.css('display', 'none');
	var top, left, bottom, right;
	
	// pos < 0.25
	if (fx.pos < 0.25) {
		left   = fx.half_width;
		top    = 0;
		bottom = 0;
		for (var i = 0; i < blocks.length; i++) {
			top = Math.round((i+1)*fx.increment);
			right = left+Math.round(tg * top);
			rect = 'rect('+ (fx.half_height-top) +'px '+ right+'px '+(fx.half_height-bottom)+'px '+ left+'px)';
			blocks[i].style.clip = rect;
			bottom = top;
		}
	
	} else if (fx.pos < 0.75) { 	
	// 0.25 <= pos < 0.75 (metade inferior)
		$(fx.clock_blocks[0]).css('display', 'block');
		if (fx.pos==0.25) return;
		if (fx.pos>=0.5) $(fx.clock_blocks[1]).css('display', 'block');
		if (fx.pos==0.5) return;
		
		right  = fx.half_width*2;
		top    = 0;
		bottom = top;
		for (var i = 0; i < blocks.length; i++) {
			top  = -Math.round((i+1)*fx.increment);
			left = fx.half_width+Math.round(tg * top);
			rect = 'rect('+ (fx.half_height-bottom) +'px '+ right+'px '+(fx.half_height-top)+'px '+ left+'px)';
			blocks[i].style.clip = rect;
			bottom = top;
		}
	
 	} else if (fx.pos < 1) { 
 	// 0.75 <= pos < 1
		$(fx.clock_blocks[0]).css('display', 'block');
		$(fx.clock_blocks[1]).css('display', 'block');
		$(fx.clock_blocks[2]).css('display', 'block');
		if (fx.pos==0.75) return;
		left   = 0;
		top    = 0;
		bottom = 0;
		for (var i = 0; i < blocks.length; i++) {
			top   = Math.round((i+1)*fx.increment);
			right = fx.half_width+Math.round(tg * top);
			rect = 'rect('+ (fx.half_height-top) +'px '+ right+'px '+(fx.half_height-bottom)+'px '+ left+'px)';
			blocks[i].style.clip = rect;
			bottom = top;
		}
 	
 	} else if (fx.pos==1) { 
		fx.clock_blocks.css('display', 'block');
	}
	
	if (fx.state == 1) { 
		slideShowed(slider, slider.data('jdslider:showing') );
		fx.clock_blocks.css('display', 'none');
	}
}; // clock

//
// Circle
//
$.fx.step['jdslider:circle'] = function slider_clock(fx) {
	var slider = $(fx.elem);
	var blocks = slider.data('jdslider:blocks');

	if (fx.state == 0 ) { // Initialisation
		fx.start = 0.0; fx.end   = 1.0;
		fx.half_width    = Math.round( slider.width()/2 );
		fx.half_height   = Math.round( slider.height()/2 );
		fx.max_radius    = Math.sqrt( fx.half_width*fx.half_width+fx.half_height*fx.half_height );
		fx.increment     = fx.half_height / blocks.length;
	}

	var radius  = fx.max_radius * fx.pos,
		radius2 = radius*radius,
	    rect,
	    top, left, bottom, right;
	for (var i = 0; i < blocks.length; i++) { 
		top    = Math.round((i+1)*fx.increment);
		left   = Math.sqrt( radius2-top*top );
		if (isNaN(left)) break;
		right  = fx.half_width+left;
		left   = fx.half_width-left;
		rect = 'rect('+ (fx.half_height-top) +'px '+ right+'px '+(fx.half_height+top)+'px '+ left+'px)';
		blocks[i].style.clip = rect;
	}
	
	if (fx.state == 1) { slideShowed(slider, slider.data('jdslider:showing') );	}
}; // circle


//
// Diamond
//
$.fx.step['jdslider:diamond'] = function(fx) {
	var slider = $(fx.elem);
	var blocks = slider.data('jdslider:blocks');

	if (fx.state == 0 ) { // Initialisation
		fx.start = 0.0;
		fx.end   = 1.0;
		fx.half_width    = slider.width()/2;
		fx.half_height   = slider.height()/2;
		fx.max_dimension = fx.half_height+fx.half_width;
		fx.increment     = fx.half_height / blocks.length;
		
		var top = fx.half_height, bottom = top;
		$.each(blocks, function(index, block){
			block.rect_top    = top+'px ';
			block.rect_bottom = bottom+'px ';
			top -= fx.increment; bottom += fx.increment;
		});
		blocks[blocks.length-1].rect_top    = '0px ';
		blocks[blocks.length-1].rect_bottom = slider.height()+'px ';
	}
	var inc   = fx.increment, 
	    x     = fx.max_dimension * fx.pos,
	    left  = fx.half_width - x,
	    right = fx.half_width + x;
	for (var i = 0; i < blocks.length; i++) {
		blocks[i].style.clip = 'rect('+blocks[i].rect_top+ right+'px '+ blocks[i].rect_bottom+ left+'px)';
		left += inc; right -= inc;
	}

	if (fx.state == 1) { slideShowed(slider, slider.data('jdslider:showing') );	}
}; // diamond

//
// Exit_stage left, right
//
function exit_stage(fx, direction) {
	var slider = $(fx.elem);
	var blocks = slider.data('jdslider:blocks');

	if (fx.state == 0) { // Initialisation
		fx.start = 0.0; fx.end   = 1.0;
		fx.skew      = 50;
		fx.width     = slider.width();
		blocks.css('display','block');
		if (direction=='right') blocks.css('left', '');
	}
	var prop      = (fx.width+fx.skew)*fx.pos,
		increment = Math.min(prop, fx.skew)/blocks.length;

	for (var i = 0; i < blocks.length; i++) {
		$(blocks[i]).css(direction, prop+'px');
		prop -= increment;
	}
	
	if (fx.state == 1) { 
		slideShowed(slider, slider.data('jdslider:showing') );
	}
} // exit stage

$.fx.step['jdslider:exit_stage_left'] = function(fx) {
	exit_stage(fx, 'left');
}; // exit_stage_left

$.fx.step['jdslider:exit_stage_right'] = function(fx) {
	exit_stage(fx, 'right');
}; // exit_stage_right



//
// LightBeam
//
$.fx.step['jdslider:lightbeam'] = function(fx) {
	var slider = $(fx.elem);
	var blocks = slider.data('jdslider:blocks');

	var light_left   = $('.jdslider_light_left', slider).first();
		light_right  = $('.jdslider_light_right', slider).first();
		light        = $('.jdslider_light', slider).first();

	if (fx.state == 0 ) { // Initialisation
		fx.start = 0.0;
		fx.end   = 1.0;
		fx.slider_width   = slider.width();
		fx.slider_height  = slider.height();
		slider.css('overflow', 'visible');

		if (light_left.length==0) {
			light_left=$('<img class="jdslider_light_left" src="'+scriptPath()+'"light_left.png"/>').appendTo(slider);
			light_left.load(function(){ 
				$(this).css('width', '');
				this.original_width = $(this).width();
			}).attr('src', scriptPath()+'light_left.png');
			fx.original_light_width  = light_left.width();
		}
		if (light_right.length==0) {
			light_right=$('<img class="jdslider_light_right" src="'+scriptPath()+'light_right.png"/>').appendTo(slider);
			light_right.load(function(){ this.original_width = $(this).width();}).attr('src', scriptPath()+'light_right.png');

		}
		if (light.length==0) {
			light=$('<img class="jdslider_light" src="'+scriptPath()+'light_v.png"/>').appendTo(slider);	
			light.load(function(){ 
				$(this).css('width', '');
				this.original_width = $(this).width();
				fx.light_width = $(this).width();
			}).attr('src', scriptPath()+'light_v.png');
			light.css({ 
				position : 'absolute', 
				width    : light.width(),
				top      : '-13px', 
				height   : 26+slider.height(),
				display  : 'block'
			});
		}
		fx.light_width = light.width();
		
		light_left.css({ 
			position : 'absolute', 
			right    : -10+slider.width(),
			width    : fx.original_light_width,
			top      : '-60px', 
			height   : 120+slider.height()
		});

		light_right.css({ 
			position : 'absolute', 
			width    : 10,
			top      : '-60px', 
			height   : 120+slider.height(),
			display  : 'none'
		});
		light.css({ 
			position : 'absolute', 
			left     : -light.width()/2,
			width    : light.width(),
			top      : '-13px', 
			height   : 26+slider.height(),
			display  : 'block'
		});

	}

	var _left, _right, _width;
	fx.original_light_width = light_left.attr('original_width') || LIGHTBEAM_GLOW_WIDTH;

	light.css('left', fx.slider_width*fx.pos-fx.light_width/2 );
	blocks.css('width', fx.slider_width*fx.pos );
	
	if (fx.pos<=0.5) {
		light_right.css('display', 'none');
		_width = fx.original_light_width-(fx.original_light_width-10)*fx.pos*2;
		_right = (-10+fx.slider_width);
		_right = _right - (_right-fx.slider_width/2)*fx.pos*2;
		light_left.css({
			right   : _right,
			width   : _width,
			display : 'block'
		});
	} else {
		light_left.css('display', 'none');
		fx.pos = (fx.pos-0.5)*2;
		_width = 10-(10-fx.original_light_width)*fx.pos;
		_left  = fx.slider_width/2;
		_left  = _left - (_left -(fx.slider_width-10) )*fx.pos;
		light_right.css({
			left    : _left+'px',
			width   : _width,
			display : 'block'
		});
	}

	if (fx.state == 1) {
		light_left.css('display', 'none');
		light_right.css('display', 'none');
		light.css('display', 'none');
		//  BUGFIX to Chrome and Safari
		// without the timeout, changing de overflow to hidden left some "trace" of the lightbeam image
		setTimeout(function(){ slider.css('overflow', 'hidden'); }, 10);
		slideShowed(slider, slider.data('jdslider:showing') );	
	}
}; // lightbeam


//
// Wipe
//
$.fx.step['jdslider:wipe'] = function(fx) {
	var slider = $(fx.elem),
	    blocks = slider.data('jdslider:blocks');

	if (fx.state == 0 ) { // Initialisation
		fx.start = 0.0;
		fx.end   = 1.0;
		fx.gradient_width = 10;
		fx.slider_width   = slider.width();
		fx.slider_height  = slider.height();
		$.each(blocks, function(index, block){
			$(block).css('opacity', 1-(index/blocks.length) );
		});
	}

	var top    = 0, 
	    bottom = fx.slider_height+"px ",
	    left   = -fx.gradient_width + (fx.gradient_width+fx.slider_width)* fx.pos;
	var right = left+1;
	blocks[0].style.clip = 'rect(0px '+(left+1)+'px '+bottom+'0px)';
	left++;
	for (var i = 1; i < blocks.length; i++) {
		// IE7< nao aceita virgula no clip
		blocks[i].style.clip = 'rect(0px '+ (left+1)+'px '+bottom+ left+'px)';
		left += 1;
	}

	if (fx.state == 1) { slideShowed(slider, slider.data('jdslider:showing') );	}
}; // wipe


// *********************
//
// Utilities
//
// *********************

function random(number) {
	return Math.floor(Math.random()*number);
} // random

function getOptions(slider) {
	return slider.data('jdSlider:options');
} // getOptions

function isVertical(direction) {
	return (direction=='t' || direction=='b');
} // isVertical

function getSlideUrl(slider, slideIndex) {
	var slides = slider.data('jdslider:slides');
	return $(slides[slideIndex].image).attr('src');
} // getSlideUrl

// retorna N "layers", divs que serao usados em transitions 
// que usam clip como diamon, clock e circle
function getLayers(slider, slideIndex, number_of_layers) {
	return getBlocks(slider, 1, number_of_layers, {
		background : 'url('+getSlideUrl(slider, slideIndex)+') no-repeat',
		left : 0, width: slider.width(),
		top  : 0, height: slider.height(), 
		clip: 'rect(0 0 0 0)', 
		display: 'block'
	});
} // getLayers


function getBlocks(slider, cols, rows, css) {
	if (!cols) cols = 1;
	if (!rows) rows = 1;
	if (!css) css = {};
	
	var number_of_blocks = rows*cols,
		block_width      = Math.floor(slider.width() / cols),
	    block_height     = slider.height() / rows,
	    blocks=$('.jdslider_block', slider).slice(0, number_of_blocks);
	var slider_width = slider.width(), slider_height = slider.height();

	// create blocks
	if (blocks.length<number_of_blocks) {
		for(var i=0; i<=(number_of_blocks-blocks.length); i++) {
			$('<div class="jdslider_block"></div>')
			      .css({ left:'10px', width: '10px', position:'absolute', backgroundRepeat : 'no-repeat' }) 
			      .appendTo(slider);
		}
	    blocks=$('.jdslider_block', slider).slice(0, number_of_blocks);
	}

	var heights = [], tops=[], t=0, h=0;
	for(y=0; y<rows; y++) {
		tops.push(Math.floor(t));
		t += block_height;
		if (y==rows-1) t=slider_height;
		heights.push( Math.floor( t-tops[y] ) );
	}	
	var i=0, w, h=block_height, left, top;
			
	w = block_width;
	for(x=0; x<cols;x++) { 
		if (x==cols-1) w=slider.width()-block_width*x;
		for(y=0; y<rows; y++) {

			left = block_width*x;
			top = tops[y]; // block_height*y;
			blocks[i].slider_x = x;
			blocks[i].slider_y = y;
			$(blocks[i]).css({
				width      : w, //block_width,
				height     : heights[y], // hblock_height,
				top        : top,
				left       : left,
				display    : 'none',
				opacity    : 1,
				backgroundPosition : "-"+left+"px -"+top+"px",
				clip      : 'rect(0px '+slider_width+'px '+slider.height()+'px 0px)'
			});
			i++;
		}
	}
	blocks.css(css);
	return blocks;
} // getBlocks

function scriptPath(){
	if (!SCRIPT_PATH) {
		var SCRIPT_NAME = "jawdropper_slider.js",
		    SCRIPT_NAME_2 = "jawdropper_slider.min.js";
		var src=$("script[src$="+SCRIPT_NAME+"]").attr("src");
		if (src) src = src.substring(0,src.lastIndexOf(SCRIPT_NAME))
		else {
			src=$("script[src$="+SCRIPT_NAME_2+"]").attr("src");		
			if (src) src = src.substring(0,src.lastIndexOf(SCRIPT_NAME_2));
		}
		SCRIPT_PATH = src || "";
	}
	return SCRIPT_PATH;
} // scriptPath

})(jQuery);

/* replace plugin_name with you plugin name */
/**
 * @author Alexander Farkas
 * v. 1.21
 */
 
(function($) {
	if(!document.defaultView || !document.defaultView.getComputedStyle){ // IE6-IE8
		var oldCurCSS = jQuery.curCSS;
		jQuery.curCSS = function(elem, name, force){
			if(name === 'background-position'){
				name = 'backgroundPosition';
			}
			if(name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[ name ]){
				return oldCurCSS.apply(this, arguments);
			}
			var style = elem.style;
			if ( !force && style && style[ name ] ){
				return style[ name ];
			}
			return oldCurCSS(elem, 'backgroundPositionX', force) +' '+ oldCurCSS(elem, 'backgroundPositionY', force);
		};
	}

	var oldAnim = $.fn.animate;
	$.fn.animate = function(prop){
		if('background-position' in prop){
			prop.backgroundPosition = prop['background-position'];
			delete prop['background-position'];
		}
		if('backgroundPosition' in prop){
			prop.backgroundPosition = '('+ prop.backgroundPosition;
		}
		return oldAnim.apply(this, arguments);
	};
	
	function toArray(strg){
		strg = strg.replace(/left|top/g,'0px');
		strg = strg.replace(/right|bottom/g,'100%');
		strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
		var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
		return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
	}
	
	$.fx.step.backgroundPosition = function(fx) {
		if (!fx.bgPosReady) {
			var start = $.curCSS(fx.elem,'backgroundPosition');
			
			if(!start){//FF2 no inline-style fallback
				start = '0px 0px';
			}
			
			start = toArray(start);
			
			fx.start = [start[0],start[2]];
			
			var end = toArray(fx.options.curAnim.backgroundPosition);
			fx.end = [end[0],end[2]];
			
			fx.unit = [end[1],end[3]];
			fx.bgPosReady = true;
		}
		//return;
		var nowPosX = [];
		nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
		nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];           
		fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];

	};
})(jQuery);


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */


/*!
 * jQuery Lightbox Evolution - for jQuery 1.3+
 * http://codecanyon.net/item/jquery-lightbox-evolution/115655?ref=aeroalquimia
 *
 * Copyright (c) 2010, Eduardo Daniel Sada
 * Released under CodeCanyon Regular License.
 * http://codecanyon.net/wiki/buying/howto-buying/licensing/
 *
 * Version: 1.5.5 (Oct 14 2011)
 *
 * Includes jQuery Easing v1.3
 * http://gsgd.co.uk/sandbox/jquery/easing/
 * Copyright (c) 2008, George McGinley Smith
 * Released under BSD License.
 */

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(F($){H q=($.1H.2A&&1I($.1H.2B,10)<7&&1I($.1H.2B,10)>4);H r=(1w.3I.2C().1x(\'4P\')!=-1);H u=(1w.3I.2C().1x(\'4Q\')!=-1);B($.L===1W){$.1r({L:F(a,b){B(a){L=F(){S a.3J(b||8,4R)}};S L}})};$.1r($.2D.4S,{4T:F(){B(8.C.2E){8.C.2E.3K(8.4U,8.4V,8)}(2b.2D.2E[8.4W]||2b.2D.2E.4X)(8)}});$.1r($.2Z,{2c:F(x,t,b,c,d,s){B(s==1W)s=1.4Y;S c*((t=t/d-1)*t*((s+1)*t+s)+1)+b}});$.1r({2p:{3L:{G:\'31-U\',1k:4Z,D:51,E:52,Y:\'#53\',2G:R,1l:{\'1J\':0.6},2H:3M,2I:54,55:3N,56:3N,57:\'2c\',58:\'2c\',59:\'2c\',5a:\'2c\',2d:{\'3O\':10,\'32\':2e,\'1K\':\'2c\',\'3P\':2},1L:{\'D\':3Q,\'E\':3R},1f:{\'D\':3Q,\'E\':3R},3S:\'1h\'},C:{},1X:{},12:{},1g:{},A:{U:[],I:{1m:[],1Y:[],1c:[],1Z:[]},Y:[],Z:[]},1d:R,1y:R,1M:\'1g\',3T:{1N:{16:/[^\\.]\\.(1N)\\s*$/i},33:{16:/33\\.N\\/3U/i,Q:\'=\',15:1,1i:1,17:"1b://1u.33.N/2f/%V%?1z=1&O;5b=1&O;2q=0&O;5c=1&O;5d=1"},34:{16:/34\\.N\\/3U/i,Q:\'/\',15:4,17:"1b://1u.34.N/5e/%V%/.1N?5f=5g=5h"},35:{16:/35\\.N\\/1A/i,Q:\'/\',15:4,17:"1b://1u.35.N/1N/1A/%V%?5i=0&O;5j=1"},1v:{16:/1v\\.N\\/5k/i,Q:\'=\',15:1,17:"1b://1A.1v.N/5l.1N?1z=1&O;5m=5n&O;5o=%V%"},36:{16:/36\\.N/i,Q:\'/\',15:3,1i:1,17:"1b://38.36.N/1A/%V%?5p=1&O;1z=1&O;5q=1&O;5r=1&O;5s=0&O;5t=&O;3a=1"},3b:{16:/3b.N/i,Q:\'=\',15:1,17:"1b://1u.3b.N/v/%V%"},3c:{16:/3c.N/i,Q:\'/\',15:5,17:"1b://1u.3c.N/5u.5v?5w=%V%"},5x:{16:/2r.N\\/1A\\//i,Q:\'1A/\',15:1,17:"1b://1u.2r.N/2J/2J.5y.1N?2K=K&O;3a=1&O;5z=K&O;3V=%V%"},2r:{16:/2r.N\\/1A:/i,Q:\'1A:\',15:1,17:"1b://1u.2r.N/2J/2J.1N?1z=K&O;3a=1&O;3V=%V%"},3d:{16:/3d.3W/i,Q:\'/\',15:4,17:"1b://1u.3d.3W/1L/1A/%V%?5A=%2F&O;1z=K&O;5B=%V%&O;5C=K&O;5D=0.5E&O;5F=0.5G&O;5H=5I"},3e:{16:/3e.N/i,Q:\'/\',15:3,17:"1b://1u.3e.N/38/%V%"},3X:{16:/v.3X.N/i,Q:\'/\',15:3,17:"1b://5J.5K.N/38.1N?5L=%V%&O;v=1.5M"},3f:{16:/3f.N\\/5N/i,Q:\'/\',15:4,17:"1b://5O.3f.N/%V%.5P?1z=K&O;1O=1P"}},3Y:{3g:{16:/3g.N\\/1f/i,Q:\'?\',15:1,17:"1b://1u.3g.N/1f/2f/?5Q=5R-5S-5T-5U-5V&O;w=%D%&O;h=%E%&O;%V%"},5W:{16:/1f.1v.N(.*)5X=c/i,Q:\'?\',15:1,17:"1b://1f.1v.N/?3h=5Y&O;%V%"},5Z:{16:/1f.1v.N\\/1f\\3Z/i,Q:\'?\',15:1,17:"1b://1f.1v.N/1f/3Z?3h=2f&O;%V%"},1v:{16:/1f.1v.N/i,Q:\'?\',15:1,17:"1b://1f.1v.N/1f?%V%&O;3h=2f"}},41:/\\.(60|61|62|63|64|65)(.*)?$/i,1l:{2L:F(b){8.C=b;8.W=$(\'<J V="\'+2s 3i().3j()+\'" X="\'+8.C.G+\'-1l"></J>\');8.W.P($.1r({},{\'1Q\':\'66\',\'1h\':0,\'18\':0,\'1J\':0,\'1B\':\'1P\',\'z-15\':8.C.1k},8.C.1C));8.W.1s($.L(F(a){B(8.C.2M){B($.21(8.C.1R)){8.C.1R()}M{8.1n()}}a.22()},8));8.23=K;8.42();S 8},42:F(){8.2N=$(2O.3k);8.2N.2g(8.W);B(q){8.W.P({\'1Q\':\'2P\'});H a=1I(8.W.P(\'1k\'));B(!a){a=1;H b=8.W.P(\'1Q\');B(b==\'67\'||!b){8.W.P({\'1Q\':\'68\'})}8.W.P({\'1k\':a})}a=(!!(8.C.1k||8.C.1k===0)&&a>8.C.1k)?8.C.1k:a-1;B(a<0){a=1}8.1o=$(\'<1i V="43\'+2s 3i().3j()+\'" 69="6a" 44=0 24=""></1i>\');8.1o.P({1k:a,1Q:\'2P\',1h:0,18:0,1O:\'1P\',D:0,E:0,1J:0});8.1o.6b(8.W);$(\'Z, 3k\').P({\'E\':\'2e%\',\'D\':\'2e%\',\'2t-18\':0,\'2t-2h\':0})}},19:F(x,y){8.W.P({\'E\':0,\'D\':0});B(8.1o){8.1o.P({\'E\':0,\'D\':0})};H a={x:$(2O).D(),y:$(2O).E()};8.W.P({\'D\':\'2e%\',\'E\':y?y:a.y});B(8.1o){8.1o.P({\'E\':0,\'D\':0});8.1o.P({\'1Q\':\'2P\',\'18\':0,\'1h\':0,\'D\':8.W.D(),\'E\':y?y:a.y})}S 8},11:F(a){B(!8.23){S 8};B(8.1K){8.1K.25()};B(8.1o){8.1o.P({\'1B\':\'3l\'})};8.W.P({\'1B\':\'3l\',\'1J\':0});8.2N.1j(\'19\',$.L(8.19,8));8.19();8.23=R;8.1K=8.W.45(8.C.2H,8.C.1C.1J,$.L(F(){B(8.C.1C.1J){8.W.P(8.C.1C)};8.W.2Q(\'11\');B($.21(a)){a()}},8));S 8},1n:F(a){B(8.23){S 8};B(8.1K){8.1K.25()};B(8.1o){8.1o.P({\'1B\':\'1P\'})};8.2N.2i(\'19\');8.23=K;8.1K=8.W.45(8.C.2I,0,$.L(F(){8.W.2Q(\'1n\');B($.21(a)){a()};8.W.P({\'E\':0,\'D\':0,\'1B\':\'1P\'})},8));S 8}},2L:F(a){8.C=$.1r(K,8.3L,a);8.1l.2L({G:8.C.G,1C:8.C.1l,2M:!8.C.2G,1k:8.C.1k-1,1R:$.L(8.1m,8),2H:(u||r?2:8.C.2H),2I:(u||r?2:8.C.2I)});8.A.U=$(\'<J X="\'+8.C.G+\' \'+8.C.G+\'-1M-1g"><J X="\'+8.C.G+\'-1O-1h-18"></J><J X="\'+8.C.G+\'-1O-1h-46"></J><J X="\'+8.C.G+\'-1O-1h-2h"></J><a X="\'+8.C.G+\'-1e-1m" 1D="#1m"><1p>6c</1p></a><J X="\'+8.C.G+\'-1w"><a X="\'+8.C.G+\'-1e-18" 1D="#"><1p>47</1p></a><a X="\'+8.C.G+\'-1e-2h" 1D="#"><1p>48</1p></a></J><J X="\'+8.C.G+\'-I"><J X="\'+8.C.G+\'-I-6d"></J><a X="\'+8.C.G+\'-1e-18" 1D="#"><1p>47</1p></a><a X="\'+8.C.G+\'-1e-1c" 1D="#"><1p>6e</1p></a><J X="\'+8.C.G+\'-I-1S"></J><a X="\'+8.C.G+\'-1e-2h" 1D="#"><1p>48</1p></a><J X="\'+8.C.G+\'-I-6f"></J></J><J X="\'+8.C.G+\'-Y"></J><J X="\'+8.C.G+\'-Z"></J><J X="\'+8.C.G+\'-1O-2R-18"></J><J X="\'+8.C.G+\'-1O-2R-46"></J><J X="\'+8.C.G+\'-1O-2R-2h"></J></J>\');8.A.1w=$(\'.\'+8.C.G+\'-1w\',8.A.U);8.A.I.J=$(\'.\'+8.C.G+\'-I\',8.A.U);8.A.I.1m=$(\'.\'+8.C.G+\'-1e-1m\',8.A.U);8.A.I.1Y=$(\'.\'+8.C.G+\'-1e-18\',8.A.U);8.A.I.1c=$(\'.\'+8.C.G+\'-1e-1c\',8.A.U);8.A.I.1Z=$(\'.\'+8.C.G+\'-1e-2h\',8.A.U);8.A.I.1S=$(\'.\'+8.C.G+\'-I-1S\',8.A.U);8.A.Y=$(\'.\'+8.C.G+\'-Y\',8.A.U);8.A.Z=$(\'.\'+8.C.G+\'-Z\',8.A.U);8.A.T=$(\'<J X="\'+8.C.G+\'-T"></J>\').2g(8.A.U);8.A.T.P({\'1Q\':\'2P\',\'z-15\':8.C.1k,\'1h\':-49,\'18\':-49});$(\'3k\').2g(8.A.T);8.4a();S 8.A.U},4a:F(){8.A.I.1m.1j(\'1s\',$.L(F(a){8.1m();a.22()},8));B(r||u){13.6g=F(){$(13).2Q(\'19\')}};$(13).1j(\'19\',$.L(F(){B(8.1d){8.1l.19();B(!8.1y){8.26()}}},8));$(13).1j(\'6h\',$.L(F(){B(8.1d&&!8.1y){8.26()}},8));$(2O).1j(\'6i\',$.L(F(a){B(8.1d){B(a.3m==27&&8.1l.C.2M){8.1m()}B(8.12.2u>1){B(a.3m==37){8.A.I.1Y.2S(\'1s\',a)}B(a.3m==39){8.A.I.1Z.2S(\'1s\',a)}}}},8));8.A.I.1c.1j(\'1s\',$.L(F(a){8.4b();a.22()},8));8.1l.W.1j(\'11\',$.L(F(){$(8).2S(\'11\')},8));8.1l.W.1j(\'1n\',$.L(F(){$(8).2S(\'1m\')},8))},4c:F(b){B($.2T(b)&&b.2j>1){8.12.3n=b;8.12.1q=0;8.12.2u=b.2j;b=b[0];8.A.I.1Y.2i(\'1s\');8.A.I.1Z.2i(\'1s\');8.A.I.1Y.1j(\'1s\',$.L(F(a){B(8.12.1q-1<0){8.12.1q=8.12.2u-1}M{8.12.1q=8.12.1q-1}8.11(8.12.3n[8.12.1q]);a.22()},8));8.A.I.1Z.1j(\'1s\',$.L(F(a){B(8.12.1q+1>=8.12.2u){8.12.1q=0}M{8.12.1q=8.12.1q+1}8.11(8.12.3n[8.12.1q]);a.22()},8))}B(8.12.2u>1){B(8.A.1w.P("1B")=="1P"){8.A.I.J.11()}8.A.I.1Y.11();8.A.I.1Z.11()}M{8.A.I.1Y.1n();8.A.I.1Z.1n()}},4d:F(b,c){$.1T(b,$.L(F(i,a){8.A.I.1S.2g($(\'<a 1D="#" X="\'+a[\'X\']+\'">\'+a.Z+\'</a>\').1j(\'1s\',$.L(F(e){B($.21(a.1R)){c=2k c==="1W"?R:c[8.12.1q||0];a.1R(8.1g.24,8,c)}e.22()},8)))},8));8.A.I.J.11()},11:F(b,c,d,f){H g=\'\';H h=R;B(2k b==="3o"&&b[0].6j){H j=b;b="#";g=\'W\'}B(($.2T(b)&&b.2j<=1)||b==\'\'){S R};8.1U();h=8.1d;8.4e();B(!h){8.26()};8.4c(b,c);B($.2T(b)&&b.2j>1){b=b[0]}H k=b.Q("%4f%");H b=k[0];H l=k[1]||\'\';c=$.1r(K,{\'D\':0,\'E\':0,\'2G\':0,\'3p\':\'\',\'28\':l,\'3q\':K,\'T\':-1,\'1i\':R,\'2U\':\'\',\'2V\':K,\'2v\':F(){},\'2W\':F(){}},c||{});8.C.2v=c.2v;8.C.2W=c.2W;8.C.2V=c.2V;4g=8.4h(b);c=$.1r({},c,4g);H m={x:$(13).D(),y:(13.2l?13.2l:$(13).E())};B(c.D&&(c.D+\'\').1x("p")>0){c.D=(m.x-20)*c.D.4i(0,c.D.1x("p"))/2e}B(c.E&&(c.E+\'\').1x("p")>0){c.E=(m.y-20)*c.E.4i(0,c.E.1x("p"))/2e}8.A.Y.2i(\'1E\');8.1l.C.2M=!c.2G;8.A.I.1c.29(8.C.G+\'-1e-3r\');8.A.I.1c.2w(8.C.G+\'-1e-1c\');8.1y=!(c.T>0||(c.T==-1&&c.3q));B($.2T(c.I)){8.4d(c.I,f)}B(!8.A.I.1S.4j(":1t")){8.A.I.J.11()}B(c.3p!=\'\'){g=c.3p}M B(c.1i){g=\'1i\'}M B(b.2a(8.41)){g=\'1g\'}M{$.1T(8.3T,$.L(F(i,e){B(b.Q(\'?\')[0].2a(e.16)){B(e.Q){4k=b.Q(e.Q)[e.15].Q(\'?\')[0].Q(\'&\')[0];b=e.17.2m("%V%",4k)}g=e.1i?\'1i\':\'1L\';c.D=c.D?c.D:8.C.1L.D;c.E=c.E?c.E:8.C.1L.E;S R}},8));$.1T(8.3Y,F(i,e){B(b.2a(e.16)){g=\'1i\';B(e.Q){V=b.Q(e.Q)[e.15];b=e.17.2m("%V%",V).2m("%D%",c.D).2m("%E%",c.E)}c.D=c.D?c.D:8.C.1f.D;c.E=c.E?c.E:8.C.1f.E;S R}});B(g==\'\'){B(b.2a(/#/)){3s=b.6k(b.1x("#"));B($(3s).2j>0){g=\'3t\';b=3s}M{g=\'1V\'}}M{g=\'1V\'}}}B(g==\'1g\'){8.A.I.1c.1n();H n=2s 6l();n.4l=$.L(F(){n.4l=F(){};B(!8.1d){S R};8.1g={D:n.D,E:n.E,24:n.24};B(c.D){D=1I(c.D);E=1I(c.E)}M{B(c.3q){H a=8.3u(n.D,n.E);D=a.D;E=a.E;B(n.D!=D||n.E!=E){8.A.I.J.11();8.A.I.1c.11()}}M{D=n.D;E=n.E}}8.19(D,E);8.A.Y.1j(\'1E\',$.L(F(){B(!8.1d){S R};8.2X(\'1g\');8.A.Y.1t();8.A.Z.1t();B(c.28!=\'\'){8.A.Y.2g($(\'<J X="\'+8.C.G+\'-28"></J>\').Z(c.28))}8.A.Y.2g(n);B(q||u||r){8.A.Y.29(8.C.G+\'-1U\')}M{$(n).1n();$(n).25().6m(3M,$.L(F(){8.A.Y.29(8.C.G+\'-1U\')},8))}8.C.2v()},8))},8);n.6n=$.L(F(){8.2n("3v 4m 1g 4n 4o 3w. 4p 4q 4r 4s.")},8);n.24=b}M B(g==\'1L\'||g==\'3t\'||g==\'1V\'||g==\'W\'){B(g==\'3t\'){8.2o($(b).6o(K).11(),c.D>0?c.D:$(b).3x(K),c.E>0?c.E:$(b).3y(K),\'Z\')}M B(g==\'1V\'){B(c.D){D=c.D;E=c.E}M{8.2n("4t 4u 4v 4w 2Y 4x 4y 2Y U.");S R}B(8.1X.1V){8.1X.1V.6p()};8.1X.1V=$.1V({17:b,4z:"6q",6r:R,6s:"Z",2n:$.L(F(){8.2n("3v 4m 6t 4n 4o 3w. 4p 4q 4r 4s.")},8),6u:$.L(F(a){8.2o($(a),D,E,\'Z\')},8)})}M B(g==\'1L\'){H o=8.4A(b,c.D,c.E,c.2U);8.2o($(o),c.D,c.E,\'Z\')}M B(g==\'W\'){8.2o(j,c.D>0?c.D:j.3x(K),c.E>0?c.E:j.3y(K),\'Z\')}}M B(g==\'1i\'){B(c.D){D=c.D;E=c.E}M{8.2n("4t 4u 4v 4w 2Y 4x 4y 2Y U.");S R}8.2o($(\'<1i V="43\'+(2s 3i().3j())+\'" 44="0" 24="\'+b+\'" 1C="2t:0; 3z:0;" 6v="K"></1i>\').P(c),c.D,c.E,\'Z\')}8.1R=$.21(d)?d:F(e){}},4A:F(a,b,c,d){B(2k d==\'1W\'||d==\'\')d=\'2K=1&1z=1&6w=1\';H e=\'<3o D="\'+b+\'" E="\'+c+\'" 6x="6y:6z-6A-6B-6C-6D"><1a G="6E" 1F="\'+a+\'" 1C="2t:0; 3z:0;"></1a>\';e+=\'<1a G="6F" 1F="K"></1a><1a G="4B" 1F="4C"></1a><1a G="4D" 1F="4E"></1a>\';e+=\'<1a G="2K" 1F="K"></1a><1a G="1z" 1F="K"></1a><1a G="2U" 1F="\'+d+\'"></1a>\';e+=\'<1a G="D" 1F="\'+b+\'"></1a><1a G="E" 1F="\'+c+\'"></1a>\';e+=\'<2f 24="\'+a+\'" 4z="6G/x-6H-1L" 4B="4C" 6I="K" 2K="K" 1z="K" 2U="\'+d+\'" 4D="4E" D="\'+b+\'" E="\'+c+\'" 1C="2t:0; 3z:0;"></2f></3o>\';S e},2o:F(a,b,c,d){B(2k d!==\'1W\'){8.2X(d)}8.19(b+30,c+20);8.A.Y.1j(\'1E\',$.L(F(){8.A.Y.29(8.C.G+\'-1U\');8.A.Z.Z(a);8.A.Z.Z(a);8.A.Y.2i(\'1E\');B(8.C.2V&&2k 4F!==\'1W\'){4F.6J()}8.C.2v()},8))},26:F(w,h){H a={x:$(13).D(),y:(13.2l?13.2l:$(13).E())};H b={x:$(13).4G(),y:$(13).4H()};H c=h!=3A?h:8.A.U.3y();H d=w!=3A?w:8.A.U.3x();H y=0;H x=0;x=b.x+((a.x-d)/2);B(8.1d){y=b.y+(a.y-c)/2}M B(8.C.3S=="2R"){y=(b.y+a.y+14)}M{y=(b.y-c)-14}B(8.1d){B(!8.1X.T){8.1G(8.A.T,{\'18\':x},\'T\')}8.1G(8.A.T,{\'1h\':y},\'T\')}M{8.A.T.P({\'18\':x,\'1h\':y})}},1G:F(d,f,g,h,i){H j=$.6K({2x:i||R,32:(u||r?2:8.C[g+\'6L\']),2Z:8.C[g+\'6M\'],1E:($.21(h)?$.L(h,8):3A)});S d[j.2x===R?"1T":"2x"](F(){B(3B($.3C.31)>1.5){B(j.2x===R){2b.6N(8)}}H c=$.1r({},j),4I=8;c.6O=$.1r({},f);c.4J={};4K(p 6P f){G=p;3D=f[G];c.4J[G]=c.4L&&c.4L[G]||c.2Z||\'6Q\';B(3D==="1n"&&23||3D==="11"&&!23){S c.1E.3K(8)}}$.1T(f,F(a,b){H e=2s $.2D(4I,c,a);e.1S(e.6R(K)||0,b,"6S")});S K})},19:F(x,y){B(8.1d){H a={x:$(13).D(),y:(13.2l?13.2l:$(13).E())};H b={x:$(13).4G(),y:$(13).4H()};H c=(b.x+(a.x-(x+14))/2);H d=(b.y+(a.y-(y+14))/2);B($.1H.2A||($.1H.6T&&(3B($.1H.2B)<1.9))){y+=4}8.1X.T=K;8.1G(8.A.T.25(),{\'18\':(8.1y&&c<0)?0:c,\'1h\':(8.1y&&(y+14)>a.y)?b.y:d},\'T\',$.L(F(){8.T=R},8.1X));8.1G(8.A.Z,{\'E\':y-20},\'19\');8.1G(8.A.U.25(),{\'D\':(x+14),\'E\':y-20},\'19\',{},K);8.1G(8.A.1w,{\'D\':x},\'19\');8.1G(8.A.1w,{\'1h\':(y-4M)/2},\'T\');8.1G(8.A.Y.25(),{\'D\':x,\'E\':y},\'19\',F(){$(8.A.Y).2Q(\'1E\')})}M{8.A.Z.P({\'E\':y-20});8.A.U.P({\'D\':x+14,\'E\':y-20});8.A.Y.P({\'D\':x,\'E\':y});8.A.1w.P({\'D\':x,\'E\':4M})}},1m:F(a){8.1d=R;8.12={};8.C.2W();B($.1H.2A||u||r){8.A.Y.1t();8.A.Z.1n().1t().11();8.A.I.1S.1t();8.A.T.P({\'1B\':\'1P\'});8.26()}M{8.A.T.2y({\'1J\':0,\'1h\':\'-=40\'},{2x:R,1E:($.L(F(){8.A.Y.1t();8.A.Z.1t();8.A.I.1S.1t();8.26();8.A.T.P({\'1B\':\'1P\',\'1J\':1,\'3E\':\'1d\'})},8))})}8.1l.1n($.L(F(){B($.21(8.1R)){8.1R.3J(8,$.6U(a))}},8));8.A.Y.25(K,R);8.A.Y.2i(\'1E\')},4e:F(){8.1d=K;B($.1H.2A){8.A.T.6V(0).1C.6W(\'4N\')}8.A.T.P({\'1B\':\'3l\',\'3E\':\'1d\'}).11();8.1l.11()},2d:F(){H x=8.C.2d.3O;H d=8.C.2d.32;H t=8.C.2d.1K;H o=8.C.2d.3P;H l=8.A.T.1Q().18;H e=8.A.T;4K(i=0;i<o;i++){e.2y({18:l+x},d,t);e.2y({18:l-x},d,t)};e.2y({18:l+x},d,t);e.2y({18:l},d,t)},2X:F(a){B(a!=8.1M){8.A.U.29(8.C.G+\'-1M-\'+8.1M);8.1M=a;8.A.U.2w(8.C.G+\'-1M-\'+8.1M)}8.A.T.P({\'3E\':\'1d\'})},2n:F(a){6X(a);8.1m()},4h:F(d){H e=/U\\[(.*)?\\]$/i;H f={};B(d.2a(/#/)){d=d.4O(0,d.1x("#"))}d=d.4O(d.1x(\'?\')+1).Q("&");$.1T(d,F(){H a=8.Q("=");H b=a[0];H c=a[1];B(b.2a(e)){B(6Y(c)){c=1I(c)}M B(c.2C()=="K"){c=K}M B(c.2C()=="R"){c=R}f[b.2a(e)[1]]=c}});S f},3u:F(x,y){H a=$(13).D()-50;H b=$(13).E()-50;B(x>a){y=y*(a/x);x=a;B(y>b){x=x*(b/y);y=b}}M B(y>b){x=x*(b/y);y=b;B(x>a){y=y*(a/x);x=a}}S{D:1I(x),E:1I(y)}},1U:F(){8.2X(\'1g\');8.A.Y.1t();8.A.Z.1t();8.A.Y.2w(8.C.G+\'-1U\');8.A.I.J.1n();B(8.1d==R){8.26(8.C.D,8.C.E);8.19(8.C.D,8.C.E)}},4b:F(){B(8.1y){8.1y=R;8.A.I.1c.29(8.C.G+\'-1e-3r\');8.A.I.1c.2w(8.C.G+\'-1e-1c\');H a=8.3u(8.1g.D,8.1g.E);8.1U();8.A.I.J.11();8.19(a.D,a.E)}M{8.1y=K;8.A.I.1c.29(8.C.G+\'-1e-1c\');8.A.I.1c.2w(8.C.G+\'-1e-3r\');8.1U();8.A.I.J.11();8.19(8.1g.D,8.1g.E)}}},U:F(a,b,c){B(2k a!==\'1W\'){S $.2p.11(a,b,c)}M{S $.2p}}});$.3C.U=F(l,m){S $(8).6Z(\'1s\',F(e){$(8).70();H b=[];H c=$.3F($(8).2z(\'2q\'))||\'\';H d=$.3F($(8).2z(\'28\'))||\'\';H f=$(8);c=c.2m(\'[\',\'\\\\\\\\[\');c=c.2m(\']\',\'\\\\\\\\]\');B(!c||c==\'\'||c===\'71\'){b=$(8).2z(\'1D\');3G=(d||d!=\'\')?$.1r({},l,{\'28\':d}):l}M{H g=[];H h=[];H j=[];H k=R;$("a[2q], 72[2q]",8.73).4N("[2q=\\""+c+"\\"]").1T($.L(F(i,a){B(8==a){h.74(a);k=K}M B(k==R){j.3H(a)}M{h.3H(a)}},8));g=f=h.75(j);$.1T(g,F(){H a=$.3F($(8).2z(\'28\'))||\'\';a=a?"%4f%"+a:\'\';b.3H($(8).2z(\'1D\')+a)});B(b.2j==1){b=b[0]}3G=l}$.2p.11(b,3G,m,f);e.22();e.76()})};$(F(){B(3B($.3C.31)>1.2){$.2p.2L()}M{77"3v 2b 2B 78 79 3w 4j 7a 7b. 7c 7d 7e 2b 1.3+";}})})(2b);',62,449,'||||||||this||||||||||||||||||||||||||||esqueleto|if|options|width|height|function|name|var|buttons|div|true|proxy|else|com|amp|css|split|false|return|move|lightbox|id|element|class|background|html||show|gallery|window||index|reg|url|left|resize|param|http|max|visible|button|maps|image|top|iframe|bind|zIndex|overlay|close|hide|shim|span|current|extend|click|empty|www|google|navigator|indexOf|maximized|autoplay|video|display|style|href|complete|value|morph|browser|parseInt|opacity|transition|flash|mode|swf|border|none|position|callback|custom|each|loading|ajax|undefined|animations|prev|next||isFunction|preventDefault|hidden|src|stop|movebox||title|removeClass|match|jQuery|easeOutBack|shake|100|embed|append|right|unbind|length|typeof|innerHeight|replace|error|appendhtml|LightBoxObject|rel|collegehumor|new|margin|total|onOpen|addClass|queue|animate|attr|msie|version|toLowerCase|fx|step||modal|showDuration|closeDuration|moogaloop|autostart|create|hideOnClick|target|document|absolute|trigger|bottom|triggerHandler|isArray|flashvars|cufon|onClose|changemode|the|easing||jquery|duration|youtube|metacafe|dailymotion|vimeo||player||fullscreen|megavideo|gametrailers|ustream|twitvid|vzaar|bing|output|Date|getTime|body|block|keyCode|images|object|force|autoresize|min|obj|inline|calculate|The|loaded|outerWidth|outerHeight|padding|null|parseFloat|fn|val|overflow|trim|copy_options|push|userAgent|apply|call|defaults|400|1000|distance|loops|640|360|emergefrom|videoregs|watch|clip_id|tv|wordpress|mapsreg|ms||imgsreg|inject|IF_|frameborder|fadeTo|middle|Previous|Next|999|addevents|maximinimize|create_gallery|custombuttons|open|LIGHTBOX|urloptions|unserialize|substring|is|videoid|onload|requested|cannot|be|Please|try|again|later|You|need|to|specify|size|of|type|swf2html|allowscriptaccess|always|wmode|transparent|Cufon|scrollLeft|scrollTop|self|animatedProperties|for|specialEasing|90|filter|slice|iphone|ipad|arguments|prototype|update|elem|now|prop|_default|70158|7000||470|280|FFFFFF|200|moveDuration|resizeDuration|showTransition|closeTransition|moveTransition|resizeTransition|fs|modestbranding|enablejsapi|fplayer|playerVars|autoPlay|yes|additionalInfos|autoStart|videoplay|googleplayer|hl|en|docId|hd|show_title|show_byline|show_portrait|color|remote_wrap|php|mid|collegehumornew|jukebox|use_node_id|loc|vid|disabledComment|beginPercent|5331|endPercent|6292|locale|en_US|s0|videopress|guid|01|videos|view|flashplayer|emid|3ede2bc8|227d|8fec|d84a|00b6ff19b1cb|streetview|layer|svembed|googlev2|jpg|jpeg|gif|png|bmp|tiff|fixed|static|relative|scrolling|no|insertAfter|Close|init|Maximize|end|onorientationchange|scroll|keydown|nodeType|substr|Image|fadeIn|onerror|clone|abort|GET|cache|dataType|content|success|allowTransparency|fullscreenbutton|classid|clsid|D27CDB6E|AE6D|11cf|96B8|444553540000|movie|allowFullScreen|application|shockwave|allowfullscreen|refresh|speed|Duration|Transition|_mark|curAnim|in|swing|cur|px|mozilla|makeArray|get|removeAttribute|alert|isFinite|live|blur|nofollow|area|ownerDocument|unshift|concat|stopPropagation|throw|that|was|too|old|Lightbox|Evolution|requires'.split('|'),0,{}));



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
jQuery('body').attr('style', 'background:url(images/1-backgrounds/bg-main.jpg) repeat');
	
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






















