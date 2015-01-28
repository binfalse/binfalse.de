---
layout: post
title: 'Tweet-button for website'
tags:
  - Blog
  - Media
  - Programming
  - twitter
  - Wordpress
categories:
  - Media
  - Network
  - PHP
  - Software
  - Web

---

Yeah, completely in twitter-fever! Just developed a tweet-button.

You can see the button at the end of every post. The button itself of course isn't my work, I just copied it from twitter, but when you click the link around it you can tweet the actual post directly to twitter! Feel free to try it! ;)

It's more than easy. All the code you need is (replace [...]):



{% highlight html %}
<a href="http://twitter.com/share?url=[URL_TO_THIS_SITE]&amp;lang=[en|de|..]&amp;via=[NAME_OF_YOUR_TWITTER_ACCOUNT_FOR_@_LINK]&amp;text=[TEXT_FOR_TWITTERMSG]" >
      Tweet it <img src="[TWITTER_IMAGE]"/>
</a>
{% endhighlight %}



So the code that I wrote in my theme is:



{% highlight php %}
if ( is_singular() )
{
	$tweet = '<span id="tweetit"><a href="http://twitter.com/share?url=https%3A%2F%2F'.$_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"].'&amp;lang=en&amp;via=binfalse&amp;text='.the_title('', '', false).'" >
	<span id="tweetittext">Tweet it</span>
	<img src="/wp-content/uploads/2010/08/btn_tweet_mini.png"/>
	</a></span>';
	$tweet .= "<br />";
}
{% endhighlight %}



After that just using the  `$tweet`  variable at any position I like ;)

<a href="http://dev.twitter.com/pages/tweet_button">Here you can find a documentation</a>.
