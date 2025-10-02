(function($) {
  "use strict";

// Document ready

$(document).ready(function(){

// Philosophy Card Flip
$('.philosophy-card-container').on('click', function(){
	// Flip back all other cards first
	$('.philosophy-card-container').not(this).find('.philosophy-card.flipped').removeClass('flipped');

	// Toggle this card
    $(this).find('.philosophy-card').toggleClass('flipped');
});

// FAQ Card Flip
$('.faq-card-container').on('click', function(){
	// Flip back all other cards first
	$('.faq-card-container').not(this).find('.faq-card.flipped').removeClass('flipped');

	// Toggle this card
    $(this).find('.faq-card').toggleClass('flipped');
});

// FAQ Filter
$('.faq-filter').on('click', 'li a', function(e){
	e.preventDefault();

	// Update active state
	$(this).addClass('active');
	$(this).parent().siblings().find('a').removeClass('active');

	var filterValue = $(this).attr('data-filter');

	// Reset all flipped cards
	$('.faq-card.flipped').removeClass('flipped');

	if(filterValue === 'all') {
		// Show all cards with animation
		var delay = 0;
		$('.faq-grid > .col-md-4').each(function(){
			var $this = $(this);
			if($this.hasClass('hidden')) {
				setTimeout(function(){
					$this.removeClass('hidden').addClass('filtering-in');
					setTimeout(function(){
						$this.removeClass('filtering-in');
					}, 400);
				}, delay);
				delay += 60;
			}
		});
	} else {
		// Animate out non-matching cards
		$('.faq-grid > .col-md-4').each(function(){
			var $this = $(this);
			var $container = $this.find('.faq-card-container');
			if($container.attr('data-category') !== filterValue && !$this.hasClass('hidden')) {
				$this.addClass('filtering-out');
				setTimeout(function(){
					$this.removeClass('filtering-out').addClass('hidden');
				}, 400);
			}
		});

		// Animate in matching cards with stagger
		setTimeout(function(){
			var delay = 0;
			$('.faq-grid > .col-md-4').each(function(){
				var $this = $(this);
				var $container = $this.find('.faq-card-container');
				if($container.attr('data-category') === filterValue && $this.hasClass('hidden')) {
					setTimeout(function(){
						$this.removeClass('hidden').addClass('filtering-in');
						setTimeout(function(){
							$this.removeClass('filtering-in');
						}, 400);
					}, delay);
					delay += 60;
				}
			});
		}, 200);
	}
});

// Solutions Filter
$('.solutions-filter').on('click', 'li a', function(e){
	e.preventDefault();

	// Update active state
	$(this).addClass('active');
	$(this).parent().siblings().find('a').removeClass('active');

	var filterValue = $(this).attr('data-filter');

	if(filterValue === 'all') {
		// Show all cards with animation
		var delay = 0;
		$('.solutions-grid > .col-md-2').each(function(){
			var $this = $(this);
			if($this.hasClass('hidden')) {
				setTimeout(function(){
					$this.removeClass('hidden').addClass('filtering-in');
					setTimeout(function(){
						$this.removeClass('filtering-in');
					}, 400);
				}, delay);
				delay += 60;
			}
		});
	} else {
		// Animate out non-matching cards
		$('.solutions-grid > .col-md-2').each(function(){
			var $this = $(this);
			var $container = $this.find('.solutions-card-container');
			if($container.attr('data-category') !== filterValue && !$this.hasClass('hidden')) {
				$this.addClass('filtering-out');
				setTimeout(function(){
					$this.removeClass('filtering-out').addClass('hidden');
				}, 400);
			}
		});

		// Animate in matching cards with stagger
		setTimeout(function(){
			var delay = 0;
			$('.solutions-grid > .col-md-2').each(function(){
				var $this = $(this);
				var $container = $this.find('.solutions-card-container');
				if($container.attr('data-category') === filterValue && $this.hasClass('hidden')) {
					setTimeout(function(){
						$this.removeClass('hidden').addClass('filtering-in');
						setTimeout(function(){
							$this.removeClass('filtering-in');
						}, 400);
					}, delay);
					delay += 60;
				}
			});
		}, 200);
	}
});

// Sticky nav

var header = $('.main-nav'),
    pos = header.offset();

$(window).scroll(function(){
	if($(this).scrollTop() > pos.top-20 && header.hasClass('default')){
		header.fadeOut('fast', function(){
			$(this).removeClass('default').addClass('switched-header').slideDown(200);
		});
	}else if($(this).scrollTop() <= pos.top-20 && header.hasClass('switched-header')){
		header.slideUp(200, function(){
		$(this).removeClass('switched-header').addClass('default').fadeIn(200);
		});
	}
});

// Section scroll 

$('a.scroll').smoothScroll({
    speed: 800,
    offset: -64
});

// Site slider 

$("#client-carousel").owlCarousel({
    items : 6,
    itemsDesktop : [1199,4],
    itemsDesktopSmall : [979,4],
    itemsTablet: [768,3],
    itemsTabletSmall: [550,3],
    itemsMobile : [480,2],
	pagination:false,
	autoPlay:true
});

$("#block-slider").owlCarousel({
    navigation : false,
    slideSpeed : 300,
    paginationSpeed : 400,      
    responsiveRefreshRate : 200,
    responsiveBaseWidth: window,
    pagination: false,
    singleItem: true,
    navigation:true,
    navigationText: ["<span class='icon-left-open-big'></span>","<span class='icon-right-open-big'></span>"]  
});

// Background image setup
 
var backgroundImage = $(".block-background-image");
for(var i = 0; i < backgroundImage.length; i++){
   	if (backgroundImage.eq(i).attr("data-background")){
	 	backgroundImage.eq(i).css("background-image", "url(" + backgroundImage.eq(i).data("background") + ")");
	}
}

//Portfolio setup 

$('.popup').magnificPopup({
	type: 'image',
	fixedContentPos: false,
	fixedBgPos: false,
	mainClass: 'mfp-no-margins mfp-with-zoom',
	image: {
		verticalFit: true
	},
	zoom: {
		enabled: true,
		duration: 300
	}
});

var blockWorks = $('.block-works');
$('.popup-youtube, .popup-vimeo').magnificPopup({
	disableOn: 700,
	type: 'iframe',
	mainClass: 'mfp-fade',
	removalDelay: 160,
	preloader: false,
	fixedContentPos: false
});
				

$('.filter ').on("click", "li a",function(e){
	e.preventDefault();

	$(this).addClass('active');
	$(this).parent().siblings().find('a').removeClass('active');
    var filters = $(this).attr('data-filter');

    var $container = $(this).closest(blockWorks).find('.row.masonry');

    // Use Isotope's built-in filtering with a function to check child .item element
    if (filters === 'all') {
        $container.isotope({ filter: '*' });
        $(this).closest(blockWorks).find('.item').removeClass('disable');
    } else {
        // Filter function checks the child .item element for the class
        $container.isotope({
            filter: function() {
                var $item = $(this).find('.item');
                return $item.hasClass(filters);
            }
        });

        // Update disable class for non-matching items
        $container.find('.item-block.masonry').each(function(){
            var $this = $(this);
            var $item = $this.find('.item');
            if($item.hasClass(filters)) {
                $item.removeClass('disable');
            } else {
                $item.addClass('disable');
            }
        });
    }

   return false;
});

// Search input
	
$('.search-form i').on("click", function(){
	$(this).closest('.search-form').find('input[type="text"]').focus();
	if($(this).closest('.search-form').find('input[type="text"]').val()){
		$(this).closest('.search-form').find('input[type="submit"]').trigger('click');
	}
});
		
// Form validation 

var inputName = $('input#firstname');
var inputEmail = $('input#email');
var textArea = $('textarea#information');
var contactForm = $('.contact-form');


$('.submit').on("click", function(){

	inputName.removeClass("errorForm");
	textArea.removeClass("errorForm");
	inputEmail.removeClass("errorForm");
	
	var error = false; 
	var name = inputName.val(); 
	if(name == "" || name == " ") { 
		error = true; 
		inputName.addClass("errorForm");
	}
	
	
	var msg = textArea.val(); 
	if(msg == "" || msg == " ") {
		error = true;
		textArea.addClass("errorForm");
			
	}
	
	var email_compare = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i; 
	var email = inputEmail.val(); 
	if (email == "" || email == " ") { 
		inputEmail.addClass("errorForm");
		error = true;
	}else if (!email_compare.test(email)) { 
		inputEmail.addClass("errorForm");
		error = true;
	}

	if(error == true) {
		return false;
	}

	var data_string = contactForm.serialize(); 
	
	$.ajax({
		type: "POST",
		url: contactForm.attr('action'),
		data: data_string,
		
		success: function(message) {
				if(message == 'SENDING'){
					$('#success').fadeIn('slow');
				}
				else{
					$('#error').fadeIn('slow');
				}
					}
			
	});

	return false; 
});
		
// Team hover 

var thumbs = $('.thumbs');
var thumbSpan = $('.thumbs li a span');
var thumbsLink = $('.thumbs li a ');
thumbSpan.css({ opacity: 0 });

thumbsLink.on('mouseenter', function(){
	$(this).children('span ').stop().animate({ opacity: 1 }, 'slow');
	}, function(){ 
	$(this).children('span ').stop().animate({ opacity: 0 }, 'slow'); 
});


for(var i = 0; i < thumbs.length; i++){
	
	thumbsLink.on('click', function(){
	return false;
	});
		
	thumbsLink.on('mouseenter', function(){
	if(thumbsLink.hasClass('t-active')){
		thumbSpan.stop().animate({ opacity: 0 }, 'slow'); 
		thumbsLink.removeClass('t-active');
	}
			
	$(this).addClass('t-active');
	$('.testi-details .td').hide();
	$($(this).attr('href')).show();
	});
}

// Facts 

var count = $('.inner-fact .count');
$('.fact-list').appear(function() {
	for(var i = 0; i < count.length; i++){
	var counter = count.eq(i).html();
	count.eq(i).countTo({
		from: 0,
		to: counter,
		speed: 2000,
		refreshInterval: 10,
		});
	
	}

});


// To the top handler

$().UItoTop({ easingType: 'easeOutQuart' });

// Mobile menu 

var mobileBtn = $('.mobile-btn');
var nav = $('ul.menu');
var navHeight= nav.height();
var mobile = $('ul.menu li a');

$(mobileBtn).on("click", function(){
	nav.slideToggle();
	mobile.addClass('mobile');
	return false;

});

$(window).resize(function(){
	var w = $(window).width();
	if(w > 320 && nav.is(':hidden')) {
		nav.removeAttr('style');
		mobile.removeClass('mobile');
	}

});

nav.on("click", function(e){
	if ($(e.target).is('a') &&  $(e.target).hasClass('mobile')) {
        nav.slideToggle();
        mobile.removeClass('mobile');
        
	}
		
});

// Email protection - decode obfuscated email addresses
$('.email-link').each(function() {
    var $this = $(this);
    var user = $this.data('user');
    var domain = $this.data('domain');

    if (user && domain) {
        // Reverse the strings
        var realUser = user.split('').reverse().join('');
        var realDomain = domain.split('').reverse().join('');
        var email = realUser + '@' + realDomain;

        // Update the href and text
        $this.attr('href', 'mailto:' + email);

        // Only update text if it doesn't already show the email
        if ($this.text().indexOf('@') === -1 || $this.text() !== email) {
            $this.text(email);
        }
    }
});

// Prevent default action for email links without proper data
$('.email-link').on('click', function(e) {
    if ($(this).attr('href') === '#') {
        e.preventDefault();
    }
});


// Windows load

$(window).load(function() { 

// Site loader 

$(".loader-inner").fadeOut(); 
$(".loader").delay(200).fadeOut("slow"); 
	
// Isotope items (masonry layout with filtering support)
var $container = $('.row.masonry');
	$container.isotope({
	itemSelector : '.resume-boxe.masonry, .item-block.masonry',
	layoutMode: 'masonry',
	masonry: {
		horizontalOrder: true
	},
	hiddenStyle: {
		opacity: 0,
		transform: 'scale(0.001)'
	},
	visibleStyle: {
		opacity: 1,
		transform: 'scale(1)'
	},
	transitionDuration: '0.4s'
});
	
});


});

})(jQuery);