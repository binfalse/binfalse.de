---
title: "Window Open Features: Restrict and Test"
layout: post
published: true
date: 2020-03-05 08:33:11 +0100
categories:
  - administration
  - config
  - howto
  - javascript
  - html
  - programming
  - software
  - website
  - web
tags:
  - javascript
  - mozilla 
  - demo
  - config
  - firefox
  - programming
  - trick
  - userinteraction
  - web
---

Are you also annoyed by websites that open popups and external windows without your menu bar? And without scrollbars and no close button and ... and .. and..

## Restrict Window Open Features

Don't worry, you can disable these "features"!
In Firefox, open [about:config](about:config) and search for `dom.disable_window_open_feature` (see [@azure's pleroma post](https://pleroma.site/notice/9sfjyFYxWIdEMexkYa)).
Full documentation on these settings are available through [MozillaZine](http://kb.mozillazine.org/Prevent_websites_from_disabling_new_window_features).
These preferences can also be [set (and locked) system wide](kb.mozillazine.org/Locking_preferences), which may be useful for multi-user and multi-system environments


## Test Window Open Features

[Mozilla's Developer portal has a documentation on possible Window Open Features](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Window_features).
There you can learn which features are available, what they mean, and how to set them.

Testing is then pretty easy.
The following checkboxes allow for enabling/disabling most useful window features.
If a box is ticked, the corresponding feature will be set; if it's unticked the feature will be turned off.
You can then click the link below to test how your browser behaves when opening this blog using the chosen set of features.



<ul id="settings">
</ul>

<script type="text/javascript">
    var ul = document.getElementById("settings");
    var windowRef = null;
    var settings = {
        "menubar": "Menu Bar",
        "toolbar": "Navigation Toolbar (Back, Forward, Reload, Stop...)",
        "scrollbars": "Scroll Bars",
        "resizable": "Resizable",
        "status": "Status Bar",
        "personalbar": "Personal Toolbar / Bookmarks / Site Navigation Ba",
        "location": "Location Bar",
        "fullscreen": "Open in Fullscreen (not implemented in many browsers)",
    }

    for (const [key, value] of Object.entries(settings)) {
        var input = document.createElement("input");
        input.type = "checkbox";
        input.name = key;
        input.value = key;
        input.id = key;
    
        var label = document.createElement('label')
        label.htmlFor = key;
        label.appendChild(document.createTextNode("\u00A0" + value));
    
        var li = document.createElement("li");
        li.appendChild(input);
        li.appendChild(label);
    
        ul.appendChild(li);
    }
    
    function openPopup () {
        var winFeatures = ""
    
        for (const [key, value] of Object.entries(settings)) {
            var input = document.getElementById(key);
            if (input.checked)
                winFeatures += key + "=yes,"
            else
                winFeatures += key + "=no,"
        }
    
        if(windowRef == null || windowRef.closed) {
            windowRef = window.open("https://binfalse.de/?test=window_open_feature", "Popup", winFeatures);
        } else {
            alert ("Popup already opened!? Please close it to test again.");
        }
    }
</script>

**TEST NOW:** <a href="https://binfalse.de/?test=window_open_feature" target="Popup" onclick="openPopup(); return false;">Open binfalse.de using above settings.</a>

The test should be browser independent, you just need to have Javascript enabled.
However, let me know if it doesn't work for you!

To see how I implemented the test tool take a look into the source code of this page, or [check the script on GitHub](https://github.com/binfalse/binfalse.de/commit/df884dff0b1cc50f1565fc062d83b039a495dab7#diff-2b56a0d205475684917f043114021f30R53).
Remember? This blog is all open source :)
