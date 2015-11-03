---
layout: post
title: 'CyanogenMod Updates and the firewall'
categories:
  - software
  - phone
  - cyanogen
  - media
tags:
  - cyanogen
  - phone
  - media
  - android
---

{% include image.html align="alignleft" url="/assets/media/pics/2015/cmupdate/cm-updater.png" img="/assets/media/pics/2015/cmupdate/cm-updater.png" title="Screenshot of the Update Tool" caption="Screenshot of the Update Tool" maxwidth="150px" %}

I'm running [CyanogenMod](https://en.wikipedia.org/wiki/CyanogenMod) on my phone and I have the firewall [AFWall+](https://f-droid.org/repository/browse/?fdid=dev.ukanth.ufirewall) installed.


{% include image.html align="alignright" url="/assets/media/pics/2015/cmupdate/cm-updater-fw.png" img="/assets/media/pics/2015/cmupdate/cm-updater-fw.png" title="Screenshot of the firewall with important rules" caption="Screenshot of the firewall with important rules" maxwidth="150px" %}

To update the list of available updates the application **CM Updater** need to be able to connect to the internet. It will contact a website from within the google empire and ask for available images.

In order to download a new image the application **Media Storage, Download Manager, Downloads** needs internet access, as this app is in charge of downloading the actual image file.

To be remembered.
