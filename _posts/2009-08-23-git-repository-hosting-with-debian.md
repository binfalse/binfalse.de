---
layout: post
title: 'Git repository hosting with Debian'
tags:
  - git
  - media
  - network
  - university
categories:
  - network
  - software
  - web

---

<small>This is a translation of <a href="http://esmz-designz.com/index.php?site=blog&entry=39&title=Oh_my_Git">my German entry.</a></small>

Until now I managed my code/work with <a href="http://subversion.tigris.org/">Subversion</a> and all was very well, but I decided to move to a distributed revision control system. Calling spade as a spade my choice was <a href="http://git-scm.com/">Git</a>.

After some tests I had the problem, that there is (basically) no central repository where everyone can commit changes, but I'm working with other guys on homework/projects. So how to centralize a distributed revision control system?
Nothing easier than that!

<h2>Server set up</h2>
Software of choice is called gitosis, so install the following:


{% highlight bash %}
aptitude install git git-core gitosis
{% endhighlight %}


Gitosis will manage repositories and privileges on the repository server. The installation progress will add a new user to your system called  `gitosis`  (see  `/etc/passwd` ). To initialize the master repository that will manage the rest just copy the <a href="/2009/08/ssh-authentication-via-public-key/">SSH public key</a> of your local account to  `/tmp/id_rsa.pub`  and do the following:



{% highlight bash %}
binfalse /home # su - gitosis
gitosis@binfalse:~$ gitosis-init < /tmp/id_rsa.pub
Initialized empty Git repository in /home/git/repositories/gitosis-admin.git/
Reinitialized existing Git repository in /home/git/repositories/gitosis-admin.git/
gitosis@binfalse:~$ exit
{% endhighlight %}

 <!-- fuck -->

That's it on the server, now you have a head-repository and you can manage everything on your local machine.

<h2>Managing the manage-repository</h2>

Right back on your local machine you also have to install Git:



{% highlight bash %}
aptitude install git git-core
{% endhighlight %}



Now you're able to check out the previous created managing repository that knows your SSH key:



{% highlight bash %}
esmz-designz@abakus ~ $ mkdir git
esmz-designz@abakus ~ $ cd git/
esmz-designz@abakus ~/git $ git clone gitosis@HOST:gitosis-admin.git
Initialized empty Git repository in /home/esmz-designz/git/gitosis-admin/.git/
remote: Counting objects: 5, done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 5 (delta 1), reused 5 (delta 1)
Receiving objects: 100% (5/5), done.
Resolving deltas: 100% (1/1), done.
esmz-designz@abakus ~/git $ l
total 12K
drwxr-xr-x 3 esmz-designz 4.0K 2009-08-23 01:19 ./
drwxr-xr-x 21 esmz-designz 4.0K 2009-08-23 01:14 ../
drwxr-xr-x 4 esmz-designz 4.0K 2009-08-23 01:19 gitosis-admin/
esmz-designz@abakus ~/git $ cd gitosis-admin/
esmz-designz@abakus ~/git/gitosis-admin $ l
total 20K
drwxr-xr-x 4 esmz-designz 4.0K 2009-08-23 01:19 ./
drwxr-xr-x 3 esmz-designz 4.0K 2009-08-23 01:19 ../
drwxr-xr-x 8 esmz-designz 4.0K 2009-08-23 01:19 .git/
-rw-r--r-- 1 esmz-designz 89 2009-08-23 01:19 gitosis.conf
drwxr-xr-x 2 esmz-designz 4.0K 2009-08-23 01:19 keydir/
{% endhighlight %}



The directory  `keydir`  holds known SSH keys from users that will work with you,  `gitosis.conf`  is the managing file. It is nearly empty on creation and may look like this:



{% highlight bash %}
[gitosis]

[group gitosis-admin]
writable = gitosis-admin
members = esmz-designz@abakus
{% endhighlight %}



To add a new repository just type something like this:



{% highlight bash %}
[repo RepositoryName]
owner = you@yourhost
description = some description words
{% endhighlight %}



And to create a new group of users:



{% highlight bash %}
[group GroupName]
writable = RepoTheyCanWrite1 RepoTheyCanWrite2
readonly = RepoTheyCanRead1 RepoTheyCanRead2
members = user1@host1 user2@host2
{% endhighlight %}



New users should give you their public key, so you can save it in the  `keydir`  directory with a name like  `user@host.pub` .
To commit the changes you've made type the following:



{% highlight bash %}
esmz-designz@abakus ~/git/gitosis-admin $ git commit -a
[master 51cdf92] Created repository test.
1 files changed, 4 insertions(+), 0 deletions(-)
esmz-designz@abakus ~/git/gitosis-admin $ git push
{% endhighlight %}



Now everybody that was enabled is allowed to checkout your projects. To initiate a new project you can do the following:



{% highlight bash %}
esmz-designz@abakus ~/git/gitosis-admin $ cd ..
esmz-designz@abakus ~/git $ mkdir test
esmz-designz@abakus ~/git $ cd test/
esmz-designz@abakus ~/git/test $ git init
Initialized empty Git repository in /home/esmz-designz/git/test/.git/
esmz-designz@abakus ~/git/test $ git remote add origin gitosis@HOST:test.git
{% endhighlight %}



To commit a first file:



{% highlight bash %}
esmz-designz@abakus ~/git/test $ echo "Usain Bolt" > WM_BERLIN
esmz-designz@abakus ~/git/test $ git add WM_BERLIN
esmz-designz@abakus ~/git/test $ git commit -m "Start der ersten Revision"
[master (root-commit) 444915d] Start der ersten Revision
1 files changed, 1 insertions(+), 0 deletions(-)
create mode 100644 WM_BERLIN
esmz-designz@abakus ~/git/test $ git push origin master:refs/heads/master
Initialized empty Git repository in /home/git/repositories/test.git/
Counting objects: 3, done.
Writing objects: 100% (3/3), 245 bytes, done.
Total 3 (delta 0), reused 0 (delta 0)
To gitosis@HOST:test.git
* [new branch] master -> master
esmz-designz@abakus ~/git/test $
{% endhighlight %}



Voila, there is your repository! Check it out, change it, branch it, you know what to do!

<h2>Publish a repository</h2>
With this configuration only you and a bunch of people can see what you are doing in your spare time, but what if you want to publish you work? You can create a git daemon that listens on <strong>port 9418</strong> of your server, waiting for a user who wants clone your code:



{% highlight bash %}
binfalse /home # sudo -u gitosis git-daemon --base-path=$GITOSISHOME/repositories --verbose --detach
binfalse /home # ps -ef | grep git
gitosis 3216 1 0 00:57 ? 00:00:00 git-daemon --base-path=$GITOSISHOME/repositories/ --verbose --detach
binfalse /home #
{% endhighlight %}



This service will serve any repository content if you create a file called  `$REPOSITORYHOME/git-daemon-export-ok`  in this repository (content isn't necessary). Everybody knows that such a daemon tends to die sometimes, so I created a cronjob:



{% highlight bash %}
*/5 * * * * [ -z `pidof git-daemon` ] && sudo -u gitosis git-daemon --base-path=$GITOSISHOME/repositories/ --verbose --detach
{% endhighlight %}



Now everybody can clone repositories with that special file that allows public cloning by:



{% highlight bash %}
git clone git://HOST/REPOSITORY.git
{% endhighlight %}



That's it! not that difficult but one has to know what to do!
Have fun with your repository.
