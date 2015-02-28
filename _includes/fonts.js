!function(font_url) {

    function on(element, event_name, fn) {
        if (element.addEventListener) {
            element.addEventListener(event_name, fn, false);
        } else {
            element.attachEvent && element.attachEvent('on' + event_name, fn);
        }
    }

    function cached(file) {
        return window.localStorage && localStorage.font_css_cache && localStorage.font_css_cache_file === file;
    }

    function inject_fonts() {
        if (window.localStorage && window.XMLHttpRequest) {
            if (cached(font_url)) {
                inject_content(localStorage.font_css_cache);
            } else {
                var req = new XMLHttpRequest;
                req.open('GET', font_url, true);
                on(req, 'load', function() {
                    if (req.readyState === 4) {
                        // @TODO: Don't inject fonts in first loading
                        // inject_content(req.responseText);
                        localStorage.font_css_cache = req.responseText;
                        localStorage.font_css_cache_file = font_url;
                    }
                });
                req.send();
            }
        } else {
            var link_element = document.createElement('link');
            link_element.href = font_url;
            link_element.rel = 'stylesheet';
            link_element.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(link_element);
            document.cookie = 'font_css_cache';
        }
    }

    function inject_content(content) {
        var style_element = document.createElement('style');
        style_element.innerHTML = content;
        document.getElementsByTagName('head')[0].appendChild(style_element);
    }

    if (window.localStorage && localStorage.font_css_cache || document.cookie.indexOf('font_css_cache') > -1) {
        inject_fonts();
    } else {
        on(window, 'load', inject_fonts);
    }

}('/assets/stylesheets/fonts.css');
