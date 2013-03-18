/* Hata.js framework (c) 2013 */
(function(e,t,n){var r=h,i={},s=false,o=[],u=function(e,t){if(Array.isArray(e)){for(var n=0,r=e.length;n<r;n++){if(t.call(e[n],e[n],n)===false)break}}else{for(var i in e){if(t.call(e[i],e[i],i)===false)break}}},a=function(){if(!s){s=true;u(o,function(e,t){o[t]()});o=[]}},f={Tag:/^[-_a-z0-9]+$/i,Class:/^\.[-_a-z0-9]+$/i,Id:/^#[-_a-z0-9]+$/i},l=function(e,t){if(!(e.indexOf(t)>=0)){e.push(t)}return e},c=function(e){return Array.prototype.slice.call(e)},h=function(r,i){if(!(this instanceof h)){return new h(r,i)}if(i!==n){return(new h(i||t)).find(r)}if(!r){this.elems=[];return this}if(r instanceof h){return r}var s=r==="body"?[t.body]:typeof r==="string"?h._query(t,r):r===e||r.nodeType?[r]:c(r);if(s.length===1&&s[0]==null){s.length=0}this.elems=s;return this};h.extend=function(e){u(Array.prototype.slice.call(arguments,1),function(t){u(t,function(t,n){e[n]=t})});return e};t.addEventListener("DOMContentLoaded",a,false);e.addEventListener("load",a,false);h.extend(h,{ready:function(e){if(s){e()}else{o.push(e)}return this},noConflict:function(){if(e.hata===h){e.hata=r}return h},fn:h.prototype,each:u,_query:function(e,n){if(f.Id.test(n)){return[(e.getElementById?e:t).getElementById(n.substr(1))]}if(f.Class.test(n)){return c(e.getElementsByClassName(n.substr(1)))}if(f.Tag.test(n)){return c(e.getElementsByTagName(n))}return c(e.querySelectorAll(n))},_find:function(e,t){if(!t){return e==null?[]:[e]}var n=t.nodeName?[t]:typeof t==="string"?h._query(e,t):[e];return n.length===1&&n[0]==null?[]:n}});h.extend(h.fn,{get:function(e){var t=this.elems;if(e!==n){var r=e<0?t.length+e:e;return t[r]}return t},eq:function(e){return new h(this.get(e))},is:function(e){return this.filter(e).get().length>0},each:function(e){u(this.get(),e);return this},find:function(e){var t=[];this.each(function(n){var r=0,i=h._find(n,e),s=i.length;while(r<s){l(t,i[r++])}});return new h(t)},closest:function(e){var n,r=[],i=(new h(e)).get();this.each(function(s){n=s;while(n!==t&&i.indexOf(n)<0){n=n.parentNode}if(n!==t||e===t){l(r,n)}});return new h(r)},parents:function(e){var n,r=[],i=(new h(e)).get();this.each(function(e){n=e.parentNode;while(n!==t){if(i.indexOf(n)>-1){l(r,n)}n=n.parentNode}});return new h(r)},filter:function(e){var t=new h(e),n=[];this.each(function(e){if(t.get().indexOf(e)>=0){l(n,e)}});return new h(n)}});e.hata=h})(window,window.document);

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
  hata.extend( hata.fn, {
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
