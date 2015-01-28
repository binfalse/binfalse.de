---
layout: post
title: 'ShortCut[RegEx]: x-modifier'
tags:
  - explained
  - pattern
  - Programming
  - ShortCut
  - simplification
  - trick
categories:
  - Perl
  - Programming
  - ShortCut
  - Software

---

Independent of your programming experiences, you should have learned that regular expressions are more or less <em>write-only</em>.


Write-only? What is he talking about!?
Actually I revisited some Perl code with a relatively short reg-ex. Do you think I was able to understand what I've thought when I created that piece of code? Not in the slightest!

But there is a smart modifier, that enables you to comment your regular expressions: <strong>x</strong>.
With  `/x`  all white-spaces are ignored and with an unescaped  `#`  the rest of the line is treated as a comment. I found a nice example, what do you think is this expression for:



{% highlight perl %}
/^1?$|^(11+?)\\1+$/
{% endhighlight %}



No idea? Don't even bother, I'm also stumped... <a href="http://montreal.pm.org/tech/neil_kandalgaonkar.shtml">Here is the solution</a>: It's used to check for prime numbers ;-)
Using the x-mod the explanation looks much more readable (via <a href="http://montreal.pm.org/tech/neil_kandalgaonkar.shtml">Neil Kandalgaonkar</a>):



{% highlight perl %}
/
  ^1?$   # matches beginning, optional 1, ending.
         # thus matches the empty string and "1".
         # this matches the cases where N was 0 and 1
         # and since it matches, will not flag those as prime.
|   # or...
  ^                # match beginning of string
    (              # begin first stored group
     1             # match a one
      1+?          # then match one or more ones, minimally.
    )              # end storing first group
    \\1+            # match the first group, repeated one or more times.
  $                # match end of string.
/x
{% endhighlight %}



So you see, it's really helpful to use the x-modifier. At least for your own understanding :-P

A bit more explanation can be found on <a href="http://www.perl.com/pub/2004/01/16/regexps.html">Perl.com</a>.
