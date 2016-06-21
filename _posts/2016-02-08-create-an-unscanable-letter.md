---
title: "Create an Unscanable Letter"
layout: post
published: true
date: 2016-02-08 14:32:38 +0100
categories:
  - tex
  - junk
tags:
  - LaTeX
  - pdf
  - trick
  - privacy
  - junk
---

{% include image.html align='alignright' url='/assets/media/wp-content/uploads/stuff/tex/eurion/preview.png' img='/assets/media/wp-content/uploads/stuff/tex/eurion/preview.png' title="The EURion constallation on a letter" caption="The EURion constallation on a letter" maxwidth=300px %}

Some time ago I've heard about the [EURion constellation.](https://en.wikipedia.org/wiki/EURion_constellation) Never heard about it? Has nothing to do with stars or astrology. It's the thing on your money! :)

Take a closer look at your bills and you'll discover plenty of EURions, as shown in the picture on the right. Just a few inconspicuous dots. So what's it all about?
The EURion constellation is a pattern to be recognized by imaging software, so that it can recognize banknotes. It was invented to prevent people from copying money :)

But I don't know of any law that prohibits using that EURion, so I've been playing around with it. Took me some trials to find the optimal size, but I was able to create a $$LaTeX$$ document that includes the EURion. That's the essential tex code:


{% highlight latex %}
wanna scan my letter?
\includegraphics[width=7mm]{EURion.pdf}
{% endhighlight %}

The whole $$LaTeX$$ environment can be found on GitHub, together with the EURion image and stuff. I also provide [the resulting letter](/assets/media/wp-content/uploads/stuff/tex/eurion/sample.pdf).

Of course I immediately asked some friends to try to scan the letter, but it turns out, that not all scanners/printers are aware of the EURion... So it's a bit disappointing, but I learned another thing. Good good.
And to be honest, I do not have a good use case. Why should I prevent someone from printing my letters? Maybe photographers can use the EURion in their images. Copyright bullshit or something...
