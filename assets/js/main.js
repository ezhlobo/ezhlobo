(function(window){

	var $ = function(selector, context) {
		return (context && context.querySelectorAll ? context : document).querySelectorAll(selector);
	};

	var ClassProjects = (function() {
		function app() {
			var that = this;

			that.list = $('.list_projects')[0];
			that.items = $('li', that.list);
			that.width = 100;

			// that.list.style.width = (that.items.length * that.width) + 'px';
		}

		return app;
	})();


	var Projects;
	var loaded = function() {
		Projects = new ClassProjects();
	};
	window.addEventListener("load", loaded, false);

})(window);
