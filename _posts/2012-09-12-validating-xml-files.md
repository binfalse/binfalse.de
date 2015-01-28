---
layout: post
title: 'Validating XML files'
tags:
  - explained
  - Java
  - Programming
  - Snippet
categories:
  - Java
  - Snippet
  - Software

---

In the scope of different projects I often have to validate XML files. Here is my solution to verify XML files using a schema.

First of all to validate XML files in Java you need create a  `SchemaFactory`  of the W3C XML schema language and you have to compile the schema (let's assume it's located in  `/path/to/schema.xsd` ):



{% highlight java %}
SchemaFactory factory = SchemaFactory.newInstance ("http://www.w3.org/2001/XMLSchema");
Schema schema = factory.newSchema (new File ("/path/to/schema.xsd"));
{% endhighlight %}



Now you're able to create a validator from the schema.



{% highlight java %}
Validator validator = schema.newValidator ();
{% endhighlight %}



In order to validate a XML file you have to read it (let's assume it's located in  `/path/to/file.xml` ):



{% highlight java %}
Source source = new StreamSource (new File ("/path/to/file.xml"));
{% endhighlight %}



Last but not least you can validate the file:



{% highlight java %}
try
{
  validator.validate (source);
  System.out.println ("file is valid");
}
catch (SAXException e)
{
  System.out.println ("file is invalid:");
  System.out.println (e.getMessage ());
}
{% endhighlight %}



Here you can find my implementation:

[cc lang='java' file='pipapo/java/XMLValidator.java'][/cc]

<div class="download"><strong>Download:</strong>
JAVA: <a href="/wp-content/uploads/pipapo/java/XMLValidator.java">XMLValidator.java</a>
		<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
		</div>
