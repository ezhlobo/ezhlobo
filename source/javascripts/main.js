/* Hata Framework
 * https://github.com/EvgenyZhlobo/hata */
(function(e,t,n){var r=h,i={},s=function(e,t){if(Array.isArray(e)){var n=0,r=e.length;for(;n<r;n++){if(t.call(e[n],e[n],n)===false)break}}else{var i;for(i in e){if(t.call(e[i],e[i],i)===false)break}}},o={Tag:/^[-_a-z0-9]+$/i,Class:/^\.[-_a-z0-9]+$/i,Id:/^#[-_a-z0-9]+$/i},u=function(e,t){if(!(e.indexOf(t)!==-1)){e.push(t)}return e},a=function(e){return Array.prototype.slice.call(e)},f=false,l=[],c=function(){if(!f){f=true;s(l,function(e,t){l[t]()});l=[]}};t.addEventListener("DOMContentLoaded",c,false);e.addEventListener("load",c,false);var h=function(r,i){if(!(this instanceof h)){return new h(r,i)}if(i!==n){return(new h(i||t)).find(r)}if(!r){this.elems=[];return this}if(r instanceof h){return r}var s=r==="body"?[t.body]:typeof r==="string"?h._query(t,r):r===e||r.nodeType?[r]:a(r);if(s.length===1&&s[0]==null){s.length=0}this.elems=s;return this};h.extend=function(e){s(Array.prototype.slice.call(arguments,1),function(t){s(t,function(t,n){e[n]=t})});return e};h.extend(h,{ready:function(e){if(f){e()}else{l.push(e)}return this},noConflict:function(){if(e.hata===h){e.hata=r}return h},fn:h.prototype,each:s,_query:function(e,n){if(o.Id.test(n)){return[(e.getElementById?e:t).getElementById(n.substr(1))]}if(o.Class.test(n)){return a(e.getElementsByClassName(n.substr(1)))}if(o.Tag.test(n)){return a(e.getElementsByTagName(n))}return a(e.querySelectorAll(n))},_find:function(e,t){if(!t){return e==null?[]:[e]}var n=t.nodeName?[t]:typeof t==="string"?h._query(e,t):[e];return n.length===1&&n[0]==null?[]:n}});h.extend(h.fn,{get:function(e){var t=this.elems;if(e!==n){return t[e<0?t.length+e:e]}return t},eq:function(e){return new h(this.get(e))},is:function(e){return this.filter(e).get().length>0},each:function(e){s(this.get(),e);return this},find:function(e){var t=[];this.each(function(n){var r=0,i=h._find(n,e),s=i.length;while(r<s){u(t,i[r++])}});return new h(t)},closest:function(e){var n,r=[],i=(new h(e)).get();this.each(function(s){n=s;while(n!==t&&i.indexOf(n)<0){n=n.parentNode}if(n!==t||e===t){u(r,n)}});return new h(r)},parents:function(e){var n,r=[],i=(new h(e)).get();this.each(function(e){n=e.parentNode;while(n!==t){if(i.indexOf(n)!==-1){u(r,n)}n=n.parentNode}});return new h(r)},filter:function(e){var t=new h(e),n=[];this.each(function(e){if(t.get().indexOf(e)!==-1){u(n,e)}});return new h(n)}});e.hata=h})(window,window.document);

(function( hata, window, undefined ) {
  hata.fn.parent = function() {
    return hata( this.get( 0 ).parentNode );
  };

  var $ce = function( tagName, attrs ) {
    var elem = document.createElement( tagName );

    for ( var name in attrs ) {
      elem[ name ] = attrs[ name ];
    }

    return hata( elem );
  };

  var $loadjs = function( src ) {
    var script = $ce( "script", {
      src: src
    });

    return document.getElementsByTagName( "head" )[ 0 ].appendChild( script.get( -1 ) );
  };

  // Disqus widget to insert count of comments
  window.DISQUSWIDGETS = function() {
    var disqus = linksHub = {};

    disqus.getCount = function() {
      var links = hata( ".article_footer_comments" ).find( "a" ),
        query = [];

      links.each(function( link, i ) {
        var value = link.getAttribute( "data-disqus-identifier" );

        linksHub[ i ] = {
          element: link,
          type: 1,
          value: value
        };

        query[ query.length ] = i + "=1," + encodeURIComponent( value );
      });

      $loadjs( "http://ezhlobo.disqus.com/count.js?q=1&" + query.join( "&" ) );
    };

    var addCommentsCount = function( item ) {
      hata( linksHub[ item.uid ].element ).parent().find( "small" ).get( 0 ).innerHTML = item.comments;
    };

    disqus.displayCount = function( response ) {
      hata.each( response.counts, addCommentsCount );
    };

    return disqus;
  }();

  DISQUSWIDGETS.getCount();

}( hata, window ));
