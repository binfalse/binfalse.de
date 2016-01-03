---
layout: post
title: 'Record Stream Using VLC'
tags:
  - media
  - network
  - trick
categories:
  - howto
  - media
  - network
  - software
  - web

---

I just needed to record a video stream. Usually, I use <a href="https://en.wikipedia.org/wiki/MPlayer">mplayer</a> for these kinds of jobs, but this time it failed. However, on the internet I found a way to do it using VLC, which apparently has quite a command line interface.



<a href="http://forum.videohelp.com/threads/348274-Record-HLS-streams?s=3b43577eeb5aac034f71f66d2ce4a7bc&p=2178842&viewfull=1#post2178842">This comment</a> revealed that the VLC media player comes with some command line magic. Of course, not much is documented in the <a href="http://linux.die.net/man/1/vlc">man page</a>, but the <a href="http://www.videolan.org/doc/vlc-user-guide/en/ch04.html">user guide</a> on their website seems to be useful.

Long story short, I ended up with the following command to save the stream  `http://STREAM.mp4`  to  `/tmp/file.mkv` :



{% highlight bash %}
vlc http://STREAM.mp4 --sout="#std{access=file,mux=mkv,dst='/tmp/file.mkv'}" vlc://quit
{% endhighlight %}



Cool.

For the records, here are some alternatives:



{% highlight bash %}
# using mplayer
mplayer -dumpstream http://STREAM.mp4 -dumpfile /tmp/file.mp4
# using ffmpeg
ffmpeg -i http://STREAM.mp4 -acodec copy -vcodec copy /tmp/file.mp4
{% endhighlight %}


