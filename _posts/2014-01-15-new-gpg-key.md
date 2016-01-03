---
layout: post
title: 'New GPG Key'
tags:
  - gnu
  - gpg
  - private
  - security
categories:
  - private
  - security
  - web

---

It was time to finally replace my old GPG key. I created the key in 2008 and from today's perspective a 1024 bit DSA key is really weak. Thus, today I decided to move to a new key and created a 4096 bit RSA key.



My old key was



{% highlight bash %}
pub   1024D/446DB306 2008-07-15 [expires: 2017-07-13]
      Key fingerprint = 0E75 62A5 405E 65B1 B477  4215 D9B3 5173 446D B306
{% endhighlight %}



And the new key is:



{% highlight bash %}
pub   4096R/8D2DD9BD 2014-01-15 [expires: 2019-01-14]
      Key fingerprint = 08E6 6E72 A83A 9871 CD49  3441 E81B C307 8D2D D9BD
{% endhighlight %}



For those of you who already trust my old key I created a 
<a href="/wp-content/uploads/2014/01/key-transition-2014-01-15.txt.asc">transition note</a> which is signed by both my old and my new key.

To import my new key to your key chain you can use the following command:



{% highlight bash %}
gpg --keyserver pgp.mit.edu --recv-key 8D2DD9BD
{% endhighlight %}



The new key is already signed by the old key. Those of you trusting my old key may verify the signature using:



{% highlight bash %}
gpg --check-sigs 8D2DD9BD
{% endhighlight %}



To sign the new key execute the following command:



{% highlight bash %}
gpg --sign-key 8D2DD9BD
{% endhighlight %}



And it would be nice if you upload the signed to one of the key servers:



{% highlight bash %}
gpg --keyserver pgp.mit.edu --send-key 8D2DD9BD
{% endhighlight %}



You are of course free to give me a call in order to verify the fingerprint ;-)
