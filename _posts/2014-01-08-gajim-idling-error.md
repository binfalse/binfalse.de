---
layout: post
title: 'Gajim idling error'
tags:
  - bug
  - debian
  - fix
  - gajim
  - jabber
  - network
  - programming
  - snippet
categories:
  - network
  - private
  - python
  - software

---

Just stumbled upon a small bug in <a href="http://debian.org/">Debian</a>'s version of <a href="http://gajim.org/">Gajim</a> (0.15.4-2 -- currently in <a href="http://packages.debian.org/search?keywords=gajim&searchon=names&suite=all&section=all">testing and sid</a>).



The following error occurs when Gajim starts to idle:



{% highlight python %}
Traceback (most recent call last):
  File "/usr/share/gajim/src/common/xmpp/idlequeue.py", line 533, in _process_events
    return IdleQueue._process_events(self, fd, flags)
  File "/usr/share/gajim/src/common/xmpp/idlequeue.py", line 394, in _process_events
    obj.pollin()
  File "/usr/share/gajim/src/common/xmpp/transports_nb.py", line 420, in pollin
    self._do_receive()
  File "/usr/share/gajim/src/common/xmpp/transports_nb.py", line 606, in _do_receive
    self._on_receive(received)
  File "/usr/share/gajim/src/common/xmpp/transports_nb.py", line 620, in _on_receive
    self.on_receive(data)
  File "/usr/share/gajim/src/common/xmpp/dispatcher_nb.py", line 488, in dispatch
    handler['func'](session, stanza)
  File "/usr/share/gajim/src/common/connection_handlers.py", line 2009, in _StreamCB
    conn=self, stanza=obj))
NameError: global name 'obj' is not defined
{% endhighlight %}



This results in a dis- and a subsequent reconnection. As the traceback already suggests the error can be found in  `/usr/share/gajim/src/common/connection_handlers.py`  on line 2009. This is the corresponding function:



{% highlight python %}
def _StreamCB(self, con, iq_obj):
        log.debug('StreamCB')
        gajim.nec.push_incoming_event(StreamReceivedEvent(None,
            conn=self, stanza=obj))
{% endhighlight %}



Obviously, there is no variable  `obj` : The passed argument is called  `iq_obj` ...
To fix that mistake just substitute the function definition with (replace  `iq_obj`  &rarr;  `obj`  in line 2006):



{% highlight python %}
def _StreamCB(self, con, obj):
        log.debug('StreamCB')
        gajim.nec.push_incoming_event(StreamReceivedEvent(None,
            conn=self, stanza=obj))
{% endhighlight %}



This bug is already fixed in their <a href="http://hg.gajim.org/gajim/">repository</a> (<a href="http://hg.gajim.org/gajim?cmd=changeset;node=239ec662de5a">13861:239ec662de5a</a>). Thus, this article is mainly for people not familiar with python/programming, who need a quick fix. (wasn't able to find something on the Internet)

Btw. I'm not sure why, but this error just affected one of my four machines which are running Gajim.
