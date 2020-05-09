---
layout: post
title: 'Displaying compounds with WebGL'
tags:
  - bioinformatics
  - chemistry
  - crazy
  - media
  - programming
  - trick
categories:
  - bioinformatics
  - html
  - javascript
  - media
  - software
  - web

---

After publishing my <a href="/2011/06/benefit-of-standardization-opsin/">last article about OPSIN</a> I was interested in using HTML5 techniques to display chemical compounds and found a nice library: <a href="http://web.chemdoodle.com/">ChemDoodle</a>.



With ChemDoodle it's very easy to display a molecule. Just <a href="http://web.chemdoodle.com/installation/download">download</a> the libs and import them to your HTML code:



{% highlight html %}
<script type="text/javascript" src="path/to/ChemDoodleWeb-libs.js"></script>
<script type="text/javascript" src="path/to/ChemDoodleWeb.js"></script>
{% endhighlight %}



To display a compound you need its representation as <a href="http://en.wikipedia.org/wiki/Chemical_table_file#Molfiles">MOL</a> file, include it in less than 10 lines:



{% highlight javascript %}
<script type="text/javascript">
  var app = new ChemDoodle.TransformCanvas3D('transformBallAndStick', 500, 500);
  app.styles.set3DRepresentation('Stick');
  app.styles.backgroundColor = 'white';
  var molFile = '\n  Marvin  02080816422D          \n\n 14 15  0  0  0  0            999 V2000\n   -0.7145   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.7145    0.4125    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7145   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7145    0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000   -0.8250    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.8250    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4992    0.6674    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4992   -0.6675    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.9841    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.4289   -0.8250    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0001    1.6500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0001   -1.6500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7541    1.4520    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.4289    0.8250    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n 10  1  2  0  0  0  0\n  1  2  1  0  0  0  0\n 14  2  1  0  0  0  0\n  8  3  1  0  0  0  0\n  4  3  2  0  0  0  0\n  7  4  1  0  0  0  0\n  1  5  1  0  0  0  0\n  5  3  1  0  0  0  0\n 12  5  1  0  0  0  0\n  6  2  1  0  0  0  0\n  6  4  1  0  0  0  0\n 11  6  2  0  0  0  0\n  9  7  1  0  0  0  0\n 13  7  1  0  0  0  0\n  9  8  2  0  0  0  0\nM  END\n';
  var molecule = ChemDoodle.readMOL(molFile, 1);
  app.loadMolecule(molecule);
</script>
{% endhighlight %}



Here is a sample with caffeine:

<script type="text/javascript" src="/wp-content/uploads/2011/06/ChemDoodleWeb.js"></script>
<script type="text/javascript">
  var app = new ChemDoodle.TransformCanvas3D('transformBallAndStick', 500, 500);
  app.styles.set3DRepresentation('Stick');
  app.styles.backgroundColor = 'white';
  var molFile = '\n  Marvin  02080816422D          \n\n 14 15  0  0  0  0            999 V2000\n   -0.7145   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.7145    0.4125    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7145   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7145    0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000   -0.8250    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.8250    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4992    0.6674    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4992   -0.6675    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.9841    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.4289   -0.8250    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0001    1.6500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0001   -1.6500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7541    1.4520    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.4289    0.8250    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n 10  1  2  0  0  0  0\n  1  2  1  0  0  0  0\n 14  2  1  0  0  0  0\n  8  3  1  0  0  0  0\n  4  3  2  0  0  0  0\n  7  4  1  0  0  0  0\n  1  5  1  0  0  0  0\n  5  3  1  0  0  0  0\n 12  5  1  0  0  0  0\n  6  2  1  0  0  0  0\n  6  4  1  0  0  0  0\n 11  6  2  0  0  0  0\n  9  7  1  0  0  0  0\n 13  7  1  0  0  0  0\n  9  8  2  0  0  0  0\nM  END\n';
  var molecule = ChemDoodle.readMOL(molFile, 1);
  app.loadMolecule(molecule);
</script>

If your browser is able to display WebGL you should see a stick-model. Use your mouse to interact.
Very easy to use! Of course you can load the MOL data from a file, but that is beyond the scope of this article.
