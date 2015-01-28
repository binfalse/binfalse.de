---
layout: post
title: 'Mensa plan'
tags:
  - Halle
  - mensa
  - Programming
  - ugly
categories:
  - Perl
  - Software
  - University
  - Web

---

I often check what our canteen offer for lunch before we leave our building. The website that presents this portfolio is one of the worst I've ever seen and meanwhile I noticed that my private walking Mensa planer has still some bugs, so I had to think about an alternative solution and developed a little Perl script...

My initial idea was to read the website, parse the XML code and print the meals. Not a bit of it! The code of this site is nothing like valid! They invent new tags I've never heard about, they close nowhere opened paragraphs or table cells, I do not find the html-closing tag (the document ends with closing it's body) and so on... It's to much to mention all it's unique features, but let me blame the producer: <a href="http://www.peinhardt.it">Peinhardt IT Systeme</a>. Seems to be professionals... (A notice has left my mailbox, looking forward to their answer)

How ever, XML parsing fails, solving the bugs also fails, to much of it... So I'm now just grabbing the HTML-code, to extract the interesting content, with a more or less ugly regex, and print them to console... Here is the code:

[cc lang="perl" file="pipapo/scripts/essen.pl"][/cc]

So if somebody is also joining the Mensa Weinberg, you can copy this code or <a href='/wp-content/uploads/2010/07/essen.pl'>download it</a>.
The other canteens are also available, just change the value of the variable  `$mensa`  to your preferred one. The numbers can be found in the source code of this stupid website. Ok, to save you from trouble here are the numbers:

<dl>
<dt>Cafeteria Brandbergweg</dt><dd>11</dd>
<dt>Cafeteria Burg</dt><dd>12</dd>
<dt>Mensa Bernburg</dt><dd>8</dd>
<dt>Mensa Dessau</dt><dd>13</dd>
<dt>Mensa Franckesche Stiftungen</dt><dd>14</dd>
<dt>Mensa Harz</dt><dd>3</dd>
<dt>Mensa Köthen</dt><dd>7</dd>
<dt>Mensa Neuwerk</dt><dd>9</dd>
<dt>Mensa Tulpe</dt><dd>10</dd>
<dt>Mensa Weinberg</dt><dd>5</dd>
</dl>
Well, that's it! Now you can decide within seconds whether it's worthy to go to lunch or better stay hungry ;)

<div class="download"><strong>Download:</strong>
Perl: <a href='/wp-content/uploads/pipapo/scripts/essen.pl'>essen.pl</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
