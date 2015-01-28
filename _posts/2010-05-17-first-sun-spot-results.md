---
layout: post
title: 'First SUN Spot results'
tags:
  - Java
  - Media
  - Programming
  - spaughts
  - SUNSpot
  - University
categories:
  - Hardware
  - Java
  - Media
  - Software
  - University

---

One week passed since <a href="/2010/05/playing-around-with-sun-spots/">I got a package of Spots</a>, this weekend I found some time to hack a little bit with this funny components.

First of all I programmed a tool that visualizes the Spots movement in an OpenGL frame that draws a virtual Spot. Nice for demonstrations, but nothing spectacular.

After that I developed a little mouse emulator, that translates Spot movement to mouse motions on the screen. Here the Spot isn't doing anything intelligent, it only sends its tilt status every 25 ms as well as switch events to broadcast.
Another Spot, working as basestation connected to my machine, is listening to this talking Spot and my host analyzes the received values. To move the mouse on the screen or to generate a click I use the <a href="http://java.sun.com/j2se/1.4.2/docs/api/java/awt/Robot.html">Robot</a> class of the <a href="http://java.sun.com/j2se/1.4.2/docs/api/java/awt/package-summary.html">Java AWT</a> package. Long story short, a video may explain it more understandable (via <a href="http://www.youtube.com/watch?v=jobv8QDYvpg">YouTube</a>):

<p style="text-align: center;"><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="480" height="385" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"><param name="allowFullScreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="src" value="http://www.youtube.com/v/jobv8QDYvpg&amp;hl=en_US&amp;fs=1&amp;" /><param name="allowfullscreen" value="true" /><embed type="application/x-shockwave-flash" width="480" height="385" src="http://www.youtube.com/v/jobv8QDYvpg&amp;hl=en_US&amp;fs=1&amp;" allowscriptaccess="always" allowfullscreen="true"></embed></object>

I will continue with working on these libraries before I publish them in another post. So look forward to the release ;-)</p>
