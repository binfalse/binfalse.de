---
layout: post
title: 'Playing around with SUN Spots'
tags:
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

<p>My boss wants to present some cool things in a lecture that can be done with <a href="http://www.sunspotworld.com/">SUN Spots</a>. I'm selected to program these things and now I have three of them to play a little bit.</p>
<p>The installation was basically very easy, all you should know is that there is no chance for 64bit hosts and also <a href="http://www.virtualbox.org/">Virtual Box</a> guests don't work as expected, virtual machines lose the connection to the Spot very often... So I had to install a 32bit architecture on my host machine (btw. my decision was a <a href="http://sidux.com/">Sidux Μόρος</a>).</p>
<p>If a valid system is found, the rest is simple. Just download the <a href="http://www.sunspotworld.com/SPOTManager/index.html">SPOTManager from sunspotworld.com</a>, that helps you installing the Sun SPOT Software Development Kit (SDK). If it is done connect a Sport via USB, open the SPOTManager and upgrade the Spot's software (it has to be the same version as installed on your host). All important management tasks can be done with this tool and it is possible to create virtual Spots.</p>
<p>Additionally to the SDK you'll get some demos installed, interesting and helpful to see how things work. In these directories ant is configured to do that crazy things that can be done with the managing tool. Here are some key targets:</p>



{% highlight bash %}
ant info		# get some info about the spot (version, installed application and so on)
ant deploy		# build and install to spot
ant host-run	# build a host application and launch it
ant help		# show info about existing targets
# to configure a spot to run as base station OTA has to be disabled and basestation must be started
ant disableota startbasestation
{% endhighlight %}



<p>A basestation is able to administrate other Spots, so you don't have to connect each to your machine.</p>
<p>Ok, how to do own stuff?<br />
There are some <a href="http://netbeans.org/">Netbeans</a> <a href="https://netbeans-spot.dev.java.net/">plugins</a> that makes live easier, but I don't like that big IDE's that are very slow and bring a lot of overhead to your system. To create an IDE independent project that should <strong>run on a Spot</strong> you need an environment containing:</p>
<ul>
<li><strong>File</strong>: ./resources/META-INF/MANIFEST.MF



{% highlight bash %}
MIDlet-Name: NAME
MIDlet-Version: 1.0.0
MIDlet-Vendor: Sun Microsystems Inc
MIDlet-1: App Description, ,your.package.MainClassName
MicroEdition-Profile: IMP-1.0
MicroEdition-Configuration: CLDC-1.1
{% endhighlight %}



</li>
<li><strong>File</strong>: ./build.xml



{% highlight bash %}
< ?xml version="1.0" encoding="UTF-8" standalone="no"?>
<project basedir="." default="deploy">
<property file="${user.home}/.sunspot.properties"/>
    <import file="${sunspot.home}/build.xml"/>
</project>
{% endhighlight %}



</li>
<li><strong>Directory</strong>: ./src<br />
Here you can place your source files
</li>
</ul>
<p>And now you can just type  `ant`  and the project will be deployed to the Spot.<br />
A project that should <strong>run on your host</strong> communicating with other spots through the basestation needs a different environment:</p>
<ul>
<li><strong>File</strong>: ./build.xml



{% highlight bash %}
< ?xml version="1.0" encoding="UTF-8" standalone="no"?>
<project basedir="." default="host-run">
<property name="main.class" value="your.package.MainClassName"/>
<property file="${user.home}/.sunspot.properties"/>
    <import file="${sunspot.home}/build.xml"/>
</project>
{% endhighlight %}

</li>

<li><strong>Directory</strong>: ./src<br />
Here you can place your source files
</li>
</ul>
<p>Ok, that's it for the moment. I'll report results.</p>

