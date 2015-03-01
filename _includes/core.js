(function() {
    var
        $thread,
        class_name, update_btn, hide_btn, show_btn, change_status,
        _update_classList, _set_html,

        $trigger = document.getElementById("disqus_trigger");

    if (!$trigger) return false;

    $thread = document.getElementById("disqus_thread");
    class_name = "_show";

    // Body

    update_btn = function(class_fn, text) {
        _update_classList(class_fn);
        _set_html(text);
    };

    hide_btn = update_btn.bind(null, "remove", "Show");
    show_btn = update_btn.bind(null, "add", "Hide");

    change_status = function() {
        ($thread.classList.contains(class_name) ? hide_btn : show_btn)();
    };

    // Add handlers

    $trigger.addEventListener("tap", change_status, false);

    // Private

    _update_classList = function(method) {
        $thread.classList[method](class_name);
    };

    _set_html = function(prefix) {
        $trigger.innerHTML = prefix + " comments";
    };

})();

(function() {
    var
        clicked = function(event) {
            event.preventDefault();

            location.href = _fix_url(this.getAttribute("href"));
        },
        _fix_url = _fix_url = function(href) {
            return /\/$/.test(href) ? href : href + "/";
        },
        $links = document.getElementsByTagName("A"),
        number = $links.length,
        i = 0;

    if (number) {
        for (; i < number; i++) {
            $links[i].addEventListener("tap", clicked, false);
        }
    }

})();
