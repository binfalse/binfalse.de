---
title: "Regain RSS feeds for the University of Rostock"
layout: post
published: true
date: 2018-09-03 08:18:32 +0200
categories:
  - software
  - web
  - university
  - website
  - howto
tags:
  - typo3
  - fix
  - job
  - rss
  - media
  - university
---

{% include image.html align='alignright' url='/assets/media/commons/Generic_Feed-icon-blue.svg' img='/assets/media/commons/Generic_Feed-icon-blue.svg' title='RSS feeds for uni-rostock.de' caption='RSS feeds for uni-rostock.de' maxwidth='300px' %}

I'm consuming quite some input from the internet everyday.
A substantial amount of information arrives through podcasts, but much more essential are the 300+ RSS feeds that I subscribed to!
I love RSS, it's one of the best inventions in the world wide web!

However, there are alarming rumors and activities trying to get rid of it...
We probably should all get our news filtered by Facebook or something..!?
The importance of RSS, which allows users to keep track of updates on many different websites, seems to get continuously ignored..
And so does the new website of our University, where official RSS feeds aren't provided anymore :(

Apparently, many people were already asking for it.
At least that's what they told me, when I asked...
But the company who built the pages won't integrate RSS anymore - probably wasn't listed in the requirements..
And the University wouldn't change the expensive product.

"Fortunatelly," they stayed with Typo3 as the CMS, which we've been using before we decided to switch.
And this Typo3 platform can output the page's content as RSS feed out of the box - you just need to know how! ;-)

And... I'll tell you: Just append `?type=9818` to the URL.
That's it! Really. It's so easy.

Here are a few examples:

* [Press releases](https://www.uni-rostock.de/universitaet/aktuelles/pressemeldungen/) as RSS feed: [https://www.uni-rostock.de/universitaet/aktuelles/pressemeldungen/?type=9818](https://www.uni-rostock.de/universitaet/aktuelles/pressemeldungen/?type=9818)
* [Events](https://www.uni-rostock.de/universitaet/aktuelles/veranstaltungen/) as RSS feed: [https://www.uni-rostock.de/universitaet/aktuelles/veranstaltungen/?type=9818](https://www.uni-rostock.de/universitaet/aktuelles/veranstaltungen/?type=9818)
* [Open positions](https://www.uni-rostock.de/stellen/wissenschaftliches-und-nichtwissenschaftliches-personal/) as RSS feed: [https://www.uni-rostock.de/stellen/wissenschaftliches-und-nichtwissenschaftliches-personal/?type=9818](https://www.uni-rostock.de/stellen/wissenschaftliches-und-nichtwissenschaftliches-personal/?type=9818)
* [Open professorships](https://www.uni-rostock.de/stellen/professuren/) as RSS feed: [https://www.uni-rostock.de/stellen/professuren/?type=9818](https://www.uni-rostock.de/stellen/professuren/?type=9818)
* [Events of the institute of computer science](https://www.informatik.uni-rostock.de/veranstaltungen/alle-veranstaltungen/) as RSS feed: [https://www.informatik.uni-rostock.de/veranstaltungen/alle-veranstaltungen/?type=9818](https://www.informatik.uni-rostock.de/veranstaltungen/alle-veranstaltungen/?type=9818)


Sure, doesn't work everywhere.
If the editors maintain news as static HTML pages, Typo3 fails to export a proper RSS feed.
It's still better than nothing.
And maybe it helps a few people...


The RSS icon was adapted from [commons:Generic Feed-icon.svg](https://commons.wikimedia.org/wiki/RSS_icons).
