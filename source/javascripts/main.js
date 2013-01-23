// Page have been loaded

/**
 * Establish the object that gets returned to break out of a loop iteration
 * @type {Object}
 */
var breaker = {};

/**
 * Iterator
 * @param  {Object}   obj
 * @param  {Function} callback
 */
var each = function(obj, iterator, context) {
  if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker) return;
    }
  }
};

var idTpl = /^\s*#([0-9a-z\-_]+)\s*$/i;
var tagTpl = /^\s*([0-9a-z\-_]+)\s*$/i;
var tagWithAttrTpl = /^\s*([0-9a-z\-_]+)(\[[a-z]+=[a-z]+\])\s*$/i;
var classTpl = /^\s*\.([0-9a-z\-_]+)\s*$/i;

/**
 * Get element by CSS selector
 * @param  {String} query   CSS selector
 * @param  {Elem}   context
 * @return {Elem}
 */
var ge = function(query, context) {
  var context = context || document,
    elems;

  // By ID
  if (idTpl.test(query)) {
    var selector = query.match(idTpl)[0];
    elems = [context.getElementById(selector.replace(/^#/, ''))];

  // By TAG
  } else if (tagTpl.test(query)) {
    var selector = query.match(tagTpl)[0];
    elems = context.getElementsByTagName(selector);

  // By TAG WITH ATTR
  } else if (tagWithAttrTpl.test(query)) {
    var match = query.match(tagWithAttrTpl);
    var tags = context.getElementsByTagName(match[1]);

    var attr = match[2].replace(/[\[\]]/g, '').split('=');

    var result = [];
    each(tags, function(tag) {
      if (tag.getAttribute(attr[0]) === attr[1]) {
        result[result.length] = tag;
      }
    });

    elems = result;

  } else {
    if (context.getElementsByClassName && classTpl.test(query)) {
      var selector = query.match(classTpl)[0].replace(/\./, '');
      elems = context.getElementsByClassName(selector);
    } else {
      elems = context.querySelectorAll(query)
    }
  }

  return elems;
};

/**
 * Create element
 * @param  {String} tag        Tag of new element
 * @param  {Object} attributes Object of attributes
 * @return {Elem}
 */
var ce = function(tag, attributes) {
  var elem = document.createElement(tag)

  for (var name in attributes) {
    elem[name] = attributes[name];
  }

  return elem;
};

/**
 * Remove element
 * @param  {Elem} elem
 * @return {Elem}
 */
var re = function(elem) {
  return elem.parentNode.removeChild(elem);
};

/**
 * Load js file
 * @param  {String} src
 * @return {Elem}       Script DOM node
 */
var loadjs = function(src) {
  var script = ce('script', {src: src});
  document.getElementsByTagName('head')[0].appendChild(script);
  return script;
};

/**
 * Add event
 * @param  {Elem}     elem
 * @param  {Event}    type
 * @param  {Function} callback
 * @return {Elem}
 */
var on = function(elem, type, callback) {
  return elem.addEventListener(type, callback, false);
};

/**
 * Trim string
 * @param  {String} str
 * @return {String}
 */
var trim = function(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

var addCssClass = function(elem, cssclass) {
  if (elem.classList) {
    return elem.classList.add(cssclass);
  } else {
    return elem.className = elem.className + ' ' + cssclass;
  }
};

var removeCssClass = function(elem, cssclass) {
  if (elem.classList) {
    return elem.classList.remove(cssclass);
  } else {
    var regExp = new RegExp('(^|\\s)' + cssclass + '(\\s|$)', 'g');
    return elem.className = elem.className.replace(regExp, '');
  }
};

var toggleClass = function(elem, cssclass) {
  if (elem.classList) {
    return elem.classList.toggle(cssclass);
  } else {
    var regExp = new RegExp('(^|\\s)' + cssclass + '(\\s|$)', 'g');
    var className = elem.className;
    if (regExp.test(className)) {
      elem.className = className.replace(regExp, '');
    } else {
      addCssClass(elem, cssclass);
    }
  }
};

function Animate(opts) {
  var start = new Date;

  var timer = setInterval(function() {
    var progress = (new Date - start) / opts.duration;
    if (progress > 1) progress = 1;

    // Step
    opts.step(progress);

    if (progress === 1) {
      clearInterval(timer);

      // Callback after animation
      if (opts.end) opts.end();
    }

  }, opts.delay || 10);
}

(function(window, undefined) {

  var createMobileNavigation = function() {
    var nav = ge('nav[role=navigation]')[0];
    var mobile = ce('div', {id: 'mobile_navigation'});

    // Insert mobile navigation after desktop nav
    nav.parentNode.insertBefore(mobile, nav.nextSibling);

    // Create mobile items
    var items = '<select>\n<option value="">Навигация</option>\n';
      var links = ge('a', nav);
      each(links, function(link) {
        var href = link.getAttribute('href');
        var text = link.innerText;
        items += '<option value="' + href + '">&raquo; ' + text + '</option>\n';
        });
      items += '</select>\n';
    mobile.innerHTML = items;

    // Add event to selecting mobile items
    on(ge('select', mobile)[0], 'change', function() {
      window.location.href = this.value;
    });
  };

  // Disqus widget to insert count of comments
  window.DISQUSWIDGETS = function() {
    var disqus = {},
      linksHub = {};

    disqus.getCount = function() {
      var links = ge('.entry-comments a'),
        query = [];

      each(links, function(link, i) {
        var value = link.getAttribute('data-disqus-identifier');
        linksHub[i] = {element: link, type: 1, value: value};
        query[query.length] = i + '=1,' + encodeURIComponent(value);
      });

      loadjs('http://ezhlobo.disqus.com/count.js?q=1&' + query.join('&'));
    };

    disqus.displayCount = function(response) {
      each(response.counts, function(item) {
        linksHub[item.uid].element.innerHTML = '<span>Комментарии</span>: ' + item.comments;
      });
    };

    return disqus;
  }();

  var addShareLinks = function() {
    each(ge('.share42init'), function(item, index) {
      var url = encodeURIComponent(item.getAttribute('data-url'));
      var title = encodeURIComponent(item.getAttribute('data-title'));
      var path = item.getAttribute('data-path');

      title = title.replace('\'','%27');

      var values = [
        '"#" onclick="window.open(\'http://twitter.com/share?text='+title+'&url='+url+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=200, top=200, width=550, height=440, toolbar=0, status=0\');return false" title="Добавить в Twitter"',
        '"#" onclick="window.open(\'http://vk.com/share.php?url='+url+'&title='+title+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=200, top=200, width=554, height=421, toolbar=0, status=0\');return false" title="Поделиться В Контакте"',
        '"#" onclick="window.open(\'http://www.facebook.com/sharer.php?u='+url+'&t='+title+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=200, top=200, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться в Facebook"'
      ];

      var result = '';

      each(values, function(value, index) {
        result += '<a rel="nofollow" style="display:inline-block;vertical-align:bottom;width:16px;height:16px;padding:0;outline:none;background:url('+path+'icons.png) -'+16*index+'px 0 no-repeat" href='+value+' target="_blank"></a>';
      });

      item.innerHTML = result;
    });
  };

  var recentComments = function() {
    var content = ge('#dsq-recentcomments-content')[0];

    // Remove script
    re(ge('script', content)[0]);

    var MakeBetter = function(elem) {
      var that = this;

      // Local Variables
      var meta = ge('.dsq-widget-meta', elem)[0];
      var titlelink = ge('a', meta)[0];

      that.cutTitle = function() {
        var title = trim(titlelink.innerText.replace('- Блог Евгения Жлобо', ''));
        var shorttitle = title.length > 18 ? title.replace(/(.{15}).*/, '$1') + '...' : title.replace(/(.{18}).*/, '$1');

        titlelink.innerHTML = shorttitle;
        titlelink.setAttribute('title', title);
        return that;
      };

      that.correctTitleUrl = function() {
        var href = titlelink.getAttribute('href');

        titlelink.setAttribute('href', href + '#disqus_thread');
        return that;
      };

      that.correctPicLink = function() {
        ge('a', elem)[0].setAttribute('href', titlelink.getAttribute('href'));
        return that;
      };

      that.correctNameLink = function() {
        ge('.dsq-widget-user', elem)[0].setAttribute('href', titlelink.getAttribute('href'));
        return that;
      };

      that.unlinkTime = function() {
        var timelink = ge('a', meta);
        timelink = timelink[timelink.length - 1];
        var text = document.createTextNode(timelink.innerText);

        timelink.parentNode.appendChild(text);
        re(timelink);
      };

      return that;
    };

    each(ge('.dsq-widget-item', content), function(item) {
      new MakeBetter(item)
        .cutTitle()
        .correctTitleUrl()
        .correctPicLink()
        .correctNameLink()
        .unlinkTime();
    });

    ge('#dsq-recentcomments')[0].innerHTML = content.innerHTML;
  };

  var mobileIndexPage = function() {
    var links = ge('.index-expander', ge('#content')[0]);

    each(links, function(link) {
      on(link, 'click', function() {
        var content = this.parentNode.parentNode.nextElementSibling;
        toggleClass(content, 'opened');
      });
    });
  };

  var goTop = function() {
    var separator = ge('#main')[0].offsetTop;
    var $body = document.body;
    var $elem = ge('.gotop')[0];

    var scrollTop = function(value) {
      if (value) {
        // @TODO
        // Make universal for all browsers
        return $body.scrollTop = value;
      } else {
        return (document.documentElement && document.documentElement.scrollTop)
          || ($body && $body.scrollTop);
      }
    };

    var scrolled = function(e) {
      if (scrollTop() > separator) {
        addCssClass($body, 'down');
      } else {
        removeCssClass($body, 'down');
      }
    };

    var pageUp = function() {
      var max = scrollTop(separator);
      Animate({
        duration: 200,
        step: function(x) {
          var value = max - max * Math.pow(x, 1/5);
          scrollTop(value);
        }
      });
    };

    on(window, 'scroll', scrolled);
    on($elem, 'click', pageUp);
  };

  // Let's start
  createMobileNavigation();
  DISQUSWIDGETS.getCount();
  addShareLinks();
  recentComments();
  mobileIndexPage();
  goTop();

})(window);
