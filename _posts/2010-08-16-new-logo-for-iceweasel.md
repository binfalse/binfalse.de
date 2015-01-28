---
layout: post
title: 'New logo for Iceweasel'
tags:
  - Iceweasel
  - Junk
  - LaTeX
  - Thunderbird
  - ugly
categories:
  - Junk
  - tex

---

Actually iceweasel is <a href="http://mozilla.debian.net/en-US/logos/">searching for a new logo</a>.

When I updated a PC of our work group I recognized that <a href="http://de.wikipedia.org/wiki/Namensstreit_zwischen_Debian_und_Mozilla">iceweasel, iceape and icedove</a> are searching for new logos. <a href="http://0rpheus.net/sonstiges/neues-logo-fur-iceweasel">Micha</a> just created one for iceweasel with <a href="http://www.xfig.org/">xfig</a>, here is a similar one with <a href="http://sourceforge.net/projects/pgf/">tikz</a>:


{% highlight latex %}
\\begin{tikzpicture}
\\draw (-1,0) circle (1cm);
\\draw (-1.2,0.3) circle (0.15cm);
\\draw (-0.11,-0.4) -- (1,-1);
\\draw (1,-1) -- (3,-1);
\\draw (2,-1) -- (2.5,-2);
\\draw (2,-1) -- (1.5,-2);
\\draw (4,-1) -- (6,-1);
\\draw (6,-1) -- (6.5,-2);
\\draw (6,-1) -- (5.5,-2);
\\draw (6,-1) -- (8,0.5);
\\draw (-1.9,-0.4) .. controls +(190:1.8cm) and +(180:1.2cm) .. (-2,0);
\\draw (-0.7,0.95) .. controls +(90:0.2cm) and +(60:1.8cm) .. (-1.1, 1);
\\draw (-1.5,0.85) .. controls +(60:1.6cm) and +(60:0.2cm) .. (-0.85, 1.4);
\\draw (3.5,-3) -- (2.5,1);
\\draw (3.5,-3) -- (4.5,1);
\\draw (3.5,2.5) circle (1cm);
\\filldraw [white, draw=black] (2.8,1.7) circle (1cm);
\\filldraw [white, draw=black] (4,1.5) circle (1cm);
\\end{tikzpicture}
{% endhighlight %}



{% include image.html align="alignright" url="/wp-content/uploads/2010/08/iceweasel-new-logo.png" img="/wp-content/uploads/2010/08/iceweasel-new-logo-300x179.png" title="" caption="" %}

If the maintainer understand something about art they will use one of our creations! ;) 
