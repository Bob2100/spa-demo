/*jslint browser:true, continue:true, devel:true, indent:2, maxerr:50, newcap:true,
        nomen:true, plusplus: true, regexp: true, sloppy:true, vars:true, white:true
        */

var spa = (function ($) {
    var configMap = {
        extended_height: 434,
        extended_title: 'Click to retract',
        retracted_height: 16,
        retract_title: 'Click to extend',
        template_html: '<div class="spa-slider"></div>'

    };
    var $chatSlider;
    var toggleSilder;
    var onClickSlider;
    var initModule;

    toggleSilder = function () {
        var slider_height = $chatSlider.height();
        if (slider_height === configMap.retracted_height) {
            $chatSlider.animate({ height: configMap.extended_height }).attr('title', configMap.extended_title);
            return true;
        } else if (slider_height === configMap.extended_height) {
            $chatSlider.animate({ height: configMap.retracted_height }).attr('title', configMap.retract_title);
            return true;
        }
        return false;
    };

    onClickSlider = function (event) {
        toggleSilder();
        return false;
    };

    initModule = function ($container) {
        $container.html(configMap.template_html);
        $chatSlider = $container.find('.spa-slider');
        $chatSlider.attr('title', configMap.retract_title).click(onClickSlider);
        return true;
    };
    return { initModule: initModule };
}(jQuery));