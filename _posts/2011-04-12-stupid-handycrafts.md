---
layout: post
title: 'Stupid handycrafts'
tags:
  - fail
  - junk
  - ngs
  - ugly
  - university
categories:
  - hardware
  - junk
  - university

---

Today I had to install a new server for some biologists, they want to do some <abbr title="next generation sequencing">NGS</abbr>. It took a whole day and all in all we'll send it back...



{% include image.html align="alignright" url="/wp-content/uploads/2011/04/zoologie-innenleben.jpg" img="/wp-content/uploads/2011/04/zoologie-innenleben-150x150.jpg" title="" caption="" %}

These biologists ordered the server without asking us, I think the salesmen noticed that they don't have expertise. The money is provided by the university, so no need to design for efficiency. And that is how it came that they send the hardware (2 Xeon-DP 5500, 72 GB mem) in a desktop case with a Blu-ray writer, a DVD-writer, a <a href="http://www.amd.com/de/products/desktop/graphics/ati-radeon-hd-5000/hd-5870/Pages/ati-radeon-hd-5870-overview.aspx#2">GPU</a> with 2.72 TeraFLOPS (afaik they don't want to OpenCL) and: <strong>NO CHASSIS FANS</strong>!! Ouch..

It's as clear as daylight that this cannot work. Did they thought the hot air around the mem (18 slots, each 4GB) leaves the chassis by diffusion??
The processor cooling construction for my Athlon X2 is twice as big as all their fans together...

{% include image.html align="alignright" url="/wp-content/uploads/2011/04/zoologie-memtemp.jpg" img="/wp-content/uploads/2011/04/zoologie-memtemp-150x150.jpg" title="" caption="" %}

After setting up a Linux and installing  `lm-sensors`  the CPU's are running at >75°C, fighting for air. Of course we immediately turned off the hardware! After half an hour we were able to start it again and took a look at the BIOS sensors for the memory. No time to get bored while the temperatures raised up to 80°C and more in less than 5 min, see figure 2... Of course time to turn it off again! Don't want to hazard a nuclear meltdown..

They also enclosed a raid controller. I've googled that. Less than 100$.. wtf...
The controller came with a CD to create a driver disk. But when you boot into the small Linux on the CD it hangs with the message "Searching for CD...". And there is no driver for us, you are only able to use this controller when you are running Win 2003/XP/Vista or a RHEL or a Suse Enterprise. Other systems are not supported.. Proprietary crap..

What should I say, I'm pissed off. A whole business day is gone for nothing... Just because of some less-than-commodity handycrafts...
I strongly recommend to ask <a href="http://0rpheus.net/privat/junior-system-architekt">Micha</a> before plugging such bullshit!
