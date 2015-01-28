---
layout: post
title: 'They are following you!'
tags:
  - analyzed
  - explained
  - Firefox
  - Google
  - Media
  - Network
  - twitter
  - ugly
  - userinteraction
categories:
  - Network
  - Private
  - Software
  - Web

---

Recently there was a <a href="http://heise.de/-1320862">discussion</a> with the privacy officer of Hamburg. He was arguing about people using Google-Analytics, but he also tracks his visitors on his public website. So are you anonymous? Of course not! Lets have a look at the why.



<h2>What's the problem?</h2>
Many webmasters analyze their website with Google-Analytics. This is a service of Google, very easy to use. All you need to do is insert a small script somewhere into your HTML-code:



{% highlight javascript %}
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'SOME_ID']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
{% endhighlight %}



This code tells the visitors browser to download a script from <em>http://www.google-analytics.com/</em>. That is while you visit this website, you additionally visit Google's website in the background. Google of course recognizes this visit and knows which website you accessed.
That is of course very cool for webmasters, they'll get very <a href="http://www.google.com/analytics/features.html">detailed statistics</a> about their visitors without any own work. Which article is favored most, should articles be published in the morning or in the evening, where do the visitors come from, how much time do they spend on the site and so on. Visitors don't even know that Google follows them on nearly every website they visit.
So Google is able to create very extensive profiles of every web user. Where do I come from? Am I interested in technical or political topics? Which videos do I like at YouTube? How frequently do I visit YouPorn? Based on my clicks it's easy to guess my gender (shoes or cars?), my age (SpongeBob or cure), my professional (stock market news or music)... Do you have an account at Twitter? Google-Analytics also tracks user generated content. Together with some personal sites at Xing or LinkedIn or a blog at bloggers.com it's easy to get a comprehensive profile of a single web user.

<h2>So Google is the bastard?</h2>
Oh not in the slightest! There are a lot of these companies. The previous mentioned privacy officer for examples tracks it's users with <a href="http://www.ivw.de/">IVW</a>. The IVW uses a similar technique, you add a small image, a so called web bug, to your site:



{% highlight html %}
<img id="ivw_pixel" src="http://heise.ivwbox.de/cgi-bin/ivw/SOMEID">
{% endhighlight %}



Since it is exactly 1 pixel it is not visible to the user, but your browser nevertheless loads it from <em>ivwbox.de</em> and so they get notified if you visit this specific website. Prominent customers are also <a href="http://ausweisung.ivw-online.de/i.php?s=2&a=100025">Heise</a>, <a href="http://ausweisung.ivw-online.de/i.php?s=2&a=100326">Playboy</a>, <a href="http://ausweisung.ivw-online.de/i.php?s=2&a=100688">Xing</a>, <a href="http://ausweisung.ivw-online.de/i.php?s=2&a=99847">Ebay</a>, <a href="http://ausweisung.ivw-online.de/i.php?s=2&a=99707">Bild.de</a> and <a href="http://ausweisung.ivw-online.de/">a lot more</a> (click the links to get some statistics). So IVW also creates extensive profiles of you! Do you really want to connect you professional Xing profile with Bild.de or Playboy? ;-)

But not enough, you know these funny pictures:

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/08/social-tracking-crap.png" img="/wp-content/uploads/2011/08/social-tracking-crap.png" title="" caption="" %}

How often did you see one of these buttons today? Do you know a website that doesn't have a <em>like button</em> (except mine)? Lets have a look to the HTML code:



{% highlight html %}
<iframe src="https://plusone.google.com/u/0/_/+1/SOMESTUFF" allowtransparency="true" hspace="0" id="SOMEID" marginheight="0" marginwidth="0" name="SOMENAME" style="STYLE" tabindex="-1" vspace="0" scrolling="no" width="100%" frameborder="0"></iframe>
[...]
<iframe src="http://platform.twitter.com/widgets/tweet_button.html#_=ID" title="TITLE" style="STYLE" class="CLASS" allowtransparency="true" scrolling="no" frameborder="0"></iframe><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
[...]
<iframe src="http://www.facebook.com/plugins/like.php?href=ID" style="STYLE" allowtransparency="true" scrolling="no" frameborder="0"></iframe>
[...]
<script src="http://www.stumbleupon.com/hostedbadge.php?s=1"></script><iframe src="http://www.stumbleupon.com/badge/embed/1/?url=ID" style="STYLE" allowtransparency="true" scrolling="no" frameborder="0"></iframe>
{% endhighlight %}



Wow, while we visit one single website, our browser notifies Google, Twitter, Facebook and StumbleUpon about our short visit. Crazy, isn't it? And there are much more networks that offer such buttons.
Or have a look at this picture:

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/08/social-tracking-crap2.png" img="/wp-content/uploads/2011/08/social-tracking-crap2.png" title="" caption="" %}

Each button is loaded from foreign webservers. I hardly can see any benefit for the user or the webmaster!?

<h2>How to defend?</h2>
There is no protection, power off all your electronics and go back to the stone age! (Or get <a href="http://en.wikipedia.org/wiki/Amish">amish</a>)
Ok, that's hard and somewhat impossible these days. But there are some possibilities to minimize the tracking.

For example some Firefox extensions like <a href="http://noscript.net/">NoScript</a> prevent your browser loading scripts from foreign servers (see Google-Analytics). 
But you'll also load these buttons and iframes, because this is simple HTML. Here you need another extension like <a href="http://adblockplus.org/en/">AdBlockPlus</a>. This allows you to define rules for blocking specific content, e.g. everything that comes from facebook. But keep in mind that these companies own different domains, like <em>facebook.com</em>, <em>facebook.net</em> or <em>fbcdn.net</em>. And even if you think you got all of them, there are a lot more. There is also a filter list for social media stuff available at <a href="http://chromeadblock.org/extensions/block-facebook-tracking/">Chrome Adblock</a> (yes, comes from Google, but does its job...).
If you are not running Firefox or you don't want to install a bunch of plugins, you can also send these request to <a href="http://en.wikipedia.org/wiki/Nirvana">nirvana</a>. For example unix-guys might add lines like this to your  `/etc/hosts` :



{% highlight bash %}
192.168.23.23 facebook.com
{% endhighlight %}



Every time your browser wants to load a script from facebook.com he sends a request to  `192.168.23.23` , which hopefully doesn't exists. Do the same for all the other <a href="http://datenfresser.info/">profiler</a>.

<h2>Fear?</h2>
Don't be frightened now, but be aware! You should carefully decide what to publish about yourself and others around you. And of course take care of your privacy.
Some days ago we went to Berlin for a meeting, when a colleague received a message via facebook on his BlackBerry from a friend asking what he's doing in Berlin!? Looks like his smart-phone told facebook its GPS position without his approval!? That's scary, isn't it!

So think twice while exploring the world wide web ;-)
