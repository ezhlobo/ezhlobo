(function(window){

	var $ = document.querySelectorAll.bind(document);
	var each = function(elems, invokes) {
		for (var i = 0, l = elems.length; i < l; i++) {
			if (invokes(i, elems[i]) == false) break;
		}
	};
	var aEvent = function(elem, name, invokes) {
		elem.addEventListener(name, invokes, false);
	};
	var get = function(url, invokes) {
		var req = new XMLHttpRequest();
		req.open("GET", url, false);
		req.send(null);
		if (req.status == 200) {
			if (invokes.success) invokes.success(req.responseText);
		}
	};

	window.Article = (function() {
		function app() {
			this.setTriggers();
		}

		app.prototype.show = function(url) {
			get(url, {
				success: function(data) {
					console.log( data );
				}
			});
		};

		app.prototype.setTriggers = function() {
			var that = this;

			var clicked = function(e) {
				e.preventDefault();
				that.show(e.target.href);
			};

			each( $('.postlist a'), function(i, link) {
				aEvent(link, "click", clicked);
			});
		};

		return app;
	})();

	// var article = new Article();

	each($("a"), function(i, elem) {
		aEvent(elem, "click", function(e) {
			// e.preventDefault();
		})
	})

})(window);
