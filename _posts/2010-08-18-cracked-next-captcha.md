---
layout: post
title: 'Cracked next Captcha'
tags:
  - Blog
  - hacked
  - LaTeX
  - Programming
  - Security
  - userscript
  - Wordpress
categories:
  - JavaScript
  - Junk
  - Security
  - Software
  - Wordpress

---

Ok, when <a href="http://0rpheus.net/tools/captcha">Micha saw my tiny hack</a> he changed his implementation (as promised) and told me I'm not able to hack it again... Micha, <strong>your captcha failed again</strong> :P

Lets have another look to his code:



{% highlight html %}
<p>
	Lösen Sie bitte die folgende Aufgabe (ggf. <em>x</em> bestimmen) <br />

		<img src="http://mathtran.open.ac.uk/cgi-bin/mathtran?D=1;tex=2%5E%7B%202%20%7D" alt="2^{ 2 }" title="2^{ 2 }"/>
	</p>
	<p><input name="captvalue" id="captvalue" value="" size="40" tabindex="4" type="text"/></p>
	<input name="captcha" value="kwCci5YUFw27oJWwxYc6JuuDuvhMd+K95V1TYf3vwJrZqZf2fJCdABUx/4pxMb08kkV/" type="hidden"/>
{% endhighlight %}



First of all he renamed the fields, so of course my last attack will fail :P
The next problem is, that the hash for a 7 isn't the hash for another 7 of a different calculation. Maybe he's using the arithmetic problem or the time or other things for his hash calculation. So if we don't know how his calculation for the hash is, the last attack is senseless... Btw he told me that he's using encryption. If you're bored, try to break it, it's to much for me.
But Micha bets three beer that I'm not able. <em>So no chance to quit!</em>

In my last post I had another idea to crack the captcha: Parse the formula.
Ok, I wrote about parsing the URI to the external server that produces the picture, of course it's much easier to parse the  `title` - or  `alt` -tag of the image! These fields are human readable to get the site handicapped accessible. Of course worthy that he provides this fields!
So, after some reloads I had a small idea with what kind of problems I have to deal with:
<dl>
	<dt>Simple calculations</dt><dd>something like: $$\\sqrt{49} + 24 - 4^2$$, just calculate the solution</dd>
	<dt>Convertings</dt><dd>like $$x + 82 = 192$$, first convert the formula before calculating the solution</dd>
	<dt>Sums</dt><dd>for example $$\\displaystyle\\sum^{4}_{n=1} (2 \\cdot n + 1)$$, first rewrite the sum-symbol, than calculate the solution</dd>
</dl>
That's the theory, the code is this time a little bit longer:


{% highlight javascript %}
// ==UserScript==
// @name           micha-captcha-hack-v2
// @namespace      binfalse
// @description    solve michas captchas without human thinking ;)
// @include        http://0rpheus.net/*
// ==/UserScript==

var capt_field = document.getElementsByName ("captvalue");
if (capt_field)
{
	//search for the image
	var imgs = document.getElementsByTagName ("img");
	var img = 0;
	for (var i = 0; i < imgs.length; i++)
	{
		if (imgs[i].src && imgs[i].src.indexOf ("mathtran.open.ac.uk") >= 0)
		{
			img = imgs[i];
			break;
		}
	}
	
	if (img != 0)
	{
		var problem = img.title;
		// parse simple math operations
		problem = problem.replace (/\\\\cos\\s*0/, " 1 ");
		problem = problem.replace ("\\\\div", " / ");
		problem = problem.replace ("\\\\cdot", " * ");
		problem = problem.replace (/\\\\sin\\s*\\\\frac\\s*{\\s*\\\\pi\\s*}\\s*{\\s*2\\s*}/, " 1 ");
		problem = problem.replace (/\\\\frac\\s*{(.+?)}{(.+?)}/, "($1) / ($2)");
		problem = problem.replace (/\\\\sqrt\\s*{(.+?)}/, " Math.sqrt ($1) ");
		problem = problem.replace (/([^m ]+)\\s*\\^\\s*{(.+?)}/, " Math.pow ($1, $2) ");
		
		if (problem.indexOf ("=") < 0)
		{
			//simpel problem, just calc..
			capt_field[0].value = eval (problem);
		}
		else if (problem.indexOf ("sum") < 0)
		{
			//converting -> very simple scripted ;)
			var tmp = problem.indexOf ("=");
			var left = problem.substr (0, tmp);
			var right = problem.substr (tmp + 1);
			if (right.indexOf ('x') >= 0)
			{
				tmp = right;
				right = left;
				left = tmp;
			}
			// lhs is x -> convert every other shit to rhs ;)
			
			// kill adds
			var leftpieces = left.split ('+');
			for (var i = 0; i < leftpieces.length; i++)
				if (leftpieces[i].indexOf ('x') < 0)
					right = right + " - " + leftpieces[i];
				else
					left = leftpieces[i];
			
			// kill subs
			var leftpieces = left.split ('-');
			for (var i = 0; i < leftpieces.length; i++)
				if (leftpieces[i].indexOf ('x') < 0)
					right = right + " + " + leftpieces[i];
				else
					left = leftpieces[i];
			
			// kill mults
			var leftpieces = left.split ('*');
			for (var i = 0; i < leftpieces.length; i++)
				if (leftpieces[i].indexOf ('x') < 0)
					right = "(" + right + ") / " + leftpieces[i];
				else
					left = leftpieces[i];
			
			// kill divs
			var leftpieces = left.split ('/');
			for (var i = 0; i < leftpieces.length; i++)
				if (leftpieces[i].indexOf ('x') < 0)
					right = "(" + right + ") * " + leftpieces[i];
				else
					left = leftpieces[i];
			
			capt_field[0] = eval (right);
		}
		else
		{
			//sumproblem
			eval (problem.replace (/^.+sum.+?{(.+?)}.+{(.+?)}(.+)$/, "$2;to=$1;s='$3';"));
			var longprob = "";
			for (var i = n; i < to; i++)
				longprob = longprob + " " + s.replace ('n', i) + " +";
			longprob += 0;
			capt_field[0].value = eval (longprob);
		}
		
	}
	else
	{
		capt_field[0].value = "uuups, no img found!?";
		capt_field[0].style.background = "red";
	}
}
{% endhighlight %}



As you can see, it's a little bit tricky and just works for some mathematical formulas that are of interest. If he combines the converting problem with brackets or something like that, this code fails.. But the algorithm is easy to modify for such changes ;)

But respect, to crack my captcha you don't need that intelligence, it's feasible in much less code.
I hope he doesn't rewrite his plugin again, don't want to calculate that stuff by brain...
