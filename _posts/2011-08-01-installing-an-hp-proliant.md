---
layout: post
title: 'Installing an HP ProLiant'
tags:
  - aptitude
  - debian
  - university
categories:
  - hardware
  - software
  - university

---

I just installed a new server from <a href="http://www.hp.com/">HP</a>, a ProLiant DL180 G6. Here are some notes about the setup.



To check the hardware status you need to install the <a href="http://h18013.www1.hp.com/products/servers/management/psp/index.html">ProLiant Support Package</a>. Running a <a href="http://www.debian.org/">Debian</a>/<a href="http://www.ubuntu.com/">Ubuntu</a> you should import the HP <abbr title="ProLiant Support Package">PSP</abbr> mirror in your  `sources.list` . It can be found <a href="http://downloads.linux.hp.com/SDR/downloads/">here</a>, you might include something like:



{% highlight bash %}
deb http://downloads.linux.hp.com/SDR/downloads/proliantsupportpack/Debian stable current/non-free
{% endhighlight %}



After an  `aptitude update`  you'll find some new packages. I recommend to install  `hpaclui`  to speak to your raid-controllers and  `hp-health`  to interact with your hardware.

With  `hpaclui`  you can ask the raid-controllers for some information:



{% highlight bash %}
usr@srv % hpacucli ctrl all show status

Smart Array P123 in Slot 1
   Controller Status: OK
   Cache Status: OK
   Battery/Capacitor Status: OK

usr@srv % hpacucli ctrl slot=1 show config

Smart Array P123 in Slot 1                (sn: SOMESN  )

   array A (SAS, Unused Space: 0 MB)


      logicaldrive 1 (99.99 GB, RAID 1, OK)

      physicaldrive 1I:1:1 (port 1I:box 1:bay 1, SAS, 99 GB, OK)
      physicaldrive 1I:1:2 (port 1I:box 1:bay 2, SAS, 99 GB, OK)
      [...]

   array B (SAS, Unused Space: 0 MB)


      logicaldrive 2 (99.99 TB, RAID 5, OK)

      physicaldrive 1I:1:3 (port 1I:box 1:bay 3, SAS, 99 TB, OK)
      physicaldrive 1I:1:4 (port 1I:box 1:bay 4, SAS, 99 TB, OK)
      [...]

   Expander 250 (WWID: SOMESN, Port: 1I, Box: 1)

   Enclosure SEP (Vendor ID HP, Model SOMEMD) 248 (WWID: SOMESN, Port: 1I, Box: 1)

   SEP (Vendor ID SOMEVNDR, Model  SOMEMD) 249 (WWID: SOMESN)
{% endhighlight %}



So you get an idea of your storage.

The  `hp-health`  packages comes with a tool called  `hpasmcli` . It's used to query all the hardware states:



{% highlight bash %}
usr@srv % hpasmcli -s "SHOW"

Invalid Arguments
         SHOW ASR
         SHOW DIMM
         SHOW FANS
         SHOW HT
         SHOW NAME
         SHOW PORTMAP
         SHOW POWERMETER
         SHOW POWERSUPPLY
         SHOW SEL
         SHOW SERVER
         SHOW TEMP
         SHOW TPM
         SHOW UID

usr@srv % hpasmcli -s "SHOW POWERSUPPLY"

Power supply #1
        Present  : Yes
        Redundant: Yes
        Condition: Ok
        Hotplug  : Not supported
Power supply #2
        Present  : Yes
        Redundant: Yes
        Condition: Ok
        Hotplug  : Not supported
{% endhighlight %}



Both tools are very easy to use and give a great overview about the health. So I immediately developed a <a href="/software/nagios/check_hp_health-pl/">monitoring plugin</a> that parses the output of those runs. I came to the point, that I wasn't able to find some documentation about the  `hpasmcli`  tool. Most of its output was clear, but I don't know what happens if a fan breaks. The output with working fans looks like:



{% highlight bash %}
usr@srv % hpasmcli -s "SHOW FANS"

Fan  Location        Present Speed  of max  Redundant  Partner  Hot-pluggable
---  --------        ------- -----  ------  ---------  -------  -------------
#1   SYSTEM          Yes     NORMAL  45%     Yes        0        No            
#2   SYSTEM          Yes     NORMAL  43%     Yes        0        No            
#3   SYSTEM          Yes     HIGH    100%    Yes        0        No            
#4   SYSTEM          Yes     HIGH    100%    Yes        0        No            
#5   SYSTEM          Yes     NORMAL  22%     Yes        0        No            
#6   SYSTEM          Yes     NORMAL  21%     Yes        0        No            
#7   SYSTEM          Yes     NORMAL  47%     Yes        0        No            
#8   SYSTEM          Yes     NORMAL  46%     Yes        0        No
{% endhighlight %}



So what if a fan is broken? Is it still  `Present`  and the  `Speed` -string just changes to  `NONE`  or something like that? I send a support request to HP, but all they respond was a premium-rate number to call. Seems that my understanding of service differs from theirs. Since I don't know how the output looks like in an error case (I don't want to stick pencils into new machines) the plugin can't decide whether the fans are OK. If you want to use my <a href="/software/nagios/check_hp_health-pl/">plugin</a> you need to skip fan-checks until HP publishes a document with possible values.
<em>IMHO a public tool should be open source, so I can get those information on my own, or at least well documented!</em>

Btw. HP if you read this, <strong>please include some permanent links</strong> to your web interface ;-)
