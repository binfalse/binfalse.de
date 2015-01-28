---
layout: post
title: 'R for the web'
tags:
  - apache
  - aptitude
  - GNU
  - Media
  - Programming
  - trick
categories:
  - Media
  - R
  - Software
  - Web

---

There is a nice R module for apache: <a href="http://rapache.net/">rApache</a>. So you can easily publish statistics.



To install rApache first install the following packages from the Debian/Ubuntu repository:



{% highlight bash %}
aptitude install apache2 apache2-mpm-prefork apache2-prefork-dev r-base-dev
{% endhighlight %}



So the basics are done. Lets install rApache. Grab the latest version:



{% highlight bash %}
wget http://biostat.mc.vanderbilt.edu/rapache/files/rapache-latest.tar.gz
{% endhighlight %}



extract the contents and  `cd`  into it. The installation process should be clear, I had to give a hint for the apxs2 location:



{% highlight bash %}
./configure --with-apxs=/usr/bin/apxs2
make
make install
{% endhighlight %}



To notify apache about the new module you need to create two more files. First one is  `/etc/apache2/mods-available/r.conf` :



{% highlight bash %}
<Location /R>
ROutputErrors
SetHandler r-script
RHandler sys.source
</Location>

<Location /RApacheInfo>
SetHandler r-info
</Location>
{% endhighlight %}



Now all files in  `/R`  are assumed to be R-scripts, in  `/RApacheInfo`  you'll find some information about your installation.
The second file is  `/etc/apache2/mods-available/r.load` :



{% highlight bash %}
LoadModule R_module /usr/lib/apache2/modules/mod_R.so
{% endhighlight %}



This file just defines which lib to load.
To finish the installation you need to load the rApache module and restart the webserver via:



{% highlight bash %}
a2enmod r
/etc/init.d/apache2 restart
{% endhighlight %}



That's it. You can test whether all was successful by browsing to <a href="http://localhost/RApacheInfo">localhost/RApacheInfo</a>, hopefully you'll see some config stuff. To prepare some own tests create a directory  `/var/www/R`  (assuming your document-root is  `/var/www` ) and paste something like this in a file called  `test` :



{% highlight r %}
y = rnorm(100)
print(y)
{% endhighlight %}



Browsing to <a href="http://localhost/R/test">localhost/R/test</a> you should see something like this:



{% highlight r %}
[1] -0.4969626136 -0.0004799614  1.3858672447 -0.1888848545  0.5577465024
  [6] -0.6463581808  1.3594363388  1.8160182284 -1.8602721944  0.3249432873
 [11]  1.0861606647 -0.5075055497 -0.5152062853  0.4851131375  0.2924883195
 [16] -0.5542238124  1.2741001461  0.2627202474 -0.8986869795 -0.8628182849
 [21] -0.0788598913  0.4843055866 -0.2747585510 -1.1928500793  1.6193763442
 [26]  0.3452218627  0.9518228897 -0.5858433386  1.9585346877 -0.2582043114
 [31] -1.7989436202  1.2713761553  0.9045031014 -0.3456065867  0.3739555330
 [36]  0.7512315203 -0.5289340037 -0.7700091217 -1.5103278314 -1.5195628428
 [41] -0.8100795062  1.1027597227  0.0194147933  0.7819879165 -0.3914496199
 [46] -0.4650911293  0.5889685176 -0.9659270213  1.0570030616 -0.0657166412
 [51] -0.2077095857  0.6421821337 -0.1911934111 -3.1567052058  0.2704713187
 [56] -0.5154689593  0.0923834868 -1.2100314635  0.6693369266 -1.2093881229
 [61]  1.6755264101  1.2151146432  0.6683583636 -0.2982231602  1.4830922366
 [66]  1.6505026636 -0.1769048244  0.3516470621 -0.0053594481 -0.3776870673
 [71] -0.4797554602  1.2207702646  1.2762816419 -2.6137169267 -1.4423704831
 [76] -0.4251822440  0.8007722424 -0.4985947758 -2.0685396392 -1.6844317212
 [81] -0.2509955532  0.7906569225 -0.1259848747 -0.1352738978 -1.4943405839
 [86] -2.4272199144 -0.5778250558  1.2579971393 -1.0476874144  0.2305160769
 [91] -0.2920446292  0.1823053837  1.8858770756  1.4158084170 -1.2539321864
 [96]  1.2667650232  0.1272379338  1.2726069769  0.8745111042  0.3848103655
{% endhighlight %}



To create a graphic you need to change the content type to an image type. A small example might give you an idea:

[cc lang="rsplus" file="pipapo/R/web-image.R"][/cc]

Reload the page and you'll see a more or less nice plot :-P
That's it for the moment, for a more interactive interface take a look at the <a href="http://www.stat.ucla.edu/~jeroen/ggplot2/">ggplot2 mod</a>.

<div class="download"><strong>Download:</strong>
R: <a href="/wp-content/uploads/pipapo/R/web-image.R">web-image.R</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
