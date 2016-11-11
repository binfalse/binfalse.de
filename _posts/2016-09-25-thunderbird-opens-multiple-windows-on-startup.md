---
title: "Thunderbird opens multiple windows on startup"
layout: post
published: true
date: 2016-09-25 11:44:22 +0200
categories:
  - software
  - mail
tags:
  - config
  - fix
  - icedove
  - mail
  - thunderbird
  - extension
---

{% include image.html align='alignright' url='/assets/media/pics/2016/thunderbird-attention.png' img='/assets/media/pics/2016/thunderbird-attention.png' title='Thunderbird demands attention...' caption='Thunderbird demands attention... (Screenshot of my i3 desktop)' maxwidth='300px' %}

Since some time my [Icedove/Thunderbird](https://en.wikipedia.org/wiki/Mozilla_software_rebranded_by_Debian) (currently version 38.8.0) uses to open two main windows when I launch it.
That's a bit annoying, as there are always two windows visually trying to catch my attention.
Even if I read the new mail in one of them the other one would still demand attention.

That's of course a bit annoying.
The preferences dialog doesn't seem to offer a button for that.
I've been looking for a solution on the internet, but wasn't able to find something.
And unfortunately, there is an easy workaround: Just close the second window after startup...
The other window will appear again with the next start of Icedove/Thunderbird, but that's the problem of future-me.
These nasty easy workarounds!
You won't fix the problem and it tends to bug you a little harder with every appearance.

Today I had some time to look into the issue.


I sensed the problem in my Thunderbird settings - if that would be an actual Thunderbird issue I would have found something on the internet..
Thus, it must be in my `~/.icedove/XXXX.default` directory.
Studying the `prefs.js` file was quite interesting, but didn't reveal anything useful for the current issue.
Then I spotted a `session.json` file, and it turns out that this caused the problem!
It contained these lines: `cat session.json | json_pp`


{% highlight json tabsize=2 %}
{
	"windows" : [
	{
		"type" : "3pane",
		"tabs" : {
			"selectedIndex" : 0,
			"rev" : 0,
			"tabs" : [
			{
				"selectedIndex" : 0,
				"rev" : 0,
				"tabs" : [
				{
					....
				}
				]
			}
			]
		}
	},
	{
		"tabs" : {
			"tabs" : [
			{
				....
			},
			{
				"mode" : "tasks",
				"ext" : {},
				"state" : {
					"background" : true
				}
			},
			{
				"ext" : {},
				"mode" : "calendar",
				"state" : {
					"background" : true
				}
			},
			{
				"state" : {
					"messageURI" : "imap-message://someidentifyer/INBOX#anotheridentifier"
				},
				"mode" : "message",
				"ext" : {}
			}
			],
			"rev" : 0,
			"selectedIndex" : 0
		},
		"type" : "3pane"
	}
	],
	"rev" : 0
}
{% endhighlight %}

<small>(For brevity I replaced my actual main tab's content with `....`)</small>

As you see, there is [JSON](https://en.wikipedia.org/wiki/JSON) object containing a single key `windows` with an array of two objects.
These two objects apparently represent my two windows.
Both have tabs.
For example in the second window object my `calendar` and my `tasks` are opened in tabs (that's the [lightning/iceowl extension](https://en.wikipedia.org/wiki/Lightning_%28software%29)), and a single message occupies another tab.

Brave as I am I just deleted the first window object (I decided for the first one as that had no extra tabs).
And voilà!
The next launch of Thunderbird just opens a single window! :)

I don't know who wrote the stuff into the `session.json`, it was probably caused by one of my extensions.
However, it seems to be stable now.
And if it ever happens again I'll know how to fix it.

Easy solution, should have fixed that immediately!


## Update

{% include image.html align='alignright' url='/assets/media/pics/2016/thunderbird-attention-firetray-options.png' img='/assets/media/pics/2016/thunderbird-attention-firetray-options.png' title='Fix the settings in FireTray' caption='Fix the settings in FireTray (version 0.6.1)' maxwidth='300px' %}

I found out what caused the problem: It is [FireTray](https://addons.mozilla.org/en-US/thunderbird/addon/firetray/) -- an extension that I'm using to have a systray notification icon.
This extension sits in the systray and changes its icon when a new mail arrives.
That's super useful, but...
**by default it doesn't close windows but just hides them to systray!**
That means you can restore them in the context menu of the systray icon...
And that means that the windows aren't really closed and will appear again with the next start of the application.


To change that behaviour just right-click the icon and click *Preferences.*
A dialog window will pop up and you just need to unselect the *Closing window hides to systray.*
Compare the screenshot.
You may also go for *Only last window can be hidden.*

