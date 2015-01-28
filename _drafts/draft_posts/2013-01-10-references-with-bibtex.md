---
layout: post
title: 'References with BibTex'
categories:
  - Junk

---

Every once in a while somebody asks me how I'm managing my references, so here is a short overview.Since I'm usually writing my documents using $$\\LaTeX$$ I manage my reference with $$\\mathrm{B{\\scriptstyle{IB}} \\! T\\!_{\\displaystyle E} \\! X}$$.
Short introduction to the mechanism (I will later on explain some of the steps a bit more in detail): During the translation from the  `.tex` -code to the  `.pdf` -file LaTeX produces an  `.aux` -file. BibTex will take this file to create a reference list. The layout of this reference list is defined in a  `.bst` -file, and all references that are just in your document are provided in a BibTex format in a  `.bib` -file. The resulting reference list will be stored in a  `.bbl` -file, LaTeX will import this file to generate the PDF with your references.

<H2>BibTex File Format:  `.bib` </h2>
One of the great features of BibTex is the layout independent storage of the references. So you don't need to rewrite anything within your references, just create different layout files (.bst) to produce reference lists in different formats.
The format for a singe reference in BibTex looks like:



{% highlight bash %}
@TYPE{IDENTIFIER,
 key1    = "value one",
 key2    = "value two",
 [...]
}
{% endhighlight %}



The  `TYPE`  might be something like  `ARTICLE`  or  `BOOK` . The  `IDENTIFIER`  is an unique string, that you'll use in your LaTeX document to refer to this entry. The entry also contains some tags, consisting of a key and a value, to store the information about the reference. That might be something like the author ( `author = "Martin Scharm"` ) or the title ( `title = "Some Funny Title"` ). Here you can see an example of such an entry:



{% highlight bash %}
@ARTICLE{Heinz2010,
  author = {Heinz, A. and Jung, M. C. and Duca, L. and Sippl, W. and Taddese,
	S. and Ihling, C. and Rusciani, A. and Jahreis, G. and Weiss, A.
	S. and Neubert, R. H. and Schmelzer, C. E. },
  title = {{{D}egradation of tropoelastin by matrix metalloproteinases--cleavage
	site specificities and release of matrikines}},
  journal = {FEBS J.},
  year = {2010},
  volume = {277},
  pages = {1939--1956},
  month = {Apr}
}
{% endhighlight %}



Of course there is much more to say about the file format, but in general you shouldn't have to write or edit such files. If you are still interested in the format you may have a look at <a href="http://en.wikipedia.org/wiki/BibTeX">Wikipedia</a> or <a href="http://www.bibtex.org/Format/">some</a> <a href="http://maverick.inria.fr/Members/Xavier.Decoret/resources/xdkbibtex/bibtex_summary.html">other</a> <a href="https://ixquick.com/do/search?q=bibtex+file+format">resources</a>.

<h2>Get References</h2>

{% include image.html align="alignright" url="/wp-content/uploads/2012/08/export-citation-ring.png" img="/wp-content/uploads/2012/08/export-citation-ring-150x150.png" title="" caption="" %}
If you want to cite an article in LaTeX you need to have the BibTex entry for that article. Most of the journals offer a service that generates such an entry for a specific article on the fly. In figure 1 you can see an example of such a service. If you click on the BibTex link you'll receive the entry to add it to your library.

Unfortunately some journals are a bit behind the times and haven't heard about LaTeX and such <em>freaky</em> things.. But fortunately there are some services that generate BibTex entries for you. A really nice one is <a href="http://www.bioinformatics.org/texmed/">TexMed</a>! It's able to generate BibTex definitions from articles which can be found in <a href="http://www.ncbi.nlm.nih.gov/pubmed/">PubMed</a> (and there are a lot).
If you don't succeed with your search you have to create the BibTex entry on your own using a text editor or one of the tools out there, like <a href="http://jabref.sourceforge.net/">JabRef</a>.

<h2>Manage your library with JabRef</h2>





<h2>Use BibTex in your LaTeX document</h2>
To use your references in your latex document just add all of them to a file (let's call it bib.bib) and include it at the end of your  latex document:



{% highlight bash %}
\\bibliography{meta/bib}
{% endhighlight %}



To cite a reference in your document add  `\\cite{KEY}`  using the key of the BibTex entry. Latex will automatically build the reference list and substitute the key with a shortcut to the reference list. There are various <em>bibstyles</em> available, you can define the style using:



{% highlight bash %}
\\bibliographystyle{SOMESTYLE}
{% endhighlight %}



You can of course also create your own style.

<h2>Create your own <em>bibstyle</em></h2>
To create your own <em>bibstyle</em> execute the following in a terminal:



{% highlight bash %}
latex makebst
{% endhighlight %}



Answer the questions and you'll create a  `.bst`  file to include in your latex document:



{% highlight bash %}
\\bibliographystyle{/path/to/bst_file}
{% endhighlight %}



I've also created my own style, it looks like the following:
{% include image.html align="alignright" url="/wp-content/uploads/2012/06/latex-ref.png" img="/wp-content/uploads/2012/06/latex-ref-580x206.png" title="" caption="" %}
You can download my bibstyle at the end of this article.

why not mendeley!?

<div class="download"><strong>Download:</strong>
Bibstyle: 
		<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
		</div>
