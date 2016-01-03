---
layout: post
title: 'Inspecting Java startups'
tags:
  - analyzed
  - java
  - programming
categories:
  - java
  - software

---

The developers around you might know that there are some mechanism hooked when creating an object. Lets have a look at the order of these processes.



Even beginners should know about constructors. They are called if you create an object of a class, but there are some things running before. Here is an example class:



{% highlight java %}
public class Initializing
{
	// static initializer
	static
	{
		System.out.println ("class loaded");
	}
	
	// instance initializer
	{
		System.out.println ("new instance");
	}
	
	// constructor
	public Initializing ()
	{
		System.out.println ("constructor");
	}
	
	public static void main (String [] args)
	{
		System.out.println ("first object");
		new Initializing ();
		System.out.println ("\\n\\nsecond object");
		new Initializing ();
	}
}
{% endhighlight %}



The output is:



{% highlight bash %}
class loaded
first object
new instance
constructor


second object
new instance
constructor
{% endhighlight %}



As you can see, first of all the static initializer is called. It's also called exactly once, when the class is loaded. It's clear that the class has to get loaded before the  `main ()`  inside can be executed.
The  `main ()`  then prints a string to indicate the start of that routine and afterwards it creates the first object of the type  `Initializing` . This calls the instance initializer before the constructor is executed. Also the creation of the second object calls first the instance initializer and then the constructor.
That's the workaround. At the first time a certain class is used the static initializer is executed, and each time an object of that class is created first the instance initializer is called and then the constructor.
Btw. all of these routines are able to access members that are private, but notice that the static initializer can only access static fields.
