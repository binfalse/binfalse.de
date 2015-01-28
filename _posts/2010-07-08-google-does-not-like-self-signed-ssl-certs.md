---
layout: post
title: 'Google does not like self-signed SSL certs'
tags:
  - apache
  - Blog
  - Google
  - Security
  - SSL
  - ugly
categories:
  - Network
  - Security
  - Web

---

The last few days my feeds were out of date. I manage them with Google's solution called <a href="http://feedburner.google.com/">feedburner</a>, you may have recognized it.

It seems that the developer of this project changed some stuff, anyway, they did not actualize my feeds. The last days (or weeks) I did not had the time to care about, but today I found some minutes.



{% include image.html align="alignright" url="/wp-content/uploads/2010/07/feedburner-ssl-error.png" img="/wp-content/uploads/2010/07/feedburner-ssl-error-150x150.png" title="" caption="" %}

When I tried to resync my feeds manually I got this nice red error (see also the picture):

<blockquote>There is an issue that must be addressed with your source feed for the feed "binfalse"

sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target</blockquote>

This is caused by my Apache redirect directive that redirects all visitors looking for an insecure URL at port 80 to my SSL encrypted content at port 443:



{% highlight bash %}
<virtualhost *:80>
...
        Redirect / /
...
</virtualhost>
{% endhighlight %}



So you see I'm caring about security ;)

This method works for a long time, but now feedburner tries to verify the certs and because of a lack of money I signed my certs by myself. So feedburner denies the access and doesn't reread my own feeds to update its database.
To repair this problem I'm just redirecting my real content and not the feeds, so feedburner is happy and why should I care about the secure connection of feedburner to my site..

Nevertheless it is not my preferred solution.
