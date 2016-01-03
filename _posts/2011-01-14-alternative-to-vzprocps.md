---
layout: post
title: 'Alternative to vzprocps'
tags:
  - bash
  - fail
  - hacked
  - trick
  - ugly
  - virtual
categories:
  - operatingsystem
  - shell
  - software
  - university

---

As far as I know the OpenVZ associated vzprocps-tools are just available in version 2.0.11, at least for Debian. Unfortunately they are damn buggy in this version, so unusable...

There are two smart tools included in  `vzprocps` :  `vztop`  and  `vzps` . These programs help you a lot dealing with processes of your running containers. But in 2.0.11 they aren't working:



{% highlight bash %}
root@serv: ~ $ vzps
Segmentation fault
root@serv: ~ $ vztop
 00:29:11  up 1 day,  5:18,  3 users,  load average: 1.14, 1.26, 1.23
1949 processes: 1946 sleeping, 2 running, 1 zombie, 0 stopped
CPU0 states:   0.1% user   0.1% system    0.0% nice   0.0% iowait  98.0% idle
CPU1 states:   4.1% user  15.0% system    0.0% nice   0.0% iowait  80.0% idle
CPU2 states:   2.0% user   3.0% system    0.0% nice   0.0% iowait  94.0% idle
CPU3 states:  14.0% user  20.1% system    0.0% nice   0.0% iowait  64.1% idle
Segmentation fault
root@serv: ~ $
{% endhighlight %}



It seems that there is an update, but not available as  `.deb`  yet. Here is an example for an alternative to  `vzps`  to find zombies:



{% highlight bash %}
CONTAINER=$(/usr/sbin/vzlist | /bin/grep running | /usr/bin/awk '{print $5}')
for ct in $CONTAINER;
do
	echo "processing: $ct";
	/usr/sbin/vzctl exec $ct '/bin/ps -ef | /bin/grep defunct';
done
{% endhighlight %}



It's a bit complicated, but you can write a small script to grep for further things..
