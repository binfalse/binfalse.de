---
layout: post
title: 'Web Screenshots. W/O browser!'
categories:
  - Media
  - Network
  - Private
  - Software
  - Web

---

Just discovered a nice way to take screenshots of web sites from the command line! No browser needed. Cool.



The tool I'd like to advertise is called  `gnome-web-photo` :



{% highlight bash %}
aptitude install gnome-web-photo
{% endhighlight %}



For instance. To take generate an image of my website just call:



{% highlight bash %}
gnome-web-photo --timeout=60  binfalse.png
{% endhighlight %}



Just take a look at  `binfalse.png`  to examine the result. I obtained a  `1024x6334`  image. I guess the main use case is to generate some kind of preview/thumbnail. To get a thumbnail simply add  `--mode=thumbnail` :



{% highlight bash %}
gnome-web-photo --timeout=60 --mode=thumbnail  binfalse-thumb.png
{% endhighlight %}



Afaik, there is no option to generate a larger thumb, but you could just pass  `--width=`  without the  `--mode=thumbnail` . And then crop the pic yourself (e.g. using imagemagick). However, you need to run X and you need to have GTK, if I understand correctly. Nevertheless, I like that solution.


