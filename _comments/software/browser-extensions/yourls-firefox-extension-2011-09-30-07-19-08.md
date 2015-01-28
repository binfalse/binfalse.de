---
name: RD
link: ''
date: '2011-09-30 07:19:08'
comment: "Hi Martin,\n\ngreat extension, muchos kudos!\nWith bumping the  `maxVersion`  in  `install.rdf`  to  `7.*`  your extension also works fine on Firefox 7.\n\nWould it be possible to automatically copy the short-url to the clipboard after it has been generated?\nCode would probably just this:\n\n\n{% highlight bash %}\nvar clipboard = Components.classes[\"@mozilla.org/widget/clipboardhelper;1\"] \n                .getService(Components.interfaces.nsIClipboardHelper); \nclipboard.copyString( ... );\n{% endhighlight %}\n\n"
post_id: /software/browser-extensions/yourls-firefox-extension

---


