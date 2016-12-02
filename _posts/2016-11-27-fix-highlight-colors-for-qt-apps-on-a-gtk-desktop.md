---
title: "Fix highlight colors for QT apps on a GTK desktop"
layout: post
published: true
date: 2016-11-27 20:14:42 +0100
categories:
  - uncategorized
tags:
  - untagged
---

{% include image.html align='alignright' url='/assets/media/pics/2016/okular-highlight-default.png' img='/assets/media/pics/2016/okular-highlight-default.png' title='Okular: highlighted text is hardly readable' caption='Okular: highlighted text is hardly readable' maxwidth='300px' %}

I'm using the [i3 window manger](https://i3wm.org/).
As smart as possible, increases productivity, and feels clean.
Exactly how I like my desktop.
I'm still very happy that [Uschy](https://meet-unix.org/) hinted me towards i3!


However, I'm experiencing a problem with highlighted text in [Okular](https://okular.kde.org/), my preferred PDF viewer.
When I highlight something in Okular the highlight-color (blue) is far too dark, the highlighted text isn't readable anymore.
I used to live with that, but it was quite annoying.
Especially when you're in a meeting/presentation and you want to highlight something at the projector.
I just saw that problem occurring in Okular.
Not sure why, but I honestly do not understand this whole desktop config thing -- probably one of the reasons why **I love i3** ;-)


Today, I eventually digged into the issue and found out ~~what's the problem~~ how to solve the problem.
Apparently, Okular uses a Qt configuration, that can be modified using the `qtconfig` tool.
Just install it (here for Qt4 applications):


{% include image.html align='alignright' url='/assets/media/pics/2016/qtconfig-highlighted.png' img='/assets/media/pics/2016/qtconfig-highlighted.png' title='Configure the highlight color using the qtconfig tool' caption='Configure the highlight color using the qtconfig tool' maxwidth='300px' %}

{% highlight bash %}
aptitude install qt4-qtconfig
{% endhighlight %}

When you run `qt4-qtconfig` a window will pop up, as you can see in the figure on the right:

1. Select a *GUI Style* that is **not** *Desktop Settings (Default)*, e.g. *Cleanlooks*.
2. Then you can click the *Tune Palette...* button in the *Build Palette* section.
3. A second window will pop up. Select *Highlight* in the *Central color roles* section.
4. Finally you're good to select the hightlight color using the color chooser button! :)

{% include image.html align='alignright' url='/assets/media/pics/2016/okular-highlight-fixed.png' img='/assets/media/pics/2016/okular-highlight-fixed.png' title='Okular highlighting text with fixed colors' caption='Okular highlighting text with fixed colors' maxwidth='300px' %}

Was a bit difficult to find, but the result is worth it!
The figure on the bottom shows the new highlight color -- much better.

I will probably never understand all these KDE, QT, Gnome, GTK, blah settings.
Every environment does it differently and changes the configuration format and location like every few months.
At least for me that's quite frustrating...




