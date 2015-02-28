(function(window){
    var dsq_load, small_screen, normal_screen, loaded, unsubscribe_all,
        $element, $trigger, element_offset_top, delta, debouncer;

    dsq_load = function() {
        if (!loaded) {
            var dsq;

            dsq = document.createElement('script');
            dsq.type = 'text/javascript';
            dsq.async = true;
            dsq.src = '//go.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

            unsubscribe_all();
        }
    };

    unsubscribe_all = function() {
        loaded = true;
        window.removeEventListener('scroll', handlers.scrolling);
        $trigger.removeEventListener('tap', handlers.clicked);
    };

    handlers = {
        scrolling: function() {
            clearTimeout(debouncer);
            debouncer = setTimeout(function() {
                var trigger_position = window.scrollY + window.outerHeight;

                if (trigger_position + delta > element_offset_top) {
                    dsq_load();
                    window.removeEventListener('scroll', handlers.scrolling);
                }
            }, 200);
        },
        clicked: function() {
            dsq_load();
        }
    };

    delta = 300;
    $element = document.getElementById('disqus_thread');
    $trigger = document.getElementById('disqus_trigger');
    element_offset_top = $element.offsetTop;

    // Initialize
    if (window.disqus_shortname) {
        if (window.getComputedStyle($element).getPropertyValue('display') !== 'none') {
            window.addEventListener('scroll', handlers.scrolling, false);
        }
        else {
            // @TODO: Hotfix for resizing way from small screen size to big
            $trigger.setAttribute('style', 'display: inline-block !important;');
        }

        // Always subscribe to small screen events
        $trigger.addEventListener('tap', handlers.clicked, false);
    }

})(window);
