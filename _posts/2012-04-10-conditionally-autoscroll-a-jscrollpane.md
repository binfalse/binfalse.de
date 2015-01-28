---
layout: post
title: 'Conditionally autoscroll a JScrollPane'
tags:
  - explained
  - Java
  - Programming
  - trick
  - userinteraction
categories:
  - Java
  - Media
  - Software

---

I'm currently developing some GUI stuff and was wondering how to let a <a href="http://docs.oracle.com/javase/1.4.2/docs/api/javax/swing/JScrollPane.html">JScrollPane</a> scroll automatically if it's already on the bottom and the size of it's content increases.


For example if you use a <a href="http://docs.oracle.com/javase/1.4.2/docs/api/javax/swing/JTextArea.html">JTextArea</a> to display some log or whatever, than it would be nice if the scroll bars move down while there are messages produced, but it shouldn't scroll down when the user just scrolled up to read a specific line.
To scroll down to the end of a JTextArea can be done with just setting the carret to the end of the text:



{% highlight java %}
JTextArea log = new JTextArea (20, 20);
log.setEditable (false);
JScrollPane scroller = new JScrollPane ();
scroller.setViewportView (output);

// [...]

log.append ("your message");
log.setCaretPosition (log.getDocument ().getLength ());
{% endhighlight %}



But we first want to check whether the scroll bar is already at the bottom, and only if that's the case it should automatically scroll down to the new bottom if another message is inserted.
To obtain the position data of the vertical scroll bar on can use the following code:



{% highlight java %}
JScrollBar vbar = scroller.getVerticalScrollBar ();

// get the current position
int currentPosition = vbar.getValue ();

// getMaximum () gives maximum + extent.
int maxPosition = vbar.getMaximum () - vbar.getVisibleAmount ();

if (currentPosition == maxPosition)
{
	// in this case we want to scroll after the new text is appended
}
{% endhighlight %}



Unfortunately  `log.append ("some msg")`  won't append the text in place, so the size of the text area will not necessarily change before we ask for the new maximum position. To avoid a wrong max value one can also schedule the scroll event:



{% highlight java %}
private void logText (String text)
{
	final JScrollBar vbar = scroller.getVerticalScrollBar ();
	// is the scroll bar at the bottom?
	boolean end = vbar.getMaximum () == vbar.getValue () + vbar.getVisibleAmount ();
	
	// append some new text to the text area
	// (or do something else that increases the contents of the JScrollPane)
	log.append (text + "\\n");
	
	// if scroll bar already was at the bottom we schedule
	// a new scroll event to again scroll to the bottom
	if (end)
	{
		EventQueue.invokeLater (new Runnable ()
		{
			public void run ()
			{
				EventQueue.invokeLater (new Runnable ()
				{
					public void run ()
					{
						vbar.setValue (vbar.getMaximum ());
					}
				});
			}
		});
		
	}
}
{% endhighlight %}



As you can see, here a new event is put in the <a href="http://docs.oracle.com/javase/1.4.2/docs/api/java/awt/EventQueue.html">EventQueue</a>, and this event is told to put another event in the queue that will do the scroll event. Correct, that's a bit strange, but the swing stuff is very lazy and it might take a while until the new maximum position of the scroll bar is calculated after the whole GUI stuff is re-validated. So let's be sure that our event definitely happens when all dependent swing events are processed.
