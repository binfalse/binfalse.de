---
layout: post
title: 'Sync the clock w/o NTP'
tags:
  - Debian
  - fail
  - Network
  - remote
  - Security
  - time
  - trick
  - Ubuntu
  - ugly
  - University
categories:
  - Administration
  - Debian
  - LinuxUnix
  - Network
  - Security
  - University

---

<p>The <a href="http://en.wikipedia.org/wiki/Network_Time_Protocol">network time protocol</a> (NTP) is a really smart and useful protocol to synchronize the time of your systems, but even if we are in two-thousand-whatever there are reasons why you need to seek for alternatives...</p>



<p>You may now have some kind of &raquo;<em>what the [cussword of your choice]</em>&laquo; in mind, but I have just been in an ugly situation. All <a href="http://en.wikipedia.org/wiki/User_Datagram_Protocol">UDP</a> traffic is dropped and I don't have permissions to adjust the firewall.. And you might have heard about the consequences of time differences between servers. Long story short, there is a good solution to sync the time via <a href="http://en.wikipedia.org/wiki/Transmission_Control_Protocol">TCP</a>, using the <a href="http://www.apps.ietf.org/rfc/rfc868.html">Time Protocol</a> and a tool called <a href="http://en.wikipedia.org/wiki/Rdate"> `rdate` </a>.</p>

<h2>Time Master</h2>
<p>First off all you need another server having a correct time (e.g. NTP sync'ed), which can be reached at port 37. Let's call this server  `$MASTER` . To enable the Time Protocol on  `$MASTER`  you have to enable the time service in (<a href="http://en.wikipedia.org/wiki/Xinetd">x</a>)<a href="http://en.wikipedia.org/wiki/Inetd">inetd</a>. For instance to enable the TCP service for a current  `xinetd`  you could create a file in  `/etc/xinetd.d/time`  with the following contents:</p>



{% highlight bash %}
service time 
{
    disable     = no 
    type        = INTERNAL
    id          = time-stream
    socket_type = stream
    protocol    = tcp
    user        = root 
    wait        = no 
}
{% endhighlight %}



<p>Such a file may already exist, so you just have to change the value of the  `disable` -key to  `no` . Still using <em>inetd</em>? I'm sure you'll find your way to enable the time server on your system <a href="http://www.tldp.org/LDP/nag/node125.html">:)</a></p>

<h2>Time Slave</h2>
<p>On the client, which is not allowed to use NTP (wtfh!?), you need to install  `rdate` :</p>



{% highlight bash %}
aptitude install rdate
{% endhighlight %}



<p>Just call the following command to synchronize the time of the client with  `$MASTER` :</p>



{% highlight bash %}
rdate $MASTER
{% endhighlight %}



<p>Since  `rdate`  immediately corrects the time of your system you need to be root to run this command.</p>

<p>Finally, to readjust the time periodically you might want to install a cronjob. Beeing root call  `crontab -e`  to edit root's crontab and append a line like the following:</p>



{% highlight bash %}
# m     h       dom     mon     dow     command
0       */6     *       *       *       [ -x /usr/bin/rdate ] &amp;&amp; /usr/bin/rdate $MASTER &gt;&gt; /dev/null
{% endhighlight %}



<p>This will synchronize the time of your client with the time of  `$MASTER`  every six hours. (Don't forget to substitute  `$MASTER`  using your desired server <a href="http://en.wikipedia.org/wiki/Internet_Protocol">IP</a> or <a href="http://en.wikipedia.org/wiki/Domain_Name_System">DNS</a>.)</p>

<h2>Notes</h2>
<p>Last but not least I want you to be aware that this workaround <strong>just</strong> keeps the difference in time between both systems <strong>less than 0.5 secs</strong>. Beyond all doubt, looking at NTP that's very poor. Nevertheless, 0.5 secs delay is much better than several minutes or even hours!</p>

<p>If it is also not permitted to speak to port 37 you need to tunnel your connections or you have to tell the time server to listen to another, more common port (e.g. <a href="http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol">80</a>, <a href="http://en.wikipedia.org/wiki/Https">443</a>, or <a href="http://en.wikipedia.org/wiki/IMAPS">993</a>), as long as they are not already allocated by other services..</p>
