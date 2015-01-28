---
layout: post
title: 'Smart game'
tags:
  - c
  - game
  - Programming
  - puzzle
categories:
  - CC
  - Software

---

Yesterday, while waiting in traffic jam, I implemented a small game. I read about this game in a book and before I was even annoying about the waiting time I opened the lid of my laptop and wrote this game. This morning I completed it with some usual stuff to increase the usability..

It's written in C++ and you can play against the CPU. There is a strategy that makes you win in almost every case! This game is a classic in game theory, but when I give you it's original name it is to easy for you to solve the problem with help from Wikipedia or something like that.
So just try it on you own ;)

The aim of the game is to clear all the stacks that are filled with  `o` 's. The stacks may look like this:


{% highlight bash %}
stack   size
0:      ooooo (5)
1:      oooooo (6)
2:      ooooooo (7)
3:      ooooooo (7)
4:      oooo (4)
5:      oooooooo (8)
6:      oooooo (6)
{% endhighlight %}


Now it is your turn to choose one of these stacks and remove some or all  `o` 's of it. Please notice that you have to remove at least one of them and you can only remove  `o` 's from <strong>one</strong> single stack!
After your turn, the <em>artificial intelligence</em> will do the same. Afterward it's again your turn, until all stacks are cleared. Winner is the one who cleared the last stack, so try to get the last  `o`  ;)
<a href='/wp-content/uploads/pipapo/c-cpp/nim.cpp'>Here is the download</a>.

The number of stacks and the maximum number of  `o` 's a stack can carry you can choose by your own:


{% highlight bash %}
USAGE:
        -n      number of stacks [2..30]
        -m      maximal stack size [5..50]
{% endhighlight %}



If anybody knows the strategy, feel free to tell me!
<div class="download"><strong>Download:</strong>
C++: <a href='/wp-content/uploads/pipapo/c-cpp/nim.cpp'>NIM - the game</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
