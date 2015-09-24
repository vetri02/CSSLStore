//Move to a include - localstorage support for CSS
    window.careCSSLocStore = (function(window) {
      var
      KEY_PREFIX = "carecss-",
      localStorage = window.localStorage || null,
      get = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function (e) {
          if (xhr.readyState === 4) {
            callback(xhr.responseText);
          }
        };
        xhr.send();
      },
      insertStyle = function(text) {
        // var style = document.createElement("style"),
        //  head = document.getElementsByTagName("head")[0];
        // style.type = "text/css";
        // style.appendChild(document.createTextNode(text));
        //head.appendChild(style);
        var style = '<style type="text/css">' + text + '</style>';
        document.write(style);
        return;
      }
      return {
        style: function(path) {
          var key = KEY_PREFIX + path,
            css;
          try{
            if (localStorage && localStorage[key]) {
              // insertStyle(localStorage[key]);
              css = '<style type="text/css">' + localStorage[key] + '</style>';
              document.write(css);
            } else {
              get(path, function(text) {
                if (localStorage) {
                  localStorage[key] = text;
                }
                insertStyle(text);
              });
            }
          }catch(err){
            document.write('<link type="text/css" rel="stylesheet" href="'+careConfig.cdnURL+path+'?v='+versionNumber+'" />');
          }
          return this;
        },
        remove: function(paths) {
          var i, key;
          for (i = 0; i < paths.length; i++) {
            key = KEY_PREFIX + paths[i];
            localStorage.removeItem(key);
          }
        }
      };
    })(window);
      for (var key in localStorage){
        /* remove script from locStor if the version changes */
        if(key.indexOf('carecss') !== -1 && key.substr(key.indexOf("v=")+2, key.length) !== versionNumber){
          localStorage.removeItem(key);
        }

        /* only for dev this should be true*/
        // localStorage.removeItem(key);
      }
      careCSSLocStore.style("/css/mobile/bootstrap3/css/bootstrap.css?v="+versionNumber);
