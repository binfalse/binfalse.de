---
layout: post
title: 'Lost my gitosis'' post-update'
tags:
  - debian
  - git
  - hacked
  - remote
  - ugly
categories:
  - administration

---

Don't ask me why neither how, but I've lost the gitosis'  `post-update`  on my server. So, among others, the  `.gitosis.conf`  wasn't updated anymore...


Ok, let's start at the beginning. I'm hosting some git repositories on my server using gitosis. Today I tried to create a new repository by editing the  `gitosis.conf`  in the  `gitosis-admin`  repo, but I couldn't push the new created repo to the server:



{% highlight bash %}
~ % git push origin master:refs/heads/master
ERROR:gitosis.serve.main:Repository read access denied
fatal: The remote end hung up unexpectedly
{% endhighlight %}



Damn, looking at the server all rights through the gitosis home seem to be ok. But I was wondering why the  `$HOME/.gitosis.conf`  of the gitosis user wasn't updated!? How could this happen?

After some thoughts I found out, that the link  `$HOME/repositories/gitosis-admin.git/hooks/post-update`  was pointing to nirvana:



{% highlight bash %}
lrwxrwxrwx 1 gitosis gitosis 97 Aug 23  2009 /home/git/repositories/gitosis-admin.git/hooks/post-update -> /usr/share/python-support/gitosis/gitosis-0.2-py2.5.egg/gitosis/templates/admin/hooks/post-update
{% endhighlight %}



Seems that the file  `/usr/share/python-support/gitosis/gitosis-0.2-py2.5.egg/gitosis/templates/admin/hooks/post-update`  was deleted through an update (one week ago I updated  `gitosis 0.2+20090917-9 -> 0.2+20090917-10` ).. Didn't find an announce of it or any workaround, but I identified a template in  `/usr/share/pyshared/gitosis/templates/admin/hooks/post-update` . So the solution (hack) is to link to that file:



{% highlight bash %}
ln -s /usr/share/pyshared/gitosis/templates/admin/hooks/post-update $GITOSISHOME/repositories/gitosis-admin.git/hooks/post-update
{% endhighlight %}



Just replace  `$GITOSISHOME`  with the home of your gitosis user, mine lives for example in  `/home/git` .

Now every think works fine. If anybody has a better solution please tell me!
