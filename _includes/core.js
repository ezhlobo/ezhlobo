(function() {

    // Definition

    var $trigger = document.getElementById('disqus_trigger');
    var $thread = document.getElementById('disqus_thread');
    var class_name = '_show';

    // Body

    var hide_btn = function() {
        _update_classList('remove');
        _set_html('Show');
    };

    var show_btn = function() {
        _update_classList('add');
        _set_html('Hide');
    };

    var change_status = function() {
        var fn = $thread.classList.contains(class_name) ? hide_btn : show_btn;

        return fn();
    };

    // Add handlers

    if ($trigger) {
        $trigger.addEventListener('tap', change_status, false);
    }

    // Private

    var _update_classList = function(method) {
        $thread.classList[method](class_name);
    };

    var _set_html = function(prefix) {
        $trigger.innerHTML = prefix + ' comments';
    };

})();

(function() {
    var $links, i, l, clicked, subscribe;

    // Definition

    $links = document.getElementsByTagName('A');

    // Body

    clicked = function(event) {
        event.preventDefault();
        location.href = this.getAttribute('href');
    };

    subscribe = function($link) {
        $link.addEventListener('tap', clicked, false);
    };

    // Add handlers

    if ($links.length) {
        for (i = 0, l = $links.length; i < l; i++) {
            subscribe($links[i]);
        }
    }

})();
