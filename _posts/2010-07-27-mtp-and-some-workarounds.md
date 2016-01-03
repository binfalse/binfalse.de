---
layout: post
title: 'MTP and some workarounds'
tags:
  - debian
  - media
  - mtp
  - ugly
  - zen
categories:
  - hardware
  - media
  - software

---

Actually I revived my Creative Zen and had some trouble with that crazy media stuff..

Ok, every body who knows me knows that I hate that media fuss, to many functions that nobody needs, and to many failures on important stuff. How to mount an <a href="http://en.wikipedia.org/wiki/Media_Transfer_Protocol">MTP</a>-fs I explained in a <a href="http://esmz-designz.com/index.php?site=blog&entry=48&title=MTP_Mountprobleme_behoben">previous posting</a>, here it is in a nutshell:



{% highlight bash %}
# install needed packages (had trouble with mtpfs v0.9, be sure you install < = v0.8)
$ sudo aptitude install mtpfs mtp-tools
# try to find the device
$ mtp-detect
libmtp version: 1.0.3

Listing raw device(s)
Device 0 (VID=041e and PID=4157) is a Creative ZEN.
   Found 1 device(s):
   Creative: ZEN (041e:4157) @ bus 1, dev 11
[...]
# mount the fs
$ mtpfs /mnt/mtp-dev
# after doing crazy work, umounting:
$ fusermount -u /mnt/mtp-dev
{% endhighlight %}

<!-- wp is soo stupid ;) -->

With <a href="http://packages.debian.org/search?keywords=mtpfs&searchon=names&suite=all&section=all">mtpfs</a> version 0.9 and <a href="http://packages.debian.org/search?keywords=libmtp8&searchon=names&suite=all&section=all">libmtp8</a> from sid  I just experienced segfaults reported by dmesg, but the versions from squeeze just work fine.
Of course it is interesting that I'm not able to overwrite existing files:



{% highlight bash %}
itsme@MiniMe /mnt % cp /tmp/chicago.mp3 zen/Music
cp: cannot create regular file `zen/Music/chicago.mp3': Function not implemented
{% endhighlight %}



Curious, but the workaround should be clear ;)

Last but not least I can show you how to play a YouTube video on this device. The easiest way is to install the Firefox extension <a href="http://www.downloadhelper.net/">downloadhelper</a>, so you can download the song as a  `.flv`  file. The usual player don't know what to do with  `.flv` , and of course mine doesn't, so convert it with mencoder. Here is an example:



{% highlight bash %}
# just grab the audio
$ mencoder Sport-ist-ihr-Hobby.flv -of rawaudio -oac mp3lame -ovc copy -o Sport-ist-ihr-Hobby.mp3
# keep the video and create an avi
$ mencoder Sport-ist-ihr-Hobby.flv -oac mp3lame -ovc lavc -o Sport-ist-ihr-Hobby.avi
{% endhighlight %}



The audio file doesn't have meta data yet, so my Zen can't find a name for it (don't know why they didn't implement a fallback to name it by it's filename). To edit the meta tags you can use common tools like <a href="http://amarok.kde.org/">amarok</a> or <a href="http://www.xmms.org/">XMMS</a>, I used <a href="http://easytag.sourceforge.net/">easytag</a>.

So you see, with a little work everything will be fine!
