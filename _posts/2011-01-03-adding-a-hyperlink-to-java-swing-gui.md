---
layout: post
title: 'Adding a hyperlink to Java Swing GUI'
tags:
  - hacked
  - Iceweasel
  - Java
  - Network
  - trick
  - userinteraction
  - X
categories:
  - Java
  - Media
  - Software
  - Web

---

Just dealt with an annoying topic: How to add a link to a Java swing frame.
It's not that hard to create some blue labels, but it's a bit tricky to call a browser browsing a specific website...


As I mentioned the problem is to call the users web browser. Since Java SE 6 they've added a new class called <a href="http://download.oracle.com/javase/6/docs/api/java/awt/Desktop.html">Desktop</a>. With it you may interact with the users specific desktop. The call for a browser is more than simple, just tell the desktop to browse to an URL:



{% highlight java %}
java.awt.Desktop.getDesktop ().browse ("binfalse.de")
{% endhighlight %}



Unfortunately there isn't support for every <abbr title='Operating System'>OS</abbr>, before you could use it you should check if it is supported instead of falling into runtime errors..



{% highlight java %}
if (java.awt.Desktop.isDesktopSupported ())
{
	java.awt.Desktop desktop = java.awt.Desktop.getDesktop ();
	if (desktop.isSupported (java.awt.Desktop.Action.BROWSE))
	{
		try
		{
			desktop.browse (new java.net.URI ("binfalse.de"));
		}
		catch (java.io.IOException e)
		{
			e.printStackTrace ();
		}
		catch (java.net.URISyntaxException e)
		{
			e.printStackTrace ();
		}
	}
}
{% endhighlight %}



So far.. But what if this technique isn't supported!? Yeah, thats crappy ;)
You have to check which <abbr title='Operating System'>OS</abbr> is being used, and decide what's to do!
I searched a little bit through the Internet and developed the following solutions:



{% highlight java %}
String url = "";
String osName = System.getProperty("os.name");
try
{
	if (osName.startsWith ("Windows"))
	{
		Runtime.getRuntime ().exec ("rundll32 url.dll,FileProtocolHandler " + url);
	}
	else if (osName.startsWith ("Mac OS"))
	{
		Class fileMgr = Class.forName ("com.apple.eio.FileManager");
		java.lang.reflect.Method openURL = fileMgr.getDeclaredMethod ("openURL", new Class[] {String.class});
		openURL.invoke (null, new Object[] {url});
	} 
	else
	{
		//check for $BROWSER
		java.util.Map<String, String> env = System.getenv ();
		if (env.get ("BROWSER") != null)
		{
			Runtime.getRuntime ().exec (env.get ("BROWSER") + " " + url);
			return;
		}
		
		//check for common browsers
		String[] browsers = { "firefox", "iceweasel", "chrome", "opera", "konqueror", "epiphany", "mozilla", "netscape" };
		String browser = null;
		for (int count = 0; count < browsers.length && browser == null; count++)
			if (Runtime.getRuntime ().exec (new String[] {"which", browsers[count]}).waitFor () == 0)
			{
				browser = browsers[count];
				break;
			}
		if (browser == null)
			throw new RuntimeException ("couldn't find any browser...");
		else
			Runtime.getRuntime ().exec (new String[] {browser, url});
	}
}
catch (Exception e)
{
	javax.swing.JOptionPane.showMessageDialog (null, "couldn't find a webbrowser to use...\\nPlease browser for yourself:\\n" + url);
}
{% endhighlight %}



Combining these solutions, one could create a browse function. Extending the  `javax.swing.JLabel`  class, implementing  `java.awt.event.MouseListener`  and adding some more features (such as blue text, overloading some functions...) I developed a new class Link:

[cc lang="java" file="pipapo/java/Link.java"][/cc]

Of course it is also attached, so feel free to use it on your own ;)

Unfortunately I'm one of these guys that don't have a Mac, shame on me! So I <strong>just could test these technique for Win and Linux</strong>. If you are a proud owner of a different <abbr title="operating system">OS</abbr> please test it and let me know whether it works or not.
If you have improvements please tell me also.

<div class="download"><strong>Download:</strong>
JAVA: <a href='/wp-content/uploads/pipapo/java/Link.java'>Link</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
