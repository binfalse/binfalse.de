---
layout: post
title: 'April fools month'
tags:
  - Bash
  - Junk
  - Media
  - Rumpel
  - University
categories:
  - Administration
  - Junk
  - Shell

---

About one month ago, it was April 1<sup>st</sup>, I attached two more lines to the  `.bashrc`  of Rumpel (he is co-worker and has to operate that day).

These two lines you can see here:


{% highlight bash %}
# kleiner april-scherz von dein freund martin :P
export PROMPT_COMMAND='if [ $RANDOM -le 32000 ]; then printf "\\0337\\033[%d;%dH\\033[4%dm \\033[m\\0338" $((RANDOM%LINES+1)) $((RANDOM%COLUMNS+1)) $((RANDOM%8)); fi'
{% endhighlight %}



{% include image.html align="alignright" url="/wp-content/uploads/2010/05/april-fools-month.png" img="/wp-content/uploads/2010/05/april-fools-month-300x158.png" title="" caption="" %}

With each appearance of the bash prompt this command paints one pixel in the console with a random color. No respect to important content beyond this painting. That can really be annoying and he was always wondering why this happens! For more than one month, until now!

<!--...-->


Today I lift the secret, so Rumpel, I'm very sorry ;) 
