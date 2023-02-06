---
title: "Orbot 17 messes with VPN settings"
layout: post
published: true
date: 2023-01-18 20:34:22 +0100
categories:
  - uncategorized
tags:
  - untagged
lang: en
ref: orbot-17-messes-with-vpn-settings
---

{% include image.html align='alignright' url='/assets/media/commons/Orbot-logo.svg' img='/assets/media/commons/Orbot-logo.svg' title='Orbot Logo from Wikimedia Common' caption='Orbot Logo from Wikimedia Common' maxwidth='200px' %}

I am using [Orbot]() on my [linageos]() mobile phone to route the traffic of certain apps through the [TOR]() network.
Since the app updated to some `17.*-BETA-...` it changed it's icon but it apparently also seems to always start in  <abbr title="virtual private network">VPN</abbr> mode.
I tried a couple of different settings, but even switching into **Power User Mode** (!?) didn't help...

As it's only possible to run a single VPN on Android, it hijacks the VPN connection of [NetGuard](): my defense against traffic that is utterly unsolicited.
NetGuard blocks connections by providing a VPN, which filters traffic based on the source application the the destination's server.

Anyway, if Orbot hijacks the VPN slot NetGuard can't block unwanted traffic anymore.

The workaround is, however, pretty easy.
Just open *Settings* -> *Network and Internet* -> *VPN*.
Then select your preferred VPN app, that you want to use instead of Orbot.
In my case that would be NetGuard.
And from that app's settings enable the **Always-on VPN** slider.
That will prevent Orbot from taking over the next time it connects to the TOR network.





