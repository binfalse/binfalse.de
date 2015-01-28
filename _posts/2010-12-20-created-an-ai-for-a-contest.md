---
layout: post
title: 'Created an AI for a contest'
tags:
  - contest
  - game
  - GNU
  - Java
  - journals
  - Network
  - Programming
categories:
  - Java
  - Network
  - Software
  - Web

---

This year the journal <a href="http://www.freiesmagazin.de/">freiesMagazin</a> organized the <a href="http://www.freiesmagazin.de/third_programming_contest">third contest</a> in a series. This time it's about programming an <abbr title="artificial intelligence">AI</abbr> for a predator-prey-like game. I just submitted my short solution.


As I said, it's the third programming contest. The first one was about switching gems and in the second contest it was the goal to navigate a robot through a factory. I didn't got the announce of the first one and missed the second one as a consequence of a lack of time. Hence it's a premiere for me!

Citing their introduction:

<blockquote>Same procedure as every day: It is late in the evening and you're still sitting at your office desk and listening to some music. Suddenly a siren sounds through all rooms, the doors are closing automatically and you cannot open them anymore. A light green mist appears and some creepy shapes wander around the hall. Sometimes you really hate Mondays …</blockquote>

So, at the beginning of the game all programmed bots are in the same team. After some time one of them changes to the opposite team, trying to catch one of the other while the other ones are fleeing. Simple and clear. It's running through sockets and the bot-programmers can win vouchers. More information can be found at <a href="http://www.freiesmagazin.de/third_programming_contest">their website</a>.

On one hand I'm interested in socket programming since a while and on the other hand I'm of course interested in the voucher, so I decided to take part in the contest although there are enough other things to do for me.
I agreed with myself to put about two days of work into it. In the end I worked about three days, but however, I could program about 365 more. If you take a look at the code it's kept more or less simple and many functions aren't in use. For example I track a motion profile of each opponent, but when I'm predator I don't care about it. It would be more promising to predict a actual position of a prey (for example with neural networks or something like that) instead of searching without any profoundness. But this would go beyond my scope...

So lets see how many people are also joining this contest. The result will be published mid-January. At least I'm last, but that's not wicked. I had a lot of fun and even learned something. That's the main thing.
It's taking part that counts! ;-)

I attached my bot, it's licensed under <a href="http://www.gnu.org/licenses/gpl.html">GPLv3</a>. In some further articles I'll explain some smart details of my code, I think some of them are quiet nice to know.

<div class="download"><strong>Download:</strong>
Java: <a href='http://pipapo.git.sourceforge.net/git/gitweb.cgi?p=pipapo/pipapo;a=tree;f=java/fm-contest;hb=HEAD'>Repository @ SourceForge</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
