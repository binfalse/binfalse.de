---
layout: post
title: 'Extended MyTinyTodo'
categories:
  - Junk

---

<a href="http://www.mytinytodo.net/">MyTinyTodo</a> is a self-hosted todo-list which convinces by its simplicity. It allows to maintain several different lists, you can assign tags, priorities and due dates to certain tasks.
I used it myself for a long time and decided to fork the project in order to implement some stuff I missed in the original version.



{% include image.html align="alignright" url="/wp-content/uploads/2013/11/mytinytodo-example.png" img="/wp-content/uploads/2013/11/mytinytodo-example-270x149.png" title=" Figure 1: MyTinyTodo Result" caption=" Figure 1: MyTinyTodo Result" %}

I do not intend to talk about MyTinyTodo a great deal. Very tiny, does nothing that isn't necessary. No Dropbox/Facebook/Instagram etc integration. I really like this kind of software :D

But I was missing an essential feature: Creating tasks via mail.
Lucky us, MyTinyTodo is distributed under the terms of GPLv3 license. Thus, I  `hg clone` d and extended the tool with desired functionality. And since the IDE was already opened I added a tiny authentication (now: username + password; previously:  `.htaccess` ) and secured the API by introducing a signature. Nothing special or complex, but it had to be done.

Long story short: I'm now able to submit tasks via e-mail. That means, a mail containing the following:



{% highlight bash %}
To: todo@your.server.tld
Subject: My New TodoItem
some more text

to describe this todo item

priority:1
tags:someTag1,someTag2
duedate:nextweek
list:myNewList
{% endhighlight %}




will result in something similar to Figure 1. All possible attributes that are recognized in the mail body are listed at the <a href="https://github.com/binfalse/MyTinyTodo/wiki/Mail-Setup">wiki</a> on GitHub.

Find out more on <a href="https://github.com/binfalse/MyTinyTodo/wiki/MyTinyTodo">GitHub</a>.
