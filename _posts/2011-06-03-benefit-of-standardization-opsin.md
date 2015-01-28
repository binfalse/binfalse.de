---
layout: post
title: 'Benefit of standardization: OPSIN'
tags:
  - Bioinformatics
  - crazy
  - Java
  - journals
  - Media
  - Programming
categories:
  - Bioinformatics
  - Java
  - Media
  - Web

---

Just <a href="http://dx.doi.org/10.1021/ci100384d">read</a> about a new tool to parse chemical names from systematic IUPAC nomenclature.



<a href="http://opsin.ch.cam.ac.uk/">OPSIN</a> (Open Parser for Systematic IUPAC nomenclature) is an open source <a href="http://en.wikipedia.org/wiki/International_Union_of_Pure_and_Applied_Chemistry"><abbr title="International Union of Pure and Applied Chemistry">IUPAC</abbr></a> nomenclature parser. The IUPAC provides some rules to name chemical compounds, you may have learned some of them in your first course of organic chemistry.

The web interface also comes with an API to generate a 2D picture of the parsed compound. You can speak to the API by calling the image via  `http://opsin.ch.cam.ac.uk/opsin/IUPAC-NAME.png` . For example to get an image for <em>2λ6,2',2''-spiroter[[1,3,2]benzodioxathiole]</em> just <a href="http://opsin.ch.cam.ac.uk/instructions.html">follow these instructions</a> and you'll get an <a href="http://opsin.ch.cam.ac.uk/opsin/2%CE%BB6%2C2%27%2C2%27%27-spiroter%5B%5B1%2C3%2C2%5Dbenzodioxathiole%5D.png">image</a> like this:

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/06/opsin-comp3.png" img="/wp-content/uploads/2011/06/opsin-comp3.png" title="" caption="" %}

Very smart, isn't it? Using the web interface they also provide <a href="http://en.wikipedia.org/wiki/International_Chemical_Identifier"><abbr title="International Chemical Identifier">InChI</abbr></a> and <a href="http://en.wikipedia.org/wiki/Simplified_molecular_input_line_entry_specification"><abbr title="simplified molecular input line entry specification">SMILES</abbr></a> strings and a <a href="http://en.wikipedia.org/wiki/Chemical_Markup_Language"><abbr title="Chemical Markup Language">CML</abbr></a> definition.

It's not limited to simple molecules, I've tried some more complex names, for example <a href="http://opsin.ch.cam.ac.uk/opsin/3%2C6-diamino-N-%5B%5B15-amino-11-%282-amino-3%2C4%2C5%2C6-tetrahydropyrimidin-4-yl%29-8-%20%5B%28carbamoylamino%29methylidene%5D-2-%28hydroxymethyl%29-3%2C6%2C9%2C12%2C16-pentaoxo-%201%2C4%2C7%2C10%2C13-pentazacyclohexadec-5-yl%5Dmethyl%5Dhexanamide.png"><em>3,6-diamino-N-[[15-amino-11-(2-amino-3,4,5,6-tetrahydropyrimidin-4-yl)-8- [(carbamoylamino)methylidene]-2-(hydroxymethyl)-3,6,9,12,16-pentaoxo- 1,4,7,10,13-pentazacyclohexadec-5-yl]methyl]hexanamide</em></a>:

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/06/opsin-comp2.png" img="/wp-content/uploads/2011/06/opsin-comp2.png" title="" caption="" %}

What should I say, I'm impressed!
You can download the tool at <a href="https://bitbucket.org/dan2097/opsin/downloads">bitbucket</a> or use the <a href="http://opsin.ch.cam.ac.uk/">web interface</a>.
