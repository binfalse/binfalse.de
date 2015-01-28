---
layout: post
title: 'Humanizing atan2'
tags:
  - c
  - Java
  - Programming
  - simplification
  - trick
categories:
  - Programming
  - Software

---

I'm sure everyone of you got livid with the return value of the  `atan2`  functions. Here is a fix.





{% highlight java %}
public double arctan (double x, double y)
{
	double d = Math.atan2 (x, y) % (2 * Math.PI);
	if (d >= 0 && d <= Math.PI / 2)
		return Math.PI / 2 - d;
	else if (d < 0 && d >= -Math.PI)
		return Math.PI / 2 - d;
	else if (d > Math.PI / 2 && d <= Math.PI)
		return 2.5 * Math.PI - d;
	return d;
}
{% endhighlight %}



This is Java code, but easy to adapt for other languages. And since you are here, a little hint: Multiply the result with  `180 / Math.PI`  to receive the angle in degrees.
