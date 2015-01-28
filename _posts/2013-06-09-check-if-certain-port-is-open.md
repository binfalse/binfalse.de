---
layout: post
title: 'Check if certain Port is Open'
tags:
  - hacked
  - Network
  - Programming
  - Snippet
categories:
  - Network
  - Perl
  - Software

---

Just needed to get to know whether something listens at a certain <a href="http://en.wikipedia.org/wiki/Transmission_Control_Protocol">TCP</a> port on a particular host.



Here is my workaround using Perl:



{% highlight perl %}
my $sock = IO::Socket::INET->new (
	PeerAddr => "1.2.3.4",
	PeerPort => 1337,
	Proto => "tcp",
	Timeout => 1
);
echo "closed" if !defined $sock;
{% endhighlight %}



Works at least for me. Any concerns or better solutions?
