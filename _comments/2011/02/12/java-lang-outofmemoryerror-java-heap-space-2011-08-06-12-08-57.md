---
date: '2011-08-06 12:08:57'
link: ''
name: PedroA
post_id: /2011/02/12/java-lang-outofmemoryerror-java-heap-space
---

OutOfMemory errors can be caused by several things: 

Overcache, not well tuned JVM startup options, permgen out of memories, HttpSessions not purging or low frequency purge,  or buggy code.

Usually buggy code is the most typical one (80 % of the time or more), which is called a memory leak. Basically it happens because in some part of your code someone is adding elements -typically to a static collection/map- and never removes it. This preventing the GC to free up memory.

It is important to notice that increasing Memory space, if this is the case is not fixing anything: just delaying the problem to appear, but degrading your performance as well because of major GC work (more memory to clean).

Often  this is is shown after some hour of heavy load conditions, or after several days running and finishes with a java.lang.OutOfMemoryError, or server crash after several hours of really low performance, and heavy load CPU conditions (because GC cycles increase).

It is really hard to deal with these problems. My suggestion is to use one of the next mechanisms:

1) Downloading some sort of memory dumps, enable app server memory dumps,  and wait for the OutOfMemory to appear one more time

2) Using some byte code instrumentation tool that can quickly identify potential leaks, even if you do not get the OutOfMemoryError. I have been using Antorcha Memory Plumber light, a free handy tool from Lucierna APM during this week with excellent results. http://ctoblog.lucierna.com/ultimate-weapon-lucierna-kill-memory-leaks/

Hope this can be useful for all the users.