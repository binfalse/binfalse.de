---
layout: post
title: 'Too much at once'
tags:
  - aptitude
  - debian
  - fail
  - grml
  - junk
  - sid
  - trick
  - ugly
  - university
categories:
  - debian
  - software
  - university

---

Just installed a new <a href="http://grml.org/">Grml</a> system, annoyingly from a bit too far outdated image so <a href="http://packages.debian.org/aptitude">aptitude</a> fails to handle everything at once...


Here is the error:



{% highlight ruby %}
Reading package fields... 52%/usr/lib/ruby/1.8/debian/utils.rb:47:in 'pipe': Too many open files (Errno::EMFILE)
        from /usr/lib/ruby/1.8/debian/utils.rb:47:in 'pipeline'
        from /usr/lib/ruby/1.8/debian/utils.rb:86:in 'tar'
        from /usr/lib/ruby/1.8/debian.rb:142:in 'load'
        from /usr/lib/ruby/1.8/debian/utils.rb:75:in 'gunzip'
        from /usr/lib/ruby/1.8/debian/utils.rb:40:in 'pipeline'
        from /usr/lib/ruby/1.8/debian/utils.rb:72:in 'gunzip'
        from /usr/lib/ruby/1.8/debian.rb:141:in 'load'
        from /usr/lib/ruby/1.8/debian/ar.rb:150:in 'open'
        from /usr/lib/ruby/1.8/debian/ar.rb:147:in 'each'
        from /usr/lib/ruby/1.8/debian/ar.rb:147:in 'open'
        from /usr/lib/ruby/1.8/debian.rb:140:in 'load'
        from /usr/lib/ruby/1.8/debian.rb:82:in 'field'
        from /usr/share/apt-listbugs/apt-listbugs/logic.rb:733:in 'field'
        from /usr/share/apt-listbugs/apt-listbugs/logic.rb:751:in 'create'
        from /usr/share/apt-listbugs/apt-listbugs/logic.rb:743:in 'each_index'
        from /usr/share/apt-listbugs/apt-listbugs/logic.rb:743:in 'create'
        from /usr/sbin/apt-listbugs:323
/usr/lib/ruby/1.8/debian.rb:198:in 'parseFields': E: required field Package not found in  (Debian::FieldError)
        from /usr/lib/ruby/1.8/debian.rb:196:in 'each'
        from /usr/lib/ruby/1.8/debian.rb:196:in 'parseFields'
        from /usr/lib/ruby/1.8/debian.rb:439:in 'initialize'
        from /usr/lib/ruby/1.8/debian.rb:150:in 'new'
        from /usr/lib/ruby/1.8/debian.rb:150:in 'load'
        from /usr/lib/ruby/1.8/debian.rb:82:in 'field'
        from /usr/share/apt-listbugs/apt-listbugs/logic.rb:733:in 'field'
        from /usr/share/apt-listbugs/apt-listbugs/logic.rb:751:in 'create'
        from /usr/share/apt-listbugs/apt-listbugs/logic.rb:743:in 'each_index'
        from /usr/share/apt-listbugs/apt-listbugs/logic.rb:743:in 'create'
        from /usr/sbin/apt-listbugs:323
E: Failed to fetch http://cdn.debian.net/debian/pool/main/k/krb5/libgssrpc4_1.8.3+dfsg-4_i386.deb: 404  Not Found
E: Sub-process /usr/sbin/apt-listbugs apt || exit 10 returned an error code (10)
E: Failure running script /usr/sbin/apt-listbugs apt || exit 10
A package failed to install.  Trying to recover:
Press return to continue.
{% endhighlight %}



Aha, too many open files.. So I had to install everything piecewise in a disturbing manner..

Btw. updating  `iptables 1.4.6-2 -> 1.4.10-1`  before  `xtables-addons-common 1.23-1 -> 1.26-2`  is a bad idea and fails for some reasons. So try to do it the other way round.
