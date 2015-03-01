!function(window, font_url) {
    if (!window.localStorage) return;

    function on(element, event_name, fn) {
        return element.addEventListener(event_name, fn, false);
    }

    function cached() {
        return window.localStorage && localStorage.font_css_cache && localStorage.font_css_cache_file === font_url;
    }

    function inject_fonts() {
        if (cached()) {
            inject_content(localStorage.font_css_cache);
        } else {
            var req = new XMLHttpRequest;
            on(req, "load", function() {
                if (req.readyState === 4) {
                    // @TODO: Don't inject fonts in first loading
                    // inject_content(req.responseText);
                    localStorage.font_css_cache = req.responseText;
                    localStorage.font_css_cache_file = font_url;
                }
            });
            req.open("GET", font_url, true);
            req.send();
        }
    }

    function inject_content(content) {
        var style_element = document.createElement("style");
        style_element.innerHTML = content;
        document.getElementsByTagName("head")[0].appendChild(style_element);
    }

    if (localStorage.font_css_cache) {
        inject_fonts();
    } else {
        on(window, "load", inject_fonts);
    }

}(window, "/assets/stylesheets/fonts.css");
