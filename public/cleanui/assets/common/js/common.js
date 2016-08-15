/**
 * CLEAN UI THEME SETTINGS
 */

var cleanUI = {
    hasTouch: (function() { return ('ontouchstart' in document.documentElement) })()
};



/**
 * CLEAN UI TEMPLATE SCRIPTS
 */

$(function(){

    /////////////////////////////////////////////////////////////////////////////
    // Slide toggle menu items on click

    $('.left-menu .left-menu-list-submenu > a').on('click', function(){
        var that = $(this).parent(),
            opened = $('.left-menu .left-menu-list-opened');

        if (!that.hasClass('left-menu-list-opened') && !that.parent().closest('.left-menu-list-submenu').length)
            opened.removeClass('left-menu-list-opened').find('> ul').slideUp(200);

        that.toggleClass('left-menu-list-opened').find('> ul').slideToggle(200);
    });

    /////////////////////////////////////////////////////////////////////////////
    // Reinitialise jScrollPane on window.resize

    if (!cleanUI.hasTouch)
        $('.scroll-pane').each(function() {
            $(this).jScrollPane({
                autoReinitialise: true,
                autoReinitialiseDelay: 100
            });
            var api = $(this).data('jsp'),
                throttleTimeout;
            $(window).bind('resize', function() {
                if (!throttleTimeout) {
                    throttleTimeout = setTimeout(function() {
                        api.reinitialise();
                        throttleTimeout = null;
                    }, 50);
                }
            });
        });

    /////////////////////////////////////////////////////////////////////////////
    // Toggle menu on viewport < 768px

    $('.left-menu-toggle').on('click', function(){
        $(this).toggleClass('active');
        $('nav.left-menu').toggleClass('left-menu-showed');
        $('.main-backdrop').toggleClass('main-backdrop-showed')
    });

    /////////////////////////////////////////////////////////////////////////////
    // Hide menu and backdrop on backdrop click

    $('.main-backdrop').on('click', function(){
        $('.left-menu-toggle').removeClass('active');
        $('nav.left-menu').removeClass('left-menu-showed');
        $('.main-backdrop').removeClass('main-backdrop-showed')
    });

});