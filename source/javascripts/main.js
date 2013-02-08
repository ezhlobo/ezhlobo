/**
 * Hata framework
 * @see https://github.com/EvgenyZhlobo/hata
 */
(function(e,t,n){var r=a,i={},s={Tag:/^[-_a-z0-9]+$/i,Class:/^\.[-_a-z0-9]+$/i,Id:/^#[-_a-z0-9]+$/i},o=function(e,t){if(!(e.indexOf(t)>=0)){e[e.length]=t}return e},u=function(e){return Array.prototype.slice.call(e)},a=function(r,i){if(!(this instanceof a)){return new a(r,i)}if(i!==n){return(new a(i||t)).find(r)}if(!r){this.elems=[t];return this}var s=r==="body"?[t.body]:typeof r==="string"?a._query(t,r):r===e||r.nodeType?[r]:r instanceof a?u(r.elems):u(r);if(s.length===1&&s[0]==null){s.length=0}this.elems=s;return this};a._query=function(e,t){if(s.Id.test(t)){return[e.getElementById(t.substr(1))]}if(s.Class.test(t)){return u(e.getElementsByClassName(t.substr(1)))}if(s.Tag.test(t)){return u(e.getElementsByTagName(t))}return u(e.querySelectorAll(t))};a._find=function(e,t){if(!t){return e==null?[]:[e]}var n=t.nodeName?[t]:typeof t==="string"?a._query(e,t):[e];return n.length===1&&n[0]==null?[]:n};a.extend=function(e,t){if(!t){t=e;e=a.prototype}for(var n in t){if(hasOwnProperty.call(t,n)){e[n]=t[n]}}return e};a.extend({get:function(e){var t=this.elems;if(e!==n){var r=e<0?t.length+e:e;return t[r]}return t},eq:function(e){return new a(this.get(e))},is:function(e){return this.filter(e).get().length>0},each:function(e){return this.elems.forEach(e.bind(this))},find:function(e){var t=[];this.each(function(n){var r=0,i=a._find(n,e),s=i.length;while(r<s){o(t,i[r++])}});return new a(t)},closest:function(e){var n,r=[],i=(new a(e)).get();this.each(function(e){n=e;while(n!==t&&i.indexOf(n)<0){n=n.parentNode}o(r,n)});return new a(r)},filter:function(e){var t=new a(e),n=[];this.each(function(e){if(t.get().indexOf(e)>=0){o(n,e)}});return new a(n)}});e.hata=a;a.noConflict=function(){if(e.hata===a){e.hata=r}return a}})(window,window.document)

var nativeForEach = Array.prototype.forEach,
  breaker = {};

Array.prototype.each = function(iterator, context) {
  if ( nativeForEach && this.forEach === nativeForEach ) {
    this.forEach( iterator, context );
  } else if ( this.length === +this.length ) {
    for ( var i = 0, l = this.length; i < l; i++ ) {
      if ( iterator.call( context, this[i], i, this ) === breaker ) return;
    }
  }
};

hata.extend({
  each: function( iterator ) {
    this.get().each( iterator );
    return this;
  },
  bind: function(eventType, callback) {
    this.each(function(elem) {
      elem.addEventListener(eventType, callback, false);
    });
    return this;
  },
  remove: function() {
    this.each(function(elem) {
      elem.parentNode.removeChild(elem)
    });
    return this;
  },
  html: function(html) {
    if (html) {
      this.each(function(elem) {
        elem.innerHTML = html;
      });
      return this;
    } else {
      return this.get(-1).innerHTML;
    }
  },
  toggleClass: function( className ) {
    return this.each(function( elem ) {
      if ( elem.classList ) {
        elem.classList.toggle( className );
      } else {
        var current = elem.className;
        var currentArr = current.split(' ');
        if ( currentArr.indexOf( className ) === -1 ) {
          elem.className = current + ' ' + className;
        } else {
          currentArr.splice( currentArr.indexOf(className), 1)
          elem.className = currentArr.join(' ');
        }
      }
    });
  }
});

var $ = hata.noConflict();

(function(window, undefined) {
  // Create elements
  var $ce = function(tagName, attrs) {
    var elem = document.createElement(tagName);
    for (var name in attrs) elem[name] = attrs[name];
    return $(elem);
  };

  // Load js file
  var $loadjs = function(src) {
    var script = $ce('script', {src: src}).get(0);
    return document.getElementsByTagName('head')[0].appendChild(script);
  };

  // @TODO
  // Automatic step function
  var Animate = function(opts) {
    var start = new Date;

    // Before animating
    if (opts.start) opts.start();

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
  };

  var createMobileNavigation = function() {
    var $nav = $('nav[role=navigation]');
    var $mobile = $ce('div', {id: 'mobile_navigation'});

    // Insert mobile navigation after desktop nav
    $nav.get(0).parentNode.insertBefore($mobile.get(0), $nav.get(0).nextSibling);

    // Create mobile items
    var items = '<select>\n<option value="">Навигация</option>\n';
    $nav.find('a').each(function(link) {
      var href = link.getAttribute('href');
      var text = link.text;
      items += '<option value="' + href + '">&raquo; ' + text + '</option>\n';
    });
    items += '</select>\n';

    $mobile.html(items);

    // Add event to selecting mobile items
    $mobile.find('select').bind('change', function() {
      window.location.href = this.value;
    });
  };

  // Disqus widget to insert count of comments
  window.DISQUSWIDGETS = function() {
    var disqus = {}, linksHub = {};

    disqus.getCount = function() {
      var links = $('.entry-comments a'), query = [];

      links.each(function(link, i) {
        var value = link.getAttribute('data-disqus-identifier');
        linksHub[i] = {element: link, type: 1, value: value};
        query[query.length] = i + '=1,' + encodeURIComponent(value);
      });

      $loadjs('http://ezhlobo.disqus.com/count.js?q=1&' + query.join('&'));
    };

    var addCommentsCount = function(item) {
      linksHub[item.uid].element.innerHTML = '<span>Комментарии</span>: ' + item.comments;
    };

    disqus.displayCount = function(response) {
      response.counts.each(addCommentsCount);
    };

    return disqus;
  }();

  var addShareLinks = function() {
    $('.share42init').each(function(item, index) {
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

      values.each(function(value, index) {
        result += '<a rel="nofollow" style="display:inline-block;vertical-align:bottom;width:16px;height:16px;padding:0;outline:none;background:url('+path+'icons.png) -'+16*index+'px 0 no-repeat" href='+value+' target="_blank"></a>';
      });

      item.innerHTML = result;
    });
  };

  var recentComments = function() {
    var $items = $('#dsq-recentcomments-content').remove().find('.dsq-widget-item');

    var html = '<ul class="dsq-widget-list">';

    var addNewItem = function(item) {
      var $item = $(item);
      var $metaLinks = $item.find('.dsq-widget-meta').find('a');

      var avatarUrl = $item.find('.dsq-widget-avatar').get(0).getAttribute('src');
      var authorName = $item.find('.dsq-widget-user').get(0).text;
      var commentText = $item.find('.dsq-widget-comment').html();
      var postLink = $metaLinks.get(0).getAttribute('href') + '#disqus_thread';
      var postTitle = $metaLinks.get(0).text.replace(' - Блог Евгения Жлобо', '');
      var commentDate = $metaLinks.get(-1).text;

      html += '<li class="dsq-widget-item">';
        html += '<a href="' + postLink + '" class="dsq-widget-user">'
          html += '<img src="' + avatarUrl + '" alt="Аватар ' + authorName + '" class="dsq-widget-avatar">';
          html += authorName;
        html += '</a> ';
        html += '<span class="dsq-widget-comment">';
          html += commentText;
        html += '</span>';
        html += '<p class="dsq-widget-meta">';
          html += '<a href="' + postLink + '" title="' + postTitle + '">' + postTitle + '</a>';
          html += '&nbsp;·&nbsp;' + commentDate;
        html += '</p>';
      html += '</li>';
    };

    $items.each(addNewItem);

    html += '</ul>';

    $('#dsq-recentcomments').html(html);
  };

  var mobileIndexPage = function() {
    var clicked = function() {
      $(this.parentNode.parentNode.nextElementSibling).toggleClass('opened');
    };

    $('#content').find('.index-expander').each(function(link) {
      $(link).bind('click', clicked);
    });
  };

  var goTop = function() {
    var $body = document.body;

    var separator = $('#main').get(0).offsetTop;

    var scrollTop = function(value) {
      if (value !== undefined) {
        if (parseInt(document.documentElement.scrollTop) === 0) {
          return $body.scrollTop = value;
        } else {
          return document.documentElement.scrollTop = value;
        }
      } else {
        return (document.documentElement && document.documentElement.scrollTop)
          || ($body && $body.scrollTop);
      }
    };

    var scrolled = function(e) {
      if (scrollTop() > separator) {
        $body.classList.add('down');
      } else {
        $body.classList.remove('down');
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

    // Fix opera issue:
    // Opera don't scroll when page reloaded
    scrolled();

    $(window).bind('scroll', scrolled);
    $('.gotop').bind('click', pageUp);
  };

  var isMobile = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);

  // Let's start
  createMobileNavigation();
  DISQUSWIDGETS.getCount();
  addShareLinks();
  recentComments();
  mobileIndexPage();

  if (!isMobile) {
    goTop();
  }

})(window);
