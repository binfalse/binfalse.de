---
layout: post
title: galternatives
tags:
  - aptitude
  - debian
  - simplification
  - trick
  - ubuntu
  - userinteraction
categories:
  - debian
  - media
  - software

---

Some days ago I discovered <a href="http://packages.debian.org/galternatives">galternatives</a>, a <a href="http://www.gnome.org/">GNOME</a> tool to manage the <a href="http://wiki.debian.org/DebianAlternatives">alternatives system</a> of <a href="http://www.debian.org/">Debian</a>/<a href="http://www.ubuntu.com/">Ubuntu</a>. It's really smart I think.



For example to update the default editor for your system you need to update the alternatives system via:

<code>update-alternatives --set editor /usr/bin/vim</code>

There is also an interactive version available:

<code>update-alternatives --config editor</code>

To see available browsers you need to run

<code>update-alternatives --list x-www-browser</code>

{% include image.html align="alignright" url="/wp-content/uploads/2012/03/galternatives.png" img="/wp-content/uploads/2012/03/galternatives-150x150.png" title="" caption="" %}

However, the alternatives system is a nice idea I think, but it's a bit confusing sometimes. And installing a new group or adding another entry to an existing group is pretty complicated and requires information from multiple other commands beforehand.

With  `galternatives`  you'll get a graphical interface to manage all these things. That really brings light into the dark! Just install it via

<code>aptitude install galternatives</code>

You'll be astonished if you give it a try! ;-)
