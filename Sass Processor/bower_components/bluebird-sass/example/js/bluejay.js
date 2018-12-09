(function($) {
           
    function smoothScroll(el, to, duration) {
        if (duration < 0) {
            return;
        }
        var difference = to - $(window).scrollTop();
        var perTick = difference / duration * 10;
        this.scrollToTimerCache = setTimeout(function() {
            if (!isNaN(parseInt(perTick, 10))) {
                window.scrollTo(0, $(window).scrollTop() + perTick);
                smoothScroll(el, to, duration - 10);
            }
        }.bind(this), 10);
    }
    $('.nav-menu a, .overlay a').on('click', function(e) {
        e.preventDefault();
        smoothScroll($(window), $($(e.currentTarget).attr('href')).offset().top, 200);
    });
            
    $('.overlay-toggle').bind('click', function(e) {
        $('.overlay-toggle').toggleClass( 'active' );
        $('.overlay').toggleClass( 'open' );
    });

    $(document).keyup(function(e) {
		if (e.keyCode == 27) { // escape key maps to keycode `27`
			$('.overlay-toggle').removeClass( 'active' );
        	$('.overlay').removeClass( 'open' );
		}
	});

})(Zepto);