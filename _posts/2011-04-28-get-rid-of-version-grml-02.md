---
layout: post
title: 'Get rid of version grml.02'
tags:
  - aptitude
  - fail
  - grml
  - junk
  - kernel
  - sid
categories:
  - debian
  - software
  - university

---

I frequently get asked about the error:



{% highlight bash %}
dpkg-query: warning: parsing file '/var/lib/dpkg/status' near line 5038 package 'linux-image-2.6.33-grml':
 error in Version string 'grml.02': version number does not start with digit
dpkg-query: warning: parsing file '/var/lib/dpkg/status' near line 21699 package 'linux-headers-2.6.33-grml':
 error in Version string 'grml.02': version number does not start with digit
dpkg-query: warning: parsing file '/var/lib/dpkg/status' near line 61359 package 'linux-doc-2.6.33-grml':
 error in Version string 'grml.02': version number does not start with digit
{% endhighlight %}



So this article is to answer all questions in a time.



I don't know why, but that <a href="http://grml.org/">grml</a> kernel has a version number of  `grml.02`  (other kernel versions are also affected). This version string doesn't meet the criteria for version numbers because it doesn't start with a digit. So  `dpkg`  is correctly warning. This warning is not critical, you might ignore it without any consequences, or you can install a newer one.
Kernel with corrected version numbers can be found in  `grml-testing` , so add the following to your  `/etc/apt/sources.list.d/grml.list` :



{% highlight bash %}
deb     http://deb.grml.org/ grml-testing main
{% endhighlight %}



and you'll find for example the new 2.6.38 <a href="http://www.kernel.org/">kernel</a>. Just for those lazy guys:



{% highlight bash %}
aptitude install linux-image-2.6.38-grml linux-headers-2.6.38-grml
{% endhighlight %}



So, have fun with your new kernel :-P
