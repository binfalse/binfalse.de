---
title: "iptables: log and drop"
layout: post
published: true
date: 2017-07-17 21:47:17 +0200
categories:
  - network
  - security
  - administration
  - linuxunix
  - howto
tags:
  - kernel
  - iptables
  - log
  - network
  - remote
  - security
  - trick
---

Linux has a sohpisticated firewall built right into the kernel: It's called `iptables`!
I'm pretty sure you heard about it.
You can do realy crazy things with iptables.
But here I just want to *log* how to log+drop a packet in a single rule.

Usually, you would probably do something like that:

{% highlight bash %}
iptables -A INPUT -j LOG --log-level warning --log-prefix "INPUT-DROP:"
iptables -A INPUT -j DROP
{% endhighlight %}

Works perfectly, but dramatically messes your rules table up..
Especially, if you want to log+drop packets that match a complicated filter.
You'll end up with twice as many table entries as desired..

The trick is to instead create a new rule chain that will log+drop in sequence:

{% highlight bash %}
iptables -N LOG_DROP
{% endhighlight %}

So here I created a new chain called `LOG_DROP`.
We can now append (`-A`) two new rules to that chain, which do the actual drop+log:

{% highlight bash %}
iptables -A LOG_DROP -j LOG --log-level warning --log-prefix "INPUT-DROP:"
iptables -A LOG_DROP -j DROP
{% endhighlight %}

(similar like the first code above, just not for the `INPUT` chain but for the `LOG_DROP` chain)

That's basically it!
If you now need to log+drop a packet you can append a new rule to e.g. the `INPUT` chain that routes the packet to the `LOG_DROP` chain:

{% highlight bash %}
iptables -A INPUT [...filter specification...] -j LOG_DROP
{% endhighlight %}


You should consider to limit the number of redundant log entries per time to prevent flooding of your logs..
For more documentation you should consult the [manual of `iptables(8)`](https://linux.die.net/man/8/iptables).

