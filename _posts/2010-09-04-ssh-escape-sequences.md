---
layout: post
title: 'SSH escape sequences'
tags:
  - bash
  - debian
  - network
  - remote
  - security
  - ssh
categories:
  - network
  - operatingsystem
  - software

---

Such as telnet the SSH protocol also has a control character, it's the tilde (~).

If you for example want to kill a hanging SSH session just type  `~.` . With  `~^Z`  you can suspend a running session and get back to your local machine. To reactivate it just type  `fg`  (yes, the SSH session is also just a job).
All supported escape sequences will be listed with  `~?` :


{% highlight bash %}
me@remote ~ % ~?
Supported escape sequences:
  ~.  - terminate connection (and any multiplexed sessions)
  ~B  - send a BREAK to the remote system
  ~C  - open a command line
  ~R  - Request rekey (SSH protocol 2 only)
  ~^Z - suspend ssh
  ~#  - list forwarded connections
  ~&  - background ssh (when waiting for connections to terminate)
  ~?  - this message
  ~~  - send the escape character by typing it twice
(Note that escapes are only recognized immediately after newline.)
{% endhighlight %}



All sequences are of course only understood after a newline ;)
