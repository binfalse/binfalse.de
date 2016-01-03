---
layout: post
title: 'ShortCut[image]: ScreenShooting a JPanel'
tags:
  - java
  - programming
  - shortcut
  - trick
  - userinteraction
categories:
  - java
  - shortcut
  - software

---

This is about taking a screenshot of a JPanel to save the visible stuff as an image to disk.


Sometimes it may happen that you create a swing <abbr title="graphical user interface">GUI</abbr> with a panel to draw cool stuff. Here you can learn how to let the user take a screenshot of this graphic with a single click on a button.

First of all create such a <a href="http://download.oracle.com/javase/6/docs/api/javax/swing/JPanel.html">JPanel</a> and fill it with crazy graphics, then create a <a href="http://download.oracle.com/javase/6/docs/api/java/awt/image/BufferedImage.html">BufferedImage</a> with the size of the panel and tell the panel to draw its content to this image instead of printing the content to the screen and, last but not least, save this image:



{% highlight java %}
// create a panel
javax.swing.JPanel panel = new javax.swing.JPanel ();
// [..] tell the panel to look nice

// create an image
java.awt.image.BufferedImage bImage = new java.awt.image.BufferedImage (panel.getSize ().width, panel.getSize().height, java.awt.image.BufferedImage.TYPE_INT_RGB);
// tell the panel to draw its content to the new image
panel.paint (bImage.createGraphics ());
// save everything
try
{
  java.io.File imageFile = new java.io.File ("/tmp/screener.png")
  imageFile.createNewFile ();  
  javax.imageio.ImageIO.write (bImage, "png", imageFile);  
}
catch(Exception ex)
{
  ex.printStackTrace ();
}
{% endhighlight %}



You see it's very simple. Of course it's also possible to create other types of image with <a href="http://download.oracle.com/javase/6/docs/api/javax/imageio/ImageIO.html">ImageIO</a>, like <em>JPEG</em> or <em>GIF</em>, but for more information take a look in the documentation. In a project that will be published you should think about using a <a href="http://download.oracle.com/javase/6/docs/api/javax/swing/JFileChooser.html">JFileChooser</a> instead of hard coding the name of the new image ;-)

