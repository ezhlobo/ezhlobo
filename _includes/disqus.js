(function(window){
    if (!window.disqus_shortname) return false;

    var
        LOADED, debouncer,

        scrolling_offset = 300,
        debouncer_delta = 200,

        document = window.document,
        $trigger = document.getElementById("disqus_trigger"),
        $element = document.getElementById("disqus_thread"),
        element_offset_top = $element.offsetTop,
        handlers = {
            scrolling: function() {
                clearTimeout(debouncer);
                debouncer = setTimeout(function() {
                    if (window.scrollY + window.outerHeight + scrolling_offset > element_offset_top) {
                        _dsq_load();
                    }
                }, debouncer_delta);
            },
            clicked: function() {
                _dsq_load();
            }
        },

        _dsq_load = function() {
            if (!LOADED) {
                var dsq = document.createElement("script");
                dsq.type = "text/javascript";
                dsq.async = true;
                dsq.src = "//go.disqus.com/embed.js";
                (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq);
            }
            _unsubscribe_all();
        },
        _unsubscribe_all = function() {
            LOADED = true;
            window.removeEventListener("scroll", handlers.scrolling);
            $trigger.removeEventListener("tap", handlers.clicked);
        };

    // Initialize
    if (window.getComputedStyle($element).getPropertyValue("display") !== "none") {
        window.addEventListener("scroll", handlers.scrolling, false);
    } else {
        // @TODO: Hotfix for resizing way from small screen size to big
        $trigger.setAttribute("style", "display: inline-block !important;");
    }

    $trigger.addEventListener("tap", handlers.clicked, false);

})(window);
