---
layout: post
title: 'Cracked a captcha'
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

<a href="http://0rpheus.net/">Micha</a> just implemented an own Captcha-Plugin for wordpress, I just cracked it some minutes later ;)


<div class="alert">This version is deprecated, see <a href="/2010/08/cracked-next-captcha/">Cracked next Captcha…</a>
</div>
Micha was annoyed of his previous Captcha-Plugin, neither valid nor beautiful, so he decided to write <a href="http://0rpheus.net/tools/captcha">his own tool</a> for killing bots.

When I saw his new captchas I was wondering wheter he will get further comments. His captchas ask for solution of mathematical problems like $$\\sqrt{121} + 95$$ or $$228 \\div 19$$ or $$\\frac{136 - 61}{\\sin(\\pi \\div 2)}$$..
Who the hell wants to calculate that stuff!? <strong>Me not!</strong> ;)

So I developed a little userscript that solves this problem. When you take a look to the source code of his website you'll find something like this:



{% highlight html %}
Lösen Sie bitte die folgende Aufgabe (ggf. <em>x</em> bestimmen) <br />

		<img src="http://mathtran.open.ac.uk/cgi-bin/mathtran?D=1;tex=228%20%5Cdiv%2019" alt="228 \\div 19" title="228 \\div 19"/>
	
	<p><input name="captvalue" id="captvalue" value="" size="40" tabindex="4" type="text"/></p>
	<input name="sercret" value="c9679a3b8ab5151bdf143c43091e59a757cb15ce" type="hidden"/>
{% endhighlight %}



So you see, there is an image created by an external server, an input field where you can put the solution and an input field of the type hidden with a <em>crypt</em> value (seems like a hash^^). The most of you will see several ways to hack this:
<ol>
	<li>Parse the string of the image like the external server does to create the $$\\LaTeX$$-image. So you'll get an arithmetic problem, easy to solve.</li>
	<li>Find out what kind of hash is in the value of the secret hidden input-field and try to find a number that matches that hash, maybe via brute force.</li>
	<li>Solve one captcha and fake the rest ;)</li>
</ol>
Of course the last solution is the easiest one. So I solved on captcha, solution was  `7`  and the secret key was  `9ee4251f80923e6239ae66ab50a357daa6039f04` , <strong>hack done</strong>!

The development of the userscript was more than simple:


{% highlight javascript %}
// ==UserScript==
// @name           micha-captcha-hack
// @namespace      binfalse
// @description    solve michas captchas without thinking ;)
// @include        http://0rpheus.net/*
// ==/UserScript==

var hidden_field = document.getElementsByName ("sercret");
var capt_field = document.getElementsByName ("captvalue");
if (hidden_field && capt_field)
{
	capt_field[0].value = 7;
	hidden_field[0].value = '9ee4251f80923e6239ae66ab50a357daa6039f04';
}
{% endhighlight %}



I think that this script won't work for a long time, so there is no download available ;)
If you want to use it, copy&paste, you know.

<small>Ähm, before anybody starts to blame me, a similar workaround kills also my captcha-solution... :P</small>
