---
layout: post
title: 'KDE file type actions'
tags:
  - kde
  - media
  - okular
  - userinteraction
categories:
  - media
  - network
  - software
  - web

---

Annoyingly, <a href="http://www.kde.org/">KDE</a>'s PDF viewer <a href="http://okular.kde.org/">okluar</a> always opened links to websites with an editor presenting me the source code. But I just figured out how to change this behavior.

{% include image.html align="alignright" url="/wp-content/uploads/2013/01/kcmshell4-filetypes.png" img="/wp-content/uploads/2013/01/kcmshell4-filetypes-270x217.png" title=" kcmshell4 dialog to configure filetype-application-mappings" caption=" kcmshell4 dialog to configure filetype-application-mappings" %}



KDE maintains a central config defining what to do with certain file types. Unfortunately, in my case the default application for HTML files was an editor (kwrite/kate). I don't know who or what defined this stupid behavior, but there is a tool called  `kcmshell4`  to edit the KDE configuration. That said, to edit the <em>filetype-application-mapping</em> hand it the parameter  `filetypes` :



{% highlight bash %}
usr@srv % kcmshell4 filetypes
{% endhighlight %}



You'll get a dialog to define a mapping for each known file type. In my case I had to configure okular to open links to HTML pages with konqueror.
Hope that helps you to save some time ;-)
