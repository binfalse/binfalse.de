---
title: "Thunderbird 60+ is missing calendars"
layout: post
published: true
date: 2018-10-01 09:44:58 +0200
categories:
  - software
  - administration
  - debian
  - mail
tags:
  - thunderbird
  - lightning
  - bug
  - aptitude
  - debian
  - fix
  - icedove
  - mail
  - private
  - university
---

{% include image.html align='alignright' url='/assets/media/pics/2018/tb-lightning.png' img='/assets/media/pics/2018/tb-lightning.png' title='Lightning is a calendar plugin for Thunderbird.' caption='Lightning is a calendar plugin for Thunderbird.' maxwidth='250px' %}

I'm running Thunderbird to read emails on my desktops.
And I'm using the Lightning plugin to manage calendars, evens, and tasks.

However, since I updated to Thunderbird 60 some weeks ago, Lightning strangely seems to be broken.
The Add-ons manager still lists Lightning as properly installed, but there the "Events and Tasks" menu is missing, as well as the calendar/tasks tabs and the calendar settings in the preferences.
As I've been pretty busy with many other things, I didn't study the problem - hoping that the bug gets fixed in the meantime - but living without the calendar addon is cumbersome.
And today it became annoying enough to make me investigate this...

There seems to be various issues with calendars in the new Thunderbird version: [Mozilla provides an extensive support page dedicated to this topic](https://support.mozilla.org/en-US/kb/calendar-updates-issues-thunderbird).
Sadly, none of these did help in my case..

I then made sure that the versions of Thunderbird and Lightning are compatible (both are `1:60.0-3~deb9u1` for me):

{% highlight bash %}
$ dpkg -l thunderbird
ii  thunderbird       1:60.0-3~deb9u1     amd64     mail/news client with RSS, chat [...]
$ dpkg -l lightning 
ii  lightning         1:60.0-3~deb9u1     all       Calendar Extension for Thunderbird
{% endhighlight %}


Eventually, I stumbled upon a thread in the German Debian forums: [Thunderbird 60 - Lightning funktioniert nicht](https://debianforum.de/forum/viewtopic.php?t=170751).
And they figured out, that **it may be caused by missing language packs for Lightning...**
Indeed, I do have language packs for Thunderbird installed (*de* and *en-gb*), that are not installed for Lightning:

{% highlight bash %}
$ dpkg -l| egrep "thunderbird|lightning"
ii  lightning                1:60.0-3~deb9u1
ii  thunderbird              1:60.0-3~deb9u1
ii  thunderbird-l10n-de      1:60.0-3~deb9u1
ii  thunderbird-l10n-en-gb   1:60.0-3~deb9u1
{% endhighlight %}

And it turns out, that this was a problem!
Thunderbird apparently wouldn't run Lightning unless it has all required language packs installed.
After installing the missing language packs (`aptitude install lightning-l10n-de lightning-l10n-en-gb`), the extension is again fully working in Thunderbird!
How unsatisfactory...


All that may be cause by a missing dependency..?
Even though `thunderbird` recommends `lightning`, `thunderbird-l10n-de` (and similiar) do not recommend `lightning-l10n-de`.
Not exactly sure how, but maybe the dependencies should be remodelled...?


