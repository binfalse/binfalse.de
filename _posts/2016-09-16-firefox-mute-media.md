---
title: "Firefox: Mute Media"
layout: post
published: true
date: 2016-12-02 08:13:29 +0200
categories:
  - uncategorized
tags:
  - untagged
---

{% include image.html align='alignright' url='/assets/media/pics/2017/mute-tube.svg' img='/assets/media/pics/2017/mute-tube.png' title='Silence Firefox' caption='Silence Firefox' maxwidth='200px' %}

You middle-click a few youtube videos and all start shouting against each other.
You enter a website and it immediately slaps sound in you face.
How annoying...

But there may be help.

Enter `about:config` and set

* `media.block-play-until-visible` to `true` to only play media that is also in the current tab an do not play the stuff from the background
* `media.autoplay.enabled` to `false` to stop autoplaying of some of the media (doens't work everywhere, not sure why..)
* `dom.audiochannel.mutedByDefault` sets the audio muted by default -- essential for offices
* `plugins.click_to_play` requires a click to run plugins, such as flash (which you are anyway not using!)
