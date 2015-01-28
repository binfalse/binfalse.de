---
layout: post
title: 'Umlauts on English keyboards'
tags:
  - hacked
  - Junk
  - keyboard
  - Media
  - userinteraction
categories:
  - Junk
  - Media

---

<a href="http://0rpheus.net/">Micha</a> is just sitting next to me, writing a new blog post. He's writing in German with an English keyboard, so he has to encode umlauts like ä with an  `&auml;` . I can not watch any longer, here is the trick.

<a href="http://esmz-designz.com/index.php?site=blog&entry=29&title=Meine_neue_SUN">Still blogged about it</a>, you can create such additional keys with Xmodmap. So choose a key, get its key code  for example with  `xbindkeys -k`  and create a file  `$HOME/.Xmodmap`  with the following syntax:


{% highlight bash %}
keycode XXX = YYY
{% endhighlight %}


 `XXX`  ist the code of your key and  `YYY`  is that what should happen. For example:



{% highlight bash %}
keycode  137 = adiaeresis Adiaeresis
keycode  139 = udiaeresis Udiaeresis
keycode  141 = odiaeresis Odiaeresis 
keycode  143 = ssharp ssharp
{% endhighlight %}



That gives you an ä/Ä on the key with code 137 and so on. To let the file take effect just run  `xmodmap $HOME/.Xmodmap` . Btw  `xmodmap -pke`  will give you the actual running keymap.
So Micha, no need to type to much ;)

