/* HataJS (c) 2013 github.com/EvgenyZhlobo/hata */
(function(g,e,m){var p=c,l=!1,h=[],n=function(){if(!l){l=!0;for(var a=0,b=h.length;a<b;a++)h[a]();h=[]}},q=/^[-_a-z0-9]+$/i,r=/^\.[-_a-z0-9]+$/i,s=/^#[-_a-z0-9]+$/i,j=function(a,b){0<=a.indexOf(b)||a.push(b);return a},k=function(a){return Array.prototype.slice.call(a)},c=function(a,b){if(!(this instanceof c))return new c(a,b);if(b!==m)return(new c(b||e)).find(a);if(!a)return this.elems=[],this;if(a instanceof c)return a;var d="body"===a?[e.body]:"string"===typeof a?c._query(e,a):a===g||a.nodeType?[a]:k(a);1===d.length&&null==d[0]&&(d.length=0);this.elems=d;return this};c.extend=function(a,b){b||(b=a,a=c.prototype);for(var d in b)hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a};e.addEventListener("DOMContentLoaded",n,!1);g.addEventListener("load",n,!1);c.extend(c,{ready:function(a){l?a():h.push(a);return this},noConflict:function(){g.hata===c&&(g.hata=p);return c},_query:function(a,b){return s.test(b)?[a.getElementById(b.substr(1))]:r.test(b)?k(a.getElementsByClassName(b.substr(1))):q.test(b)?k(a.getElementsByTagName(b)):k(a.querySelectorAll(b))},_find:function(a,b){if(!b)return null==a?[]:[a];var d=b.nodeName?[b]:"string"===typeof b?c._query(a,b):[a];return 1===d.length&&null==d[0]?[]:d}});c.extend({get:function(a){var b=this.elems;return a!==m?b[0>a?b.length+a:a]:b},eq:function(a){return new c(this.get(a))},is:function(a){return 0<this.filter(a).get().length},each:function(a){for(var b,d=this.get(),c=0;c<d.length&&!(b=a.call(d[c],d[c],c),!1===b);c++);return this},find:function(a){var b=[];this.each(function(d){var f=0;d=c._find(d,a);for(var e=d.length;f<e;)j(b,d[f++])});return new c(b)},closest:function(a){var b,d=[],f=(new c(a)).get();this.each(function(c){for(b=c;b!==e&&0>f.indexOf(b);)b=b.parentNode;(b!==e||a===e)&&j(d,b)});return new c(d)},parents:function(a){var b,d=[],f=(new c(a)).get();this.each(function(a){for(b=a.parentNode;b!==e;)-1<f.indexOf(b)&&j(d,b),b=b.parentNode});return new c(d)},filter:function(a){var b=new c(a),d=[];this.each(function(a){0<=b.get().indexOf(a)&&j(d,a)});return new c(d)}});g.hata=c})(window,window.document);

var nativeForEach = Array.prototype.forEach,
  breaker = {};

Array.prototype.each = function( iterator, context ) {
  if ( nativeForEach && this.forEach === nativeForEach ) {
    this.forEach( iterator, context );
  } else if ( this.length === +this.length ) {
    for ( var i = 0, l = this.length; i < l; i++ ) {
      if ( iterator.call( context, this[i], i, this ) === breaker ) return;
    }
  }
};

(function( hata ) {
  hata.extend({
    each: function( iterator ) {
      this.get().each( iterator );
      return this;
    },
    bind: function( eventType, callback ) {
      return this.each(function( elem ) {
        elem.addEventListener( eventType, callback, false );
      });
    },
    remove: function() {
      return this.each(function( elem ) {
        elem.parentNode.removeChild( elem )
      });
    },
    html: function( html ) {
      if ( html ) {
        return this.each(function( elem ) {
          elem.innerHTML = html;
        });
      } else {
        return this.get( -1 ).innerHTML;
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
}( hata ));

(function( window, undefined ) {
  // Create elements
  var $ce = function( tagName, attrs ) {
    var elem = document.createElement( tagName );
    for ( var name in attrs ) {
      elem[name] = attrs[name];
    }
    return hata(elem);
  };

  // Load js file
  var $loadjs = function( src ) {
    var script = $ce('script', {
      src: src
    });
    return document.getElementsByTagName('head')[0].appendChild( script.get(-1) );
  };

  // @TODO
  // Automatic step function
  var Animate = function( opts ) {
    var start = new Date;

    var timer = setInterval(function() {
      var progress = ( new Date - start ) / opts.duration;
      if ( progress > 1 ) {
        progress = 1;
      }

      opts.step( progress );

      if ( progress === 1 ) {
        clearInterval( timer );
      }

    }, opts.delay || 10 );
  };

  var createMobileNavigation = function() {
    var $nav = hata('nav[role=navigation]');
    var $mobile = $ce('div', {
      id: 'mobile_navigation'
    });

    // Insert mobile navigation after desktop nav
    $nav.get(0).parentNode.insertBefore( $mobile.get(0), $nav.get(0).nextSibling );

    // Create mobile items
    var items = '<select>\n<option value="">Навигация</option>\n';
    $nav.find('a').each(function( link ) {
      var href = link.getAttribute('href');
      var text = link.text;
      items += '<option value="' + href + '">&raquo; ' + text + '</option>\n';
    });
    items += '</select>\n';

    $mobile.html( items );

    // Add event to selecting mobile items
    $mobile.find('select').bind('change', function() {
      window.location.href = this.value;
    });
  };

  // Disqus widget to insert count of comments
  window.DISQUSWIDGETS = function() {
    var disqus = {},
      linksHub = {};

    disqus.getCount = function() {
      var links = hata('.entry-comments a'),
        query = [];

      links.each(function( link, i ) {
        var value = link.getAttribute('data-disqus-identifier');
        linksHub[i] = {
          element: link,
          type: 1,
          value: value
        };
        query[query.length] = i + '=1,' + encodeURIComponent(value);
      });

      $loadjs('http://ezhlobo.disqus.com/count.js?q=1&' + query.join('&'));
    };

    var addCommentsCount = function( item ) {
      linksHub[item.uid].element.innerHTML = '<span>Комментарии</span>: ' + item.comments;
    };

    disqus.displayCount = function( response ) {
      response.counts.each( addCommentsCount );
    };

    return disqus;
  }();

  var addShareLinks = function() {
    hata('.share42init').each(function( item, index ) {
      var url = encodeURIComponent( item.getAttribute('data-url') ),
        title = encodeURIComponent( item.getAttribute('data-title') ),
        path = item.getAttribute('data-path');

      title = title.replace('\'', '%27');

      var values = [
        '"#" onclick="window.open(\'http://twitter.com/share?text='+title+'&url='+url+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=200, top=200, width=550, height=440, toolbar=0, status=0\');return false" title="Добавить в Twitter"',
        '"#" onclick="window.open(\'http://vk.com/share.php?url='+url+'&title='+title+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=200, top=200, width=554, height=421, toolbar=0, status=0\');return false" title="Поделиться В Контакте"',
        '"#" onclick="window.open(\'http://www.facebook.com/sharer.php?u='+url+'&t='+title+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=200, top=200, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться в Facebook"'
      ];

      var result = '';

      values.each(function( value, index ) {
        result += '<a rel="nofollow" style="display:inline-block;vertical-align:bottom;width:16px;height:16px;padding:0;outline:none;background:url('+path+'icons.png) -'+16*index+'px 0 no-repeat" href='+value+' target="_blank"></a>';
      });

      item.innerHTML = result;
    });
  };

  var recentComments = function() {
    var $items = hata('#dsq-recentcomments-content').remove().find('.dsq-widget-item'),

      html = '<ul class="dsq-widget-list">',

      addNewItem = function( item ) {
        var $item = hata(item),
          $metaLinks = $item.find('.dsq-widget-meta').find('a'),

          avatarUrl = $item.find('.dsq-widget-avatar').get(0).getAttribute('src'),
          authorName = $item.find('.dsq-widget-user').get(0).text,
          commentText = $item.find('.dsq-widget-comment').html(),
          postLink = $metaLinks.get(0).getAttribute('href') + '#disqus_thread',
          postTitle = $metaLinks.get(0).text.replace(' - Блог Евгения Жлобо', ''),
          commentDate = $metaLinks.get(-1).text;

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

    hata('#dsq-recentcomments').html(html);
  };

  var mobileIndexPage = function() {
    var clicked = function() {
      hata(this.parentNode.parentNode.nextElementSibling).toggleClass('opened');
    };

    hata('#content').find('.index-expander').each(function( link ) {
      hata(link).bind('click', clicked);
    });
  };

  var goTop = function() {
    var $body = document.body,

      separator = hata('#main').get(0).offsetTop,

      scrollTop = function( value ) {
        if ( value !== undefined ) {
          if ( parseInt( document.documentElement.scrollTop ) === 0 ) {
            return $body.scrollTop = value;
          } else {
            return document.documentElement.scrollTop = value;
          }
        } else {
          return (document.documentElement && document.documentElement.scrollTop) || ($body && $body.scrollTop);
        }
      };

    var scrolled = function( e ) {
      if ( scrollTop() > separator ) {
        $body.classList.add('down');
      } else {
        $body.classList.remove('down');
      }
    };

    var pageUp = function() {
      var max = scrollTop(separator);
      Animate({
        duration: 200,
        step: function( x ) {
          var value = max - max * Math.pow( x, 1/5 );
          scrollTop( value );
        }
      });
    };

    // Fix opera issue:
    // Opera don't scroll when page reloaded
    scrolled();

    hata(window).bind('scroll', scrolled);
    hata('.gotop').bind('click', pageUp);
  };

  // Let's start
  createMobileNavigation();
  DISQUSWIDGETS.getCount();
  addShareLinks();
  recentComments();
  mobileIndexPage();

  var isMobile = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);

  if ( !isMobile ) {
    goTop();
  }

})( window );
