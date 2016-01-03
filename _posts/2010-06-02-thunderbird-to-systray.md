---
layout: post
title: 'Thunderbird to systray'
tags:
  - debian
  - mail
  - media
  - network
  - notebook
  - thunderbird
categories:
  - debian
  - mail
  - software

---

Til version 3 of <a href="http://www.mozillamessaging.com/en-US/thunderbird/">Thunderbird</a>, or more exactly icedove, I used the add-on <a href="https://addons.mozilla.org/en-US/thunderbird/addon/8900/">New Mail Icon</a> to free the busy space in task list that the Thunderbird process uses even though I have this window very rarely in foreground. But it seems that there is no further development in this project, so this software isn't compatible to the actual major release...

On my main desktop I thought I have to live with that, but on my notebook screen there is a lack of space, more than ever, so I had to search for an alternative tool. On my way I found a tool (no add-on) called <a href="http://alltray.trausch.us/">AllTray</a>, it's available in the <a href="http://packages.debian.org/search?keywords=alltray&searchon=names&suite=all&section=all">Debian</a>/<a href="http://packages.ubuntu.com/search?keywords=alltray&searchon=names&suite=all&section=all">Ubuntu</a> repository. That can dock any window to your tray, so it doesn't depend on Thunderbird, you can also dock a terminal or your editor or even a complete (Oracle VM) VirtualBox instance.

For my Thunderbird problem it's a half of the solution, because this tool doesn't tell me whether there are unread mails. But after some more research I found a real add-on called <a href="https://addons.mozilla.org/en-US/thunderbird/addon/4868/">FireTray</a> that does the desired trick. So more space for other junk ;-)
