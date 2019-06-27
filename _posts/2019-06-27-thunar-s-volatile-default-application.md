---
title: "Thunar's volatile default application"
layout: post
published: true
date: 2019-06-27 09:47:02 +0200
categories:
  - software
  - media
  - administration
  - debian
  - linuxunix
tags:
  - config
  - xfce
  - debian
  - fix
  - explained
  - media
  - trick
  - userinteraction
---

{% include image.html align='alignright' url='https://commons.wikimedia.org/wiki/File:Thunar.svg' img='/assets/media/commons/Thunar-converted-from-Thunar.svg.png' title='Xfce project [GPL (http://www.gnu.org/licenses/gpl.html)], via Wikimedia Commons' caption='Thunar\'s hammer in the Xfce project [GPL (http://www.gnu.org/licenses/gpl.html)], via Wikimedia Commons' maxwidth='300px' %}



[Thunar](https://en.wikipedia.org/wiki/Thunar) ([Xfce](https://xfce.org/)'s file manager) has a rather unintuitive behaviour to select the default app:
For some file types it seems that chossing a program of the context menu's *"Open With..."* overwrites the default application for that file type...
That means, once I open a [PNG](https://en.wikipedia.org/wiki/Portable_Network_Graphics) file with [Gimp](https://www.gimp.org/), Gimp becomes the default for PNGs and double clicking the next PNG will result in [a `>300 ms` delay](http://designingforperformance.com/performance-is-ux/#designers-impact-on-performance) to launch Gimp.
Strangely, that only happens for *some* file types. Others seem to be invariant to the *open-with-selection*...?
Anyway, bugged me enough to finally look into it..



It [seems, that this was a design decision](https://bugzilla.xfce.org/show_bug.cgi?id=12493) whithin the Xfce project:
If you actively selected a default application it will stay the default application, even if you temporarily open-with another application.
If you did not actively select a default application, the last application will be used by default -> this is my annoying use case.


**At least, I now know what is needed to do: Actively select a default applications...**

You can do it using the UI by right-clicking a file of the type and selecting *Open With Other Application...*. Then select the desired application and make sure you tick *Use as default for this kind of file*.
From then on, this will be your default application, until you actively change it.

That may be a good solution for many of you, but it's also pretty tedious to find and right-click all the different file types. And of course it's not the way I'm working. There must be a nicer option - and there is!
The configuration for Thunar's mime type bindings is stored in 
`~/.config/mimeapps.list` :)

This file contains two sections:

* `[Added Associations]` contains a list of known file types and possible associations to applications
* `[Default Applications]` is a list of file types and ... their default application...

Thus, to add another *default-application-association,* you just need to append another line to the `[Default Applications]` section. You may just copy a line from the `[Added Associations]` and reduce the number of applications to one, eg. for PNG images:

{% highlight php %}
[Added Associations]
image/png=eom.desktop;eog.desktop;gimp.desktop
...

[Default Applications]
image/png=eog.desktop
{% endhighlight %}


If your desired application is not yet int the list of *Added Associations*, you may find it in `/usr/share/applications/`.
If you still cannot find an application, you can generate a new one.
Just create a file `~/.local/share/applications/YOURAPP.desktop` containing something like this:

{% highlight ini %}
[Desktop Entry]
Encoding=UTF-8
Version=1.0
Type=Application
NoDisplay=true
Exec="/PATH/TO/YOUR/APPLICATION" %f
Name="YOURAPP"
Comment="YOURAPP COMMENT"
{% endhighlight %}

Afterwards, you can use `YOURAPP.desktop` in `~/.config/mimeapps.list`.





Looks like I'm often in trouble with default applications...? Is it just me?  
If you have problems with [KDE](https://kde.org/) applications, you may want to look into my article on [KDE file type actions](/2013/01/24/kde-file-type-actions/)
