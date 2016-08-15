/**
 * TEMPLATE OPTIONS
 * Theme demo temporary scripts, remove it in your app
 */

$(function(){

    /////////////////////////////////////////////////////////////////////////////
    // TODO-NICK REFACTOR THIS SHIT

    var optionsTheme = localStorage.getItem('options-theme'),
        optionsMode = localStorage.getItem('options-mode'),
        optionsMenu = localStorage.getItem('options-menu');

    $('#options-theme .btn').on('click', function(){
        var themeSelector = $(this).find('input').val();
        $('body').removeClass('theme-dark theme-default').addClass(themeSelector);
        localStorage.setItem('options-theme', themeSelector);
    });

    $('#options-mode .btn').on('click', function(){
        var themeSelector = $(this).find('input').val();
        $('body').removeClass('mode-superclean mode-default').addClass(themeSelector);
        localStorage.setItem('options-mode', themeSelector);
    });

    $('#options-menu .btn').on('click', function(){
        var themeSelector = $(this).find('input').val();
        $('body').removeClass('menu-fixed menu-static').addClass(themeSelector);
        localStorage.setItem('options-menu', themeSelector);
    });

    if (optionsTheme) {
        $('#options-theme input[value=' + optionsTheme + ']').closest('.btn').click();
    }

    if (optionsMode) {
        $('#options-mode input[value=' + optionsMode + ']').closest('.btn').click();
    }

    if (optionsMenu) {
        $('#options-menu input[value=' + optionsMenu + ']').closest('.btn').click();
    }

});