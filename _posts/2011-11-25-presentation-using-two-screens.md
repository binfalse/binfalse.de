---
layout: post
title: 'Presentation using two screens'
tags:
  - keyboard
  - media
  - notebook
  - rumpel
  - trick
  - university
  - x
categories:
  - linuxunix
  - media
  - software
  - university
  - unix

---

Yesterday I attended a presentation of a colleague, but unfortunately during his speech the PDF viewer on his laptop crashed.


His supervisor told him to use  `pdf_presenter_console` . Don't know whether you've already heard about this tool? It's able to display the current slide on the beamer-screen while you can see the next slide on your real screen. Generally a nice idea, but the software seemed to be a bit unstable ;-)

Anyway, I always wanted to find a solution to see some notes for a single slide while the slide is active, and today I set to work.

I searched for tools that are able to open two different PDF's at once, I tried <a href="http://impressive.sourceforge.net/">impressive</a>, some <a href="http://en.wikipedia.org/wiki/Virtual_Network_Computing">vnc</a> hacks, and so on, until I realized that there is already a smart solution on my laptop using the lightweight PDF viewer <a href="http://www.foolabs.com/xpdf/">XPDF</a>!

XPDF has a nice remote feature, if you run it like



{% highlight bash %}
xpdf -remote SOMEID presentation.pdf &
{% endhighlight %}



you can use your terminal to send some commands to the viewer. For example to go to the next slide try the following (see the  `COMMANDS`  section of <a href="http://linux.die.net/man/1/xpdf">XPDFs man page</a>):



{% highlight bash %}
xpdf -remote SOMEID -exec nextPage
{% endhighlight %}



Great, isn't it!? (if you receive the error  `error: "nextPage" file not found`  scroll down to <em>XPDF is buggy</em>)

I think the rest is clear, open two different XPDF-instances, one for the notes and one for the presentation itself:



{% highlight bash %}
usr@srv % xpdf -remote NOTES notes.pdf &
usr@srv % xpdf -remote PRESENTATION presentation.pdf &
{% endhighlight %}



and define some keys to scroll through the PDFs. You could use  `xbindkeys`  to bind the keys to the commands, for example I use  `F9`  to go to the next slide and added the following to my  `~/.xbindkeysrc` :



{% highlight bash %}
"xpdf -remote PRESENTATION -exec nextPage && xpdf -remote NOTES -exec nextPage"
    m:0x10 + c:75
{% endhighlight %}



After running 



{% highlight bash %}
xbindkeys -f ~/.xbindkeysrc
{% endhighlight %}



I'm able to go to the next slide by pressing  `F9` . To find the keycodes for some keys you may use  `xbindkeys -k`  or  `xev` . Take a look at the <a href="https://help.ubuntu.com/community/KeyboardShortcuts#Text_Entry_Shortcuts">documentation</a> for more information (<a href="http://wiki.ubuntuusers.de/xbindkeys">GER</a>).
Of course  `presentation.pdf`  and  `notes.pdf`  should have the same number of pages ;-)

<h2>XPDF is buggy</h2>
The  `-exec`  flag didn't work for me, returning the following error:



{% highlight bash %}
usr@srv % xpdf -remote SOMEID -exec nextPage
error: "nextPage" file not found
{% endhighlight %}



I tried version 3.02 and also 3.03. The problem is located in the XPDF wrapper script, located in  `/usr/bin/xpdf` . If you take a look at the contents you'll find the following lines (in my case it's 25ff):



{% highlight bash %}
while [ "$#" -gt "0" ]; do
    case "$1" in
    -z|-g|-geometry|-remote|-rgb|-papercolor|-eucjp|-t1lib|-ps|-paperw|-paperh|-upw)
        cmd="$cmd $1 "$2"" && shift ;;
    -title)
        title="$2" && shift ;;
    -m)
{% endhighlight %}



They simply forgot to define the  `-exec`  parameter to take an argument. So  `nextPage`  is not seen as argument for  `-exec`  and XPDF tries to find a file called  `nextPage`  that is obviously not present. To patch this you just need to add  `-exec`  like:



{% highlight bash %}
while [ "$#" -gt "0" ]; do
    case "$1" in
    -z|-g|-geometry|-remote|-rgb|-papercolor|-eucjp|-t1lib|-ps|-paperw|-paperh|-upw|-exec)
        cmd="$cmd $1 "$2"" && shift ;;
    -title)
        title="$2" && shift ;;
    -m)
{% endhighlight %}



or just use  `xpdf.real`  directly and skip the wrapper:



{% highlight bash %}
usr@srv % xpdf.real -remote SOMEID -exec nextPage
{% endhighlight %}



Since modifying files in  `/usr/bin`  isn't a good idea I recommend to just substitute  `xpdf`  for  `xpdf.real`  in your  `~/.xbindkeysrc` .

That's it for the moment, I wish you a nice presentation ;-)
