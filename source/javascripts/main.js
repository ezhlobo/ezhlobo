/**
 * elems.js
 * @see https://gist.github.com/4598604
 */
var breaker={};var $each=function(e,t,n){if(Array.prototype.forEach&&e.forEach===Array.prototype.forEach){e.forEach(t,n)}else if(e.length===+e.length){for(var r=0,i=e.length;r<i;r++){if(t.call(n,e[r],r,e)===breaker)return}}else{for(var s in e){if(e.hasOwnProperty(s)){if(t.call(n,e[s],s,e)===breaker)return}}}};var TPL={start:"^\\s*",end:"\\s*$",tag:"([0-9a-z\\-_]+)",attr:"(\\[[a-z]+=[a-z]+\\])",flag:"i",ID:new RegExp(this.start+"#"+this.tag+this.end,this.flag),ONETAG:new RegExp(this.start+this.tag+this.end,this.flag),TAGWITHATTR:new RegExp(this.start+this.tag+this.attr+this.end,this.flag),CLASS:new RegExp(this.start+"\\."+this.tag+this.end,this.flag)};var $ge=function(e,t){var t=t||document,n;if(TPL.ID.test(e)){var r=e.match(TPL.ID)[0];n=[t.getElementById(r.replace(/^#/,""))]}else if(TPL.ONETAG.test(e)){var r=e.match(TPL.ONETAG)[0];n=t.getElementsByTagName(r)}else if(TPL.TAGWITHATTR.test(e)){var i=e.match(TPL.TAGWITHATTR);var s=t.getElementsByTagName(i[1]);var o=i[2].replace(/[\[\]]/g,"").split("=");var u=[];$each(s,function(e){if(e.getAttribute(o[0])===o[1]){u[u.length]=e}});n=u}else{if(t.getElementsByClassName&&TPL.CLASS.test(e)){var r=e.match(TPL.CLASS)[0].replace(/\./,"");n=t.getElementsByClassName(r)}else{n=t.querySelectorAll(e)}}return n};var $ce=function(e,t){var n=document.createElement(e);for(var r in t){n[r]=t[r]}return n};var $re=function(e){return e.parentNode.removeChild(e)};var $addCssClass=function(e,t){if(e.classList){return e.classList.add(t)}else{return e.className=e.className+" "+t}};var $removeCssClass=function(e,t){if(e.classList){return e.classList.remove(t)}else{var n=new RegExp("(^|\\s)"+t+"(\\s|$)","g");return e.className=e.className.replace(n,"")}};var $toggleClass=function(e,t){if(e.classList){return e.classList.toggle(t)}else{var n=new RegExp("(^|\\s)"+t+"(\\s|$)","g");var r=e.className;if(n.test(r)){e.className=r.replace(n,"")}else{e.className=r+" "+t}return e}};var $setStyle=function(e,t){for(var n in t){e.style[n]=t[n]}return e};

/**
 * Trim string
 * @param  {String} str
 * @return {String}
 */
var $trim = function(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

/**
 * Add event
 * @param  {Elem}     elem
 * @param  {Event}    type
 * @param  {Function} callback
 * @return {Elem}
 */
var $on = function(elem, type, callback) {
  return elem.addEventListener(type, callback, false);
};

/**
 * Load js file
 * @param  {String} src Url to script
 * @return {Elem}       Script DOM node
 */
var $loadjs = function(src) {
  var script = $ce('script', {src: src});
  document.getElementsByTagName('head')[0].appendChild(script);
  return script;
};

function Animate(opts) {
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
}

(function(window, undefined) {

  var createMobileNavigation = function() {
    var nav = $ge('nav[role=navigation]')[0];
    var mobile = $ce('div', {id: 'mobile_navigation'});

    // Insert mobile navigation after desktop nav
    nav.parentNode.insertBefore(mobile, nav.nextSibling);

    // Create mobile items
    var items = '<select>\n<option value="">Навигация</option>\n';
      var links = $ge('a', nav);
      $each(links, function(link) {
        var href = link.getAttribute('href');
        var text = link.innerText;
        items += '<option value="' + href + '">&raquo; ' + text + '</option>\n';
        });
      items += '</select>\n';
    mobile.innerHTML = items;

    // Add event to selecting mobile items
    $on($ge('select', mobile)[0], 'change', function() {
      window.location.href = this.value;
    });
  };

  // Disqus widget to insert count of comments
  window.DISQUSWIDGETS = function() {
    var disqus = {},
      linksHub = {};

    disqus.getCount = function() {
      var links = $ge('.entry-comments a'),
        query = [];

      $each(links, function(link, i) {
        var value = link.getAttribute('data-disqus-identifier');
        linksHub[i] = {element: link, type: 1, value: value};
        query[query.length] = i + '=1,' + encodeURIComponent(value);
      });

      $loadjs('http://ezhlobo.disqus.com/count.js?q=1&' + query.join('&'));
    };

    disqus.displayCount = function(response) {
      $each(response.counts, function(item) {
        linksHub[item.uid].element.innerHTML = '<span>Комментарии</span>: ' + item.comments;
      });
    };

    return disqus;
  }();

  var addShareLinks = function() {
    $each($ge('.share42init'), function(item, index) {
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

      $each(values, function(value, index) {
        result += '<a rel="nofollow" style="display:inline-block;vertical-align:bottom;width:16px;height:16px;padding:0;outline:none;background:url('+path+'icons.png) -'+16*index+'px 0 no-repeat" href='+value+' target="_blank"></a>';
      });

      item.innerHTML = result;
    });
  };

  var recentComments = function() {
    var $content = $ge('#dsq-recentcomments-content')[0];
    var $items = $ge('.dsq-widget-item', $content);

    var html = '<ul class="dsq-widget-list">';

    $each($items, function(item) {
      var $meta = $ge('.dsq-widget-meta', item)[0];
      var $firstMetaLink = $ge('a', $meta)[0];

      var avatarUrl = $ge('.dsq-widget-avatar', item)[0].getAttribute('src');
      var authorName = $ge('.dsq-widget-user', item)[0].innerText;
      var commentText = $ge('.dsq-widget-comment', item)[0].innerHTML;
      var postLink = $firstMetaLink.getAttribute('href') + '#disqus_thread';
      var postTitle = $firstMetaLink.innerText.replace(' - Блог Евгения Жлобо', '');
      var commentDate = $ge('a', $meta)[1].innerText;

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
    });

    html += '</ul>';

    $re($content);
    $ge('#dsq-recentcomments')[0].innerHTML = html;
  };

  var mobileIndexPage = function() {
    var links = $ge('.index-expander', $ge('#content')[0]);

    $each(links, function(link) {
      $on(link, 'click', function() {
        var block = this.parentNode.parentNode.nextElementSibling;
        $toggleClass(block, 'opened');
      });
    });
  };

  var goTop = function() {
    var separator = $ge('#main')[0].offsetTop;
    var $body = document.body;
    var $elem = $ge('.gotop')[0];

    var scrollTop = function(value) {
      if (value) {
        // @TODO: Make universal for all browsers
        return $body.scrollTop = value;
      } else {
        return (document.documentElement && document.documentElement.scrollTop)
          || ($body && $body.scrollTop);
      }
    };

    var scrolled = function(e) {
      if (scrollTop() > separator) {
        $addCssClass($body, 'down');
      } else {
        $removeCssClass($body, 'down');
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

    $on(window, 'scroll', scrolled);
    $on($elem, 'click', pageUp);
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
