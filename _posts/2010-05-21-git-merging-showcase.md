---
layout: post
title: 'Git merging showcase'
tags:
  - explained
  - git
  - Network
  - Rumpel
  - userinteraction
categories:
  - Network
  - Software

---

One of the people that are working with me on some crazy stuff always forgets to pull the newest revision of the repository before changing the content and so he has very often trouble with different versions when he decides to push his work to the master repository. His actual workaround is to check out the complete repository in a new directory and merge his changes by hand into this revision...
Here is a little instruction to maximize his productivity and minimize the network traffic.

Lets assume we have a repository, created like this:



{% highlight bash %}
/tmp % git init --bare root
{% endhighlight %}



And we have one user, that clones this new repository and inits:



{% highlight bash %}
/tmp % git clone root slave1
/tmp % cd slave1
/tmp/slave1 (git)-[master] % echo "line1\\nline2" >> testfile
/tmp/slave1 (git)-[master] % cat testfile
line1
line2
/tmp/slave1 (git)-[master] % git add .
/tmp/slave1 (git)-[master] % git commit -m "init"
[master (root-commit) bc7e4da] init
 1 files changed, 2 insertions(+), 0 deletions(-)
 create mode 100644 testfile
/tmp/slave1 (git)-[master] % git push ../root master
{% endhighlight %}



So we have some content in our root repo. Another user (our bad guy) clones that repository too:



{% highlight bash %}
/tmp % git clone root slave2
{% endhighlight %}



So let a bit of time elapse, while user one is changing the root repository so that the  `testfile`  may look like this:



{% highlight bash %}
/tmp/slave1 (git)-[master] % cat testfile | sed 's/line1/&\\nline1a/' > testfile.tmp && mv testfile.tmp testfile
/tmp/slave1 (git)-[master] % cat testfile
line1
line1a
line2
{% endhighlight %}



And of course, the changer commits his changes:



{% highlight bash %}
/tmp/slave1 (git)-[master] % git commit -a -m "haha, root has changed..."
[master e18f637] haha, root has changed...
 1 files changed, 1 insertions(+), 0 deletions(-)
/tmp/slave1 (git)-[master] % git push ../root master
Counting objects: 5, done.
Writing objects: 100% (3/3), 265 bytes, done.
Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
To ../root
   bc7e4da..a04d363  master -> master
{% endhighlight %}



Ok, nothing bad happened, but now our special friend decides to work:



{% highlight bash %}
/tmp/slave2 (git)-[master] % cat testfile | sed 's/line1/&\\nline1b/' > testfile.tmp && mv testfile.tmp testfile
/tmp/slave2 (git)-[master] % cat testfile
line1
line1b
line2
/tmp/slave2 (git)-[master] % git commit -a -m "oops, i am very stupid..."
[master d691ada] oops, i am very stupid...
 1 files changed, 1 insertions(+), 0 deletions(-)
{% endhighlight %}



What do you think will happen if he tries to push his changes to the master repo? Your right, nothing but a error:



{% highlight bash %}
/tmp/slave2 (git)-[master] % git push ../root master
To ../root
 ! [rejected]        master -> master (non-fast-forward)
error: failed to push some refs to '../root'
To prevent you from losing history, non-fast-forward updates were rejected
Merge the remote changes before pushing again.  See the 'Note about
fast-forwards' section of 'git push --help' for details.
{% endhighlight %}



Mmmh, so lets try to pull the root repo:



{% highlight bash %}
/tmp/slave2 (git)-[master] % git pull ../root master
remote: Counting objects: 5, done.
remote: Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
From ../root
 * branch            master     -> FETCH_HEAD
Auto-merging testfile
CONFLICT (content): Merge conflict in testfile
Automatic merge failed; fix conflicts and then commit the result.
{% endhighlight %}



Our friend would now check out the whole repository and insert his changes by hand, but <strong>whats the better solution? Merging the file!</strong>
Git has a function called  `mergetool` , you can merge the conflicts with a program of your choice. Some examples are  `vimdiff` ,  `xxdiff` ,  `emerge`  or also for GUI lovers  `kdiff3` .
In this post I'll use  `vimdiff` :



{% highlight bash %}
/tmp/slave2 (git)-[master|merge] % git mergetool --tool=vimdiff testfile

Normal merge conflict for 'testfile':
  {local}: modified
  {remote}: modified
Hit return to start merge resolution tool (vimdiff): 
3 files to edit
{% endhighlight %}



So change the conflicting file(s), you will also see the changes made in root's and in your local revision. If you're done just save it and commit your merge:



{% highlight bash %}
/tmp/slave2 (git)-[master|merge] % git commit -m "merged"
[master 6be1482] merged
{% endhighlight %}



Great, now there is nothing that prevents you from pushing your changes to the root repository:



{% highlight bash %}
/tmp/slave2 (git)-[master] % git push ../root master
Counting objects: 10, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (6/6), 555 bytes, done.
Total 6 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (6/6), done.
To ../root
   a04d363..6be1482  master -> master
{% endhighlight %}



I think this way of solving such conflicts maybe much more efficient than cloning the whole repository again and again and again ;)
