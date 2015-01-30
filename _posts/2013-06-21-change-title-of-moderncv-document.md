---
layout: post
title: 'Change Title of moderncv Document'
tags:
  - analyzed
  - explained
  - LaTeX
  - okular
  - Snippet
  - trick
categories:
  - Software
  - tex
  - University

---

Once again I had to prepare a <abbr title="curriculum vit&aelig;">CV</abbr> for an application. I'm using the <a href="https://launchpad.net/moderncv">moderncv</a> package to create the CV in $$\LaTeX$$ and I was always bothered about the title of the document. Today I spend some time to fix that.



{% include image.html align="alignright" url="/wp-content/uploads/2013/06/moderncv-broken-title.png" img="/wp-content/uploads/2013/06/moderncv-broken-title-270x244.png" title=" moderncv produces an ugly title" caption=" moderncv produces an ugly title" %}

Using moderncv you can produce really fancy CV's with very little effort. But unfortunately, by default it produces an ugly title (see the screenshot taken from Okular). As you can see, there is some character that cannot be displayed by certain tools.

I guess most of my "CV-reviewers" don't care about this little issue, if they recognize it at all, but it bothers me whenever I have to create a resum&eacute;. I already tried to override it using the <a href="http://www.ctan.org/tex-archive/macros/latex/contrib/hyperref">hyperref</a> package, but wherever I put the statement it seems to have no effect.

However, since moderncv is open source (yeah! lovit) I took a look at the code to see how they produce the title. It was quite easy to find the concerning statement (in my case  `/usr/share/texlive/texmf-dist/tex/latex/moderncv/moderncv.cls:96` , <a href="http://packages.debian.org/jessie/texlive-latex-extra">texlive-latex-extra@2012.20120611-2</a>):



{% highlight latex %}
\AtEndPreamble{
  \@ifpackageloaded{CJK}
    {\RequirePackage[unicode]{hyperref}}
    {\RequirePackage{hyperref}}
    \hypersetup{
      breaklinks,
      baseurl       = http://,
      pdfborder     = 0 0 0,
      pdfpagemode   = UseNone,% do not show thumbnails or bookmarks on opening
      pdfpagelabels = false,% to avoid a warning setting it automatically to false anyway, because hyperref detects \thepage as undefined (why?)
      pdfstartpage  = 1,
      pdfcreator    = {\LaTeX{} with `moderncv' package},
%      pdfproducer   = {\LaTeX{}},% will/should be set automatically to the correct TeX engine used
      bookmarksopen = true,
      bookmarksdepth= 2,% to show sections and subsections
      pdfauthor     = {\@firstname{}~\@familyname{}},
      pdftitle      = {\@firstname{}~\@familyname{} -- \@title{}},
      pdfsubject    = {Resum\'{e} of \@firstname{}~\@familyname{}},
      pdfkeywords   = {\@firstname{}~\@familyname{}, curriculum vit\ae{}, resum\'{e}}}
  \pagenumbering{arabic}% has to be issued after loading hyperref
}
{% endhighlight %}



As expected the  `pdftitle`  contains a double-hyphen that is converted by latex to a dash. Apparently a problem for some programs. To fix this issue you could <em>sudo:</em>modify this file, but that's of course messy. Better add something like the following to the end of the header of your document:



{% highlight latex %}
\AtEndPreamble{
\hypersetup{pdftitle={Your New Title}}
}
{% endhighlight %}



This will override the broken output of the package.
