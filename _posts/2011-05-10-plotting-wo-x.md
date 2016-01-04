---
layout: post
title: 'Plotting w/o X'
tags:
  - crazy
  - gnu
  - remote
  - simplification
  - trick
  - x
categories:
  - media
  - software

---

This might be interesting for non-X fans like me. I just found a nice way to plot to a simple terminal.



Using <a href="http://www.gnuplot.info/">gnuplot</a> you can enable terminal plots via  `set term dumb` . Here is an example:



{% highlight gnuplot %}
gnuplot> set term dumb
Terminal type set to 'dumb'
Options are 'feed  size 79, 24'
gnuplot> plot [0:6.3] sin(x)

     1 ++---------+--*******-+---------+----------+----------+----------+-++
       +          ***       ***        +          +          sin(x) ****** |
   0.8 ++        *            ***                                         ++
       |       **               **                                         |
   0.6 ++    **                   *                                       ++
       |    *                      **                                      |
   0.4 ++  *                         *                                    ++
       |  *                           **                                   |
   0.2 +**                             *                                  ++
     0 **                               **                                +*
       |                                 **                               *|
  -0.2 ++                                  *                             **+
       |                                   **                           *  |
  -0.4 ++                                    *                        **  ++
       |                                      **                      *    |
  -0.6 ++                                       *                  ***    ++
       |                                         **               **       |
  -0.8 ++                                         ***            *        ++
       +          +          +         +          + ***      +***       +  |
    -1 ++---------+----------+---------+----------+---********----------+-++
       0          1          2         3          4          5          6
{% endhighlight %}



Very cool idea, isn't it!? Ok, you can't see much details, it might give you an overview even if you are just connected via SSH.

If anybody has an idea how to do it with R please tell me!
