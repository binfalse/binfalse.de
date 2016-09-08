---
date: '2011-09-30 07:19:08'
link: ''
name: RD
post_id: /software/browser-extensions/yourls-firefox-extension
---

Hi Martin,

great extension, muchos kudos!
With bumping the  `maxVersion`  in  `install.rdf`  to  `7.*`  your extension also works fine on Firefox 7.

Would it be possible to automatically copy the short-url to the clipboard after it has been generated?
Code would probably just this:


{% highlight bash %}
var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"] 
                .getService(Components.interfaces.nsIClipboardHelper); 
clipboard.copyString( ... );
{% endhighlight %}

