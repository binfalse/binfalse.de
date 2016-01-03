---
layout: post
title: 'Java network connection on Debian:SID'
tags:
  - debian
  - java
  - network
  - programming
  - sid
  - sidux
categories:
  - debian
  - java
  - network
  - software
  - web

---

The <a href="http://www.debian.org/releases/unstable/">unstable release</a> of <a href="http://www.debian.org/">Debian</a> is of course tricky in a lot of cases, so there is also a little stumbling stone on your path of <a href="http://java.com/en/">Java</a> network programming. On every new system it annoys me.

Before I wrongful blame my preferred Debian release called Sid I have to acknowledge I don't know whether this <em>feature</em> is also available in other releases... Here is a small program to test/reproduce:



{% highlight java %}
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class WebReader
{
	public static void main (String[] args)
	throws Exception
	{
		BufferedReader reader = new BufferedReader(
			new InputStreamReader (new URL (args[0]).openStream ()));
		String line = reader.readLine ();
		
		while ((line = reader.readLine ()) != null)
			System.out.println (line);
	}
}
{% endhighlight %}



Compilation shouldn't fail, but if you try to launch it you'll get an exception like that:



{% highlight java %}
Exception in thread "main" java.net.SocketException: Network is unreachable
        at java.net.PlainSocketImpl.socketConnect(Native Method)
        at java.net.PlainSocketImpl.doConnect(PlainSocketImpl.java:333)
        at java.net.PlainSocketImpl.connectToAddress(PlainSocketImpl.java:195)
        at java.net.PlainSocketImpl.connect(PlainSocketImpl.java:182)
        at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:366)
        at java.net.Socket.connect(Socket.java:525)
        at java.net.Socket.connect(Socket.java:475)
        at sun.net.NetworkClient.doConnect(NetworkClient.java:163)
        at sun.net.www.http.HttpClient.openServer(HttpClient.java:394)
        at sun.net.www.http.HttpClient.openServer(HttpClient.java:529)
        at sun.net.www.http.HttpClient.<init>(HttpClient.java:233)
        at sun.net.www.http.HttpClient.New(HttpClient.java:306)
        at sun.net.www.http.HttpClient.New(HttpClient.java:323)
        at sun.net.www.protocol.http.HttpURLConnection.getNewHttpClient(HttpURLConnection.java:860)
        at sun.net.www.protocol.http.HttpURLConnection.plainConnect(HttpURLConnection.java:801)
        at sun.net.www.protocol.http.HttpURLConnection.connect(HttpURLConnection.java:726)
        at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1049)
        at java.net.URL.openStream(URL.java:1010)
        at WebReader.main(WebReader.java:10)
{% endhighlight %}

<!--fucking wordpress parser... -->

This is caused by one little line in  `/etc/sysctl.d/bindv6only.conf`  saying you want to explicitly bind via <a href="http://en.wikipedia.org/wiki/IPv6">IPv6</a>. But my connection (maybe yours too) communicates still over <a href="http://en.wikipedia.org/wiki/IPv4">IPv4</a>, so this method of networking of course fails. To change this behavior you have to choose between two solutions.

<h3>Solution 1: Permanent modification (needs to be root)</h3>
You can change this behavior for the whole system by editing the file  `/etc/sysctl.d/bindv6only.conf` :


{% highlight bash %}
# original only IPv6
# net.ipv6.bindv6only = 1
net.ipv6.bindv6only = 0
{% endhighlight %}


After that just type  `invoke-rc.d procps restart`  in your terminal to let your changes take effect. Your next run should work fine.

<h3>Solution 2: Change it for this single example</h3>
If your are not allowed to change system settings, you can add  `-Djava.net.preferIPv4Stack=true`  to your execution command:


{% highlight bash %}
java -Djava.net.preferIPv4Stack=true  WebReader http://localhost
# instead of `java WebReader http://localhost`
{% endhighlight %}


This causes your actual runtime to connect the network via IPv4, no matter to system preferences. I hope this could save some time of developers like me ;-)
