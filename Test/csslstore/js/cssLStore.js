window.CSSLStore = (function(window, keyPrefix) {

  var keyPrefix = keyPrefix || 'CSSLStore-', // keyprefix for localstorage key
    localStorage = window.localStorage || null, //check if localstorage is there
    called = false,

    getCSS = function(urlpath, callback) {

      cssurl = urlpath;
      // load me some stylesheet
      var urlpath = urlpath,
        head = document.getElementsByTagName('head')[0];
      link = document.createElement('link');

      link.type = "text/css";
      link.rel = "stylesheet"
      link.href = urlpath;

      // MAGIC
      // #1
      link.onload = function() {
        CSSDone('onload listener', callback);

      }
      // #2
      if (link.addEventListener) {
        link.addEventListener('load', function() {
          CSSDone("DOM's load event", callback);
        }, false);

      }
      // #3
      link.onreadystatechange = function() {
        var state = link.readyState;
        if (state === 'loaded' || state === 'complete') {
          link.onreadystatechange = null;
          CSSDone("onreadystatechange", callback);

        }
      };

      // #4
      var cssnum = document.styleSheets.length;
      var ti = setInterval(function() {
        if (document.styleSheets.length > cssnum) {
          // needs more work when you load a bunch of CSS files quickly
          // e.g. loop from cssnum to the new length, looking
          // for the document.styleSheets[n].href === url
          // ...

          // FF changes the length prematurely :()
          CSSDone('listening to styleSheets.length change', callback);
          clearInterval(ti);

        }
      }, 10);



      head.appendChild(link);


      // #5 - FF
      var isFF = /Firefox/.test(navigator.userAgent);
      if (!isFF) {
        return;
      }

      var style = document.createElement('style');
      style.textContent = '@import "' + urlpath + '"';

      var fi = setInterval(function() {
        try {
          style.sheet.cssRules; // only populated when file is loaded
          CSSDone('listening to @import-ed cssRules');
          clearInterval(fi);

        } catch (e) {}
      }, 10);

      head.appendChild(style);

    },

    readCSS = function() {
      var cssArr = [];

      //replace jquery function !!!!!

      $.each(document.styleSheets, function(sheetIndex, sheet) {
        console.log(sheet.href);

        if (cssurl == sheet.href) {
          $.each(sheet.cssRules || sheet.rules, function(ruleIndex, rule) {
            console.log(rule.cssText);

            cssArr.push(rule.cssText);
          });
        }

      });

      console.log(typeof(cssArr.join()))
      return cssArr.join('\n');
    },

    insertCSS = function(text) {
      var style = '<style type="text/css">' + text + '</style>';
      document.write(style);
      return;
    },

    CSSDone = function(msg, callback) {
      if (called == false) {
        console.log(msg);
        callback(readCSS());
      }
      called = true;
      return;
    }

  return {

    setCSS: function(url) {
      var key = keyPrefix + url,
        css;
      try {
        if (localStorage && localStorage[key]) {
          insertCSS(localStorage[key]);
        } else {
          getCSS(url, function(text) {
            if (localStorage) {
              localStorage[key] = text;
            }
            //
          });
        }
      } catch (err) {
        document.write('<link type="text/css" rel="stylesheet" href="' + url + '" />');
      }
      return this;

    },

    removeCSS: function() {
      var i, key;
      for (i = 0; i < paths.length; i++) {
        key = keyPrefix + paths[i];
        localStorage.removeItem(key);
      }
    }
  };

})(window);

CSSLStore.setCSS(window.location.href + "/css/bootstrap.min.css");