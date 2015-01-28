---
layout: post
title: 'ShortCut[siblings]: tail and its derivatives'
tags:
  - GNU
  - log
  - Network
  - ShortCut
  - userinteraction
categories:
  - Operatingsystem
  - ShortCut
  - Software

---

Every text-tool-user should know about <em>tail</em>! You can print the last few lines of a file or watch it growing.
But there are three improved derivatives, just get into it.


I think there is no need for further explanation of <em>tail</em> itself, so lets begin with the first derivative.

<h1>colortail</h1>

{% include image.html align="alignright" url="/wp-content/uploads/2010/12/colortail.png" img="/wp-content/uploads/2010/12/colortail-150x150.png" title="" caption="" %}

<a href="http://joakimandersson.se/projects/colortail/">colortail</a> is based on <em>tail</em> with support for colors, so it helps to keep track of important content. Common options and parameters are resembled closely to them of <em>tail</em>, so it won't be a big adjustment to new circumstances for <em>tail</em> fans. The content that it presents is of course the same as if it comes from <em>tail</em>, but colorized ;)
With  `-k`  you can additional submit a configuration file that defines some regular expressions and its colors. On a Debian some examples can be found in  `/usr/share/doc/colortail/examples/` .
In figure 1 you can see an example output of <em>colortail</em> on the syslog of a virtual machine.

<h1>multitail</h1>

{% include image.html align="alignright" url="/wp-content/uploads/2010/12/multitail.png" img="/wp-content/uploads/2010/12/multitail-150x150.png" title="" caption="" %}

The second tool in this article is <a href="http://www.vanheusden.com/multitail/">multitail</a>. Like <em>colortail</em> it can colorize the output, but all is presented in a <a href="http://www.gnu.org/software/ncurses/">ncurses</a> based user interface so it is able to create multiple windows on your console. If you open a file in <em>multitail</em> it's automatically in a <em>following</em> mode ( `-f`  in case of <em>tail</em> and <em>colortail</em>).
If you are monitoring multiple log files your console is split horizontal or vertical or a mix of both. You can pause the output, search for regular expressions and a lot more. Enter  `F1`  to get a small help window.
Figure 2 presents a sample output. Its <a href="http://www.vanheusden.com/multitail/">project page</a> keeps much more information.

<h1>logtail</h1>
<a href="http://www.fourmilab.ch/webtools/logtail/">logtail</a> pursues a different goal. It's not interested in prettifying the output, it remembers the content that was still displayed and just prints the differences to the last run. So it is an ideal tool for log analyzer, log messages doesn't have to be parsed multiple times. <em>logtail</em> is written in perl, you can also monitor logfiles on different machines.

I hope I could give you some smart inspirations.
