---
layout: post
title: 'Using MathJax to render math'
tags:
  - Blog
  - crazy
  - Firefox
  - hacked
  - LaTeX
  - Media
  - Programming
  - trick
  - userinteraction
categories:
  - JavaScript
  - Media
  - PHP
  - Software
  - Web
  - Website
  - Wordpress

---

Some time <a href="https://twitter.com/#!/binfalse/status/42346531474518016">ago</a> I've heard about <a href="http://www.mathjax.org/">MathJax</a> and decided to integrate it to my blog. Short time later everything was forgotten, but a few days ago I read an <a href="http://gettinggeneticsdone.blogspot.com/2011/04/using-latex-for-math-formulas-on-web.html">article</a> and remembered my plan. So here it is ;-)



Up to now a mathematical formula was converted to an image like this:
<img src="/wp-content/latex/1e4/1e4024d9889df010d7c219e3a6a03df0-ffffff-000000-0.png" alt="a^2+b^2=c^2\\a^2=c^2\," title="a^2+b^2=c^2\\a^2=c^2\," class="latex" id="latex0bbe29ea247b4ed10927e325293471d8" />

There are some disadvantages, for example you can’t align a number of lines by the equal sign. And also the integration into continuous text is terrible, as you can see in the following sum: <img src="/wp-content/latex/ad6/ad60a7052fad47a89ec3328ada40c2fe-ffffff-000000-0.png" alt="\sum i = 5" title="\sum i = 5" class="latex" id="latexbfe4f19091f14a591be2c1181e3bea7b" />.<br>
Different images have different baselines: <img src="/wp-content/latex/185/185607e9ebc6576a9fdc580cf88c6e87-ffffff-000000-0.png" alt="i=\circ" title="i=\circ" class="latex" id="latexd15fcaa967d74a081d074d0c3cd33361" /> vs <img src="/wp-content/latex/d2c/d2c658644464d3730d78de14a68b6786-ffffff-000000-0.png" alt="p=\circ" title="p=\circ" class="latex" id="latex70e77f5765a2850b562fe9d18827a656" />. This will destroy any line spacings and it depends on the browser what you see if you zoom into the website.

Here is the same Text rendered with MathJax (you need to have JavaScript enabled so see a difference)

$$a^2+b^2&=c^2\\a^2&=c^2\,$$

There are some disadvantages, for example you can't align a number of lines by the equal sign. And also the integration into continuous text is terrible, as you can see in the following sum: $$\sum i = 5$$.
Different images have different baselines: $$i=\circ$$ vs $$p=\circ$$. This will destroy any line spacings and it depends on the browser what you see if you zoom into the website.

So you see, MathJax remedies these issues. Simple latex code is rendered into web compatible math symbols. That is done via JavaScript, so your browser has some more to do, but I think in times of Web2.0 it's negligible. And it's also mark-able, so you can copy & paste!
But what if a visitor is browsing w/o <acronym title="JavaScript">JS</acronym>? I implemented my version with a fallback to these images. So if you disable <acronym title="JavaScript">JS</acronym> you'll see pure output of WP-LaTeX.

I'm actually very busy, so there is no time to create and maintain an official WP-Plugin, but I can offer a <em>How to</em>, so you can handiwork.

<h2>How to?</h2>

This instruction is for <a href="http://wordpress.org/extend/plugins/wp-latex/">WP-LaTeX</a> version 1.7. Add a comment if you want an update for a newer version.

First of all you have to download MathJax, you'll get it <a href="http://www.mathjax.org/docs/1.1/installation.html">here</a>. I installed a copy into  `WP_PATH/wp-content/plugins/` .
Now log into you admin panel and install the plugin WP-LaTeX.

If this is done,  `cd`  to your plugin directory. The only file you have to edit is  `wp-latex/wp-latex.php` .
Since we won't destroy the original functionality, we will continue creating images. So no need to delete anything. But if <acronym title="JavaScript">JS</acronym> is enabled, the images should be replaced by MathJax-code. How do we find out whether <acronym title="JavaScript">JS</acronym> is available!? We take <acronym title="JavaScript">JS</acronym> to replace the images. So if it's not enabled, the images won't be replaced ;-)

Since the MathJax library contains very much <acronym title="JavaScript">JS</acronym>, we will only load the MathJax-stuff if we need it. Most of the article don't require latex, it's a waste of resources if we load the library nevertheless. We introduce a new variable  `loadMathJax` , indicating whether we need MathJax. Have a look at the code and search for  `function wp_head() {` . This function still contains some style stuff, we only need to append some <acronym title="JavaScript">JS</acronym> code:



{% highlight html %}
function wp_head() {
	if ( !$this->options['css'] )
		return;
	?>
	<style type="text/css">
	/* <![CDATA[ */
	<?php echo $this->options['css']; ?>

	/* ]]> */
	</style>
	// -> our code start
	<script type="text/javascript">
	var loadMathJax = false;
	</script>
	// -> our code end
	<?php
{% endhighlight %}



 `loadMathJax`  is false by default, we don't always need MathJax libs. That was nothing exciting, here comes the intelligence. You'll also find a function called  `shortcode` . This function is responsible for image creation, here is the code that is send to your browser:



{% highlight php %}
$latex_object = $this->latex( $latex, $atts['background'], $atts['color'], $atts['size'] );

$url = clean_url( $latex_object->url );
$alt = attribute_escape( is_wp_error($latex_object->error) ? $latex_object->error->get_error_message() . ": $latex_object->latex" : $latex_object->latex );

return "<img src='$url' alt='$alt' title='$alt' class='latex' />";
{% endhighlight %}



Nice, isn't it!? We now need to add some piece of code to replace this image with MathJax source code. We change the code to append a small <acronym title="JavaScript">JS</acronym>:



{% highlight php %}
$latex_object = $this->latex( str_replace("&", "", $latex), $atts['background'], $atts['color'], $atts['size'] );

$url = clean_url( $latex_object->url );
$alt = attribute_escape( is_wp_error($latex_object->error) ? $latex_object->error->get_error_message() . ": $latex_object->latex" : $latex_object->latex );

$id = "latex".md5($url.microtime ());
$start = "\$";
$end = "\$";
if ($latex[strlen($latex)-1] == ",")
{
	$start = "\\\\begin{align}";
	$end = "\\\\end{align}";
}
$mathjaxcode = "<script type='text/javascript'>
if (document.createElement && document.getElementById){
	loadMathJax = true;
	var img = document.getElementById('" . $id . "');
	if (img){
		var tex = document.createTextNode(\"" . $start . str_replace("\\", "\\\\", $latex) . $end . "\");
		img.parentNode.replaceChild(tex, img)
	}
};
</script>";

return "<img src='$url' alt='$alt' title='$alt' class='latex' id='" . $id . "'/>".$mathjaxcode;
{% endhighlight %}



Ok, let me shortly explain this. First we have to replace all  `&`  in the latex code that is parsed to an image (line 1). There is a small issue with this WP-LaTeX plugin. You can't align multiple lines,  `&`  isn't allowed. To nevertheless create multiline MathJax formulas this workaround is my resort.
In line 6 I create a random id, so we can call this specific element by just naming it's id.
I additionally defined a tailing  `,`  as indicator for multiple lines. You just have to add e.g.  `\,`  (a small space) to the end of the last line, and this code expects multiple lines. It will be centered in the line and all  `&`  are aligned.
After wards the piece of <acronym title="JavaScript">JS</acronym> follows. You don't have to understand it, it just looks for an image with the specified id and replaces it with LaTeX-code. It additionally sets the variable  `loadMathJax`  to  `true` . Once an image is replaced this variable gets true! If no image will be replaced it will always stay false.

Last but not least the browser has to load the libraries. Since we want to know whether there is LaTeX-code in this side we can't load it early in the header section. We have to evaluate  `loadMathJax`  in the footer section. Add the following to the  `init ()`  function:



{% highlight php %}
add_action( 'wp_footer', array( &$this, 'wp_footer' ) );
{% endhighlight %}



And append a new function to the end of the class:



{% highlight javascript %}
function wp_footer ()
{
	?>
	<script type="text/x-mathjax-config">
	MathJax.Hub.Config({
		showProcessingMessages: false,
			messageStyle: "none",
			extensions: ["tex2jax.js", "TeX/AMSmath.js", "TeX/AMSsymbols.js"],
			jax: ["input/TeX", "output/HTML-CSS"],
				tex2jax: {
					inlineMath: [ ['$','$'], ["\\(","\\)"] ],
					displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
					multiLine: true
				},
			"HTML-CSS": { availableFonts: ["TeX"] }
	});
	</script>
	<script type="text/javascript">
	if (loadMathJax)
	{
		var head= document.getElementsByTagName('head')[0];
		var script= document.createElement('script');
		script.type= 'text/javascript';
		script.src="/wp-content/plugins/MathJax/MathJax.js";
		head.appendChild(script);
	}
	</script>

	<?php
}
{% endhighlight %}



The first script section adds the MathJax configuration to the page. Take a look at the <a href="http://www.mathjax.org/docs/1.1/">documentation</a> to learn more.
The second script appends a new <a href="http://en.wikipedia.org/wiki/Document_Object_Model">DOM</a> node to the head section via <acronym title="JavaScript">JS</acronym>. If and only if  `loadMathJax`  is true and <acronym title="JavaScript">JS</acronym> is available.
If you installed MathJax to a directory different to  `WP_PATH/wp-content/plugins/`  you have to edit the  `script.src`  line.

This should work, at least for me ;-)
Right-click to these mathematical formulas and choose <em>Settings -> Zoom Trigger -> Click</em>, and each time you click on a formula you'll see a zoomed version. Very smart I think!

Btw. even if it sounds like I'm arguing about this image variant, I'm not! It's a very good method and the displayed formula is the same in every browser. Even <a href="http://en.wikipedia.org/wiki/Help:Displaying_a_formula">Wikipedia</a> uses this technique.

Here is a nice last example, based on the sample of WP-LaTeX:

$$\displaystyle P_\nu^{-\mu}(z)&=\frac{\left(z^2-1\right)^{\frac{\mu}{2}}}{2^\mu \sqrt{\pi}\Gamma\left(\mu+\frac{1}{2}\right)}\int_{-1}^1\frac{\left(1-t^2\right)^{\mu -\frac{1}{2}}}{\left(z+t\sqrt{z^2-1}\right)^{\mu-\nu}}dt\\&=a^2+\pi\cdot x_\infty\\&\approx42\,$$

Here is the code for the above formula:



{% highlight latex %}
\displaystyle P_\nu^{-\mu}(z)&=\frac{\left(z^2-1\right)^{\frac{\mu}{2}}}{2^\mu \sqrt{\pi}\Gamma\left(\mu+\frac{1}{2}\right)}\int_{-1}^1\frac{\left(1-t^2\right)^{\mu -\frac{1}{2}}}{\left(z+t\sqrt{z^2-1}\right)^{\mu-\nu}}dt\\&=a^2+\pi\cdot x_\infty\\&\approx42\,
{% endhighlight %}



Go out, produce smart looking, intelligent web pages! Looking forward to read some scientific articles at your websites!
