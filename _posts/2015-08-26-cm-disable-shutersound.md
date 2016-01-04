---
layout: post
title: 'Disable shutter sound on Cyanogenmod 12'
categories:
  - software
  - phone
  - cyanogen
  - media
tags:
  - cyanogen
  - phone
  - fix
  - google
  - media
  - ssh
  - android
  - trick
---

Everyone knows that annoying shutter sound of the camera app on [Android](https://en.wikipedia.org/wiki/Android_%28operating_system%29) phones. It's against the law to sell android phones which do not make sounds when taking pictures. And in general, it is a good feature as it improves other people privacies.

However, I still want to get rid of the sound. It's a bit tricky, but having a rooted phone (with e.g. [CyanogenMod](https://en.wikipedia.org/wiki/CyanogenMod)) it's very easy: Just delete the sound file `/system/media/audio/ui/camera_click.ogg`! :)

For the lazy: Get a root shell (eg. [ssh](https://en.wikipedia.org/wiki/Secure_Shell) or [adb](https://en.wikipedia.org/wiki/Android_software_development#Android_Debug_Bridge)) and execute the following:

{% highlight bash %}
mount -o remount,rw /system
mv /system/media/audio/ui/camera_click.ogg /system/media/audio/ui/camera_click.ogg.backup
mv /system/media/audio/ui/camera_focus.ogg /system/media/audio/ui/camera_focus.ogg.backup
mount -o remount,ro /system
{% endhighlight %}

Problem solved.
