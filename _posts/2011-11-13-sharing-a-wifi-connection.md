---
layout: post
title: 'Sharing a Wifi connection'
tags:
  - Debian
  - NAT
  - Network
  - Notebook
  - trick
  - Ubuntu
categories:
  - LinuxUnix
  - Network
  - Private
  - Software
  - Unix
  - Web

---

Due to different circumstances I had to figure out how to share a wireless connection with some wired clients. And what should I say, that's a very simple task ;-)


<h2>The scenario</h2>
With your notbook you are able to connect to an <abbr tittle="Access Point">AP</abbr> with access to the internet, but other machines within your network infrastructure don't have access to the outside world, and you want your local machines to also use this wireless connection of your notebook. Figure 1 visualizes this use case.

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/11/share-wifi.png" img="/wp-content/uploads/2011/11/share-wifi.png" title="" caption="" %}

<h2>The setup</h2>
First of all I have to admit I don't know which software needs to be installed. Since I previously did some network hacks with this notebook I didn't have to install something that wasn't actually present, but I think you'll need something like  `network-manager-gnome` ,  `dnsmasq-base`  and  `dnsmasq-utils` .
And of course you also need a Linux notebook (e.g. with a <a href="http://www.debian.org/">Debian</a> or an <a href="http://www.ubuntu.com/">Ubuntu</a>) with wifi hardware, an AP with internet connection and a RJ45 Ethernet port on the notebook for the wired connection to other PC's.

The first thing you should do is to connect to the AP, so your notebook will be able to access the WWW.

The next step is to connect another machine to your notebook using a network cable. This machine needs to be configured as a <a href="http://en.wikipedia.org/wiki/Dhcp">DHCP</a>-client. (Since this might be any operating system of your choice I don't describe the configuration, but most systems should already be configured correctly)

Now you have to setup a shared connection on your notebook. Right-click the network indicator icon in your systems panel (next to your clock) and choose <strong>Edit Connections...</strong>, compare to figure 2.

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/11/shared-wifi-connection1.png" img="/wp-content/uploads/2011/11/shared-wifi-connection1.png" title="" caption="" %}

This will open a new window with connections you still configured. In the <strong>Wired</strong> tab click <strong>Add</strong> to install a new shared connection, see figure 3.

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/11/shared-wifi-connection2.png" img="/wp-content/uploads/2011/11/shared-wifi-connection2.png" title="" caption="" %}

You'll see another window to configure this new connection. Just give it a name like <strong>share</strong> and choose the method <strong>Shared to other computers</strong> in the <strong>IPv4 Settings</strong> tab, as shown in figure 4.

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/11/shared-wifi-connection3.png" img="/wp-content/uploads/2011/11/shared-wifi-connection3.png" title="" caption="" %}

Last but not least open a terminal and add a new entry to the nat-table:



{% highlight bash %}
sudo iptables -t nat -A POSTROUTING -j MASQUERADE
{% endhighlight %}



That's it, using this newly created connection you're able to connect your clients behind your notebook through your wireless connection.
