---
layout: post
title: 'Export R data to tex code'
tags:
  - Bioinformatics
  - GNU
  - LaTeX
  - Programming
  - Rumpel
categories:
  - Bioinformatics
  - R
  - University

---

We often use <a href="http://www.r-project.org/">Gnu R</a> to work on different things and to solve various exercises. It's always a disgusting job to export e.g. a matrix with probabilities to a $$\\LaTeX$$ document to send it to our supervisors, but Rumpel just gave me a little hint.


The trick is called <a href="http://cran.r-project.org/web/packages/xtable/">xtable</a> and it can be found in the deb repository:



{% highlight bash %}
aptitude install r-cran-xtable
{% endhighlight %}



It's an add on for R and does right that what I need:



{% highlight r %}
> library('xtable')
> m=matrix(rnorm(25,5,1),5,5)
> m
         [,1]     [,2]     [,3]     [,4]     [,5]
[1,] 5.223797 4.921448 4.775009 5.253216 5.002215
[2,] 5.111304 6.761457 5.561525 5.693226 3.857417
[3,] 3.868195 3.759403 5.971332 4.240052 4.328775
[4,] 5.009473 4.624340 7.367284 3.844524 4.888032
[5,] 4.923996 5.239990 5.336282 5.264121 3.130824
> xtable(m)
% latex table generated in R 2.11.1 by xtable 1.5-6 package
% Tue Oct 12 11:35:50 2010
\\begin{table}[ht]
\\begin{center}
\\begin{tabular}{rrrrrr}
  \\hline
 & 1 & 2 & 3 & 4 & 5 \\\\ 
  \\hline
1 & 5.22 & 4.92 & 4.78 & 5.25 & 5.00 \\\\ 
  2 & 5.11 & 6.76 & 5.56 & 5.69 & 3.86 \\\\ 
  3 & 3.87 & 3.76 & 5.97 & 4.24 & 4.33 \\\\ 
  4 & 5.01 & 4.62 & 7.37 & 3.84 & 4.89 \\\\ 
  5 & 4.92 & 5.24 & 5.34 & 5.26 & 3.13 \\\\ 
   \\hline
\\end{tabular}
\\end{center}
\\end{table}
{% endhighlight %}



It is not only limited to matrices and doesn't only export to latex, but for further information take a look at  `?xtable`  ;)

Btw. I just noticed that the <a href="http://qbnz.com/highlighter/">GeSHi</a> acronym for Gnu R syntax highlighting is  `rsplus` ...
