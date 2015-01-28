---
layout: post
title: 'Vim plugin for R'
tags:
  - Bioinformatics
  - GNU
  - Programming
  - trick
  - userinteraction
  - vim
categories:
  - Bioinformatics
  - R
  - Software

---

Just found a very nice <a href="http://www.vim.org/scripts/script.php?script_id=2628">plugin for using R in Vim</a>. It's unbelievable comfortable!


There are at least two ways to install it. If your are working on a Debian based distro you can use the  `.deb`  package provided by <a href="http://sites.google.com/site/jalvesaq/vimrplugin">the author Jakson Alves de Aquino</a> itself. On this site you'll also find some smart screen shots.
Another way is the installation by hand (I did so). Download the package, in your download directory type something like this:



{% highlight bash %}
mkdir -p ~/.vim 
unzip vim-r-plugin-*.zip -d ~/.vim
{% endhighlight %}



Yes, that's it!
To start an R session just open a R-file ( `.R`  or  `.Rnw`  or  `.Rd` ) with vim and type  `\\rf` . To close the session type  `\\rq`  (not saving hist) or \\rw (saving history).
The handling needs to getting used to.. Here is a list of common commands from the documentation (might want to print them as a cheat sheet!?) :



{% highlight bash %}
Start/Close
  . Start R (default)                                    \\rf
  . Start R --vanilla                                    \\rv
  . Start R (custom)                                     \\rc
  ----------------------------------------------------------
  . Close R (no save)                                    \\rq
  . Close R (save workspace)                             \\rw
-------------------------------------------------------------

Send
  . File                                               \\aa
  . File (echo)                                        \\ae
  . File (open .Rout)                                  \\ao
  --------------------------------------------------------
  . Block (cur)                                        \\bb
  . Block (cur, echo)                                  \\be
  . Block (cur, down)                                  \\bd
  . Block (cur, echo and down)                         \\ba
  --------------------------------------------------------
  . Function (cur)                                     \\ff
  . Function (cur, echo)                               \\fe
  . Function (cur and down)                            \\fd
  . Function (cur, echo and down)                      \\fa
  --------------------------------------------------------
  . Selection                                          \\ss
  . Selection (echo)                                   \\se
  . Selection (and down)                               \\sd
  . Selection (echo and down)                          \\sa
  --------------------------------------------------------
  . Paragraph                                          \\pp
  . Paragraph (echo)                                   \\pe
  . Paragraph (and down)                               \\pd
  . Paragraph (echo and down)                          \\pa
  --------------------------------------------------------
  . Line                                                \\l
  . Line (and down)                                     \\d
  . Line (and new one)                                  \\q
-----------------------------------------------------------

Control
  . List space                                         \\rl
  . Clear console                                      \\rr
  . Clear all                                          \\rm
  --------------------------------------------------------
  . Object (print)                                     \\rp
  . Object (names)                                     \\rn
  . Object (str)                                       \\rt
  --------------------------------------------------------
  . Arguments (cur)                                    \\ra
  . Example (cur)                                      \\re
  . Help (cur)                                         \\rh
  --------------------------------------------------------
  . Summary (cur)                                      \\rs
  . Plot (cur)                                         \\rg
  . Plot and summary (cur)                             \\rb
  --------------------------------------------------------
  . Update Object Browser                              \\ro
  . Set working directory (cur file path)              \\rd
  . Build R tags file                   :RBuildTags
  . Build omniList (loaded packages)    :RUpdateObjList
  . Build omniList (installed packages) :RUpdateObjListAll
  --------------------------------------------------------
  . Sweave (cur file)                                  \\sw
  . Sweave and PDF (cur file)                          \\sp
  . Go to next R chunk                                  gn
  . Go to previous R chunk                              gN
  --------------------------------------------------------
{% endhighlight %}



{% include image.html align="alignright" url="/wp-content/uploads/2010/12/vim-r-plugin.png" img="/wp-content/uploads/2010/12/vim-r-plugin-150x150.png" title="" caption="" %}

But if you got used to, it's very handy! At the start-up it opens a new R-console (just close it, doesn't matter) and you can send single lines, a block or a whole file to R (see the documentation). Every thing I tried worked really fine!

A small example in action is presented in the image. In an <a href="/2010/12/value-of-an-r-object-in-an-expression/">earlier post</a> I explained how to produce such a title consisting of R objects and Greek letters.

I've attached the documentation of this plugin, first and foremost for me for cheating, but of course you're allowed to use it also ;-)

<div class="download"><strong>Download:</strong>
HTML: <a href='/wp-content/uploads/2010/12/vim-r-plugin-101217.html'>Vim-R-plugin documentation</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
