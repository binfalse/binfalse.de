---
layout: post
title: 'Resort search results in SquirrelMail'
tags:
  - hacked
  - mail
  - network
  - programming
  - thunderbird
  - icedove
  - ugly
  - university
  - userscript
categories:
  - javascript
  - mail
  - network
  - software
  - university
  - web

---

Apart from an <a href="http://en.wikipedia.org/wiki/Internet_Message_Access_Protocol">IMAP</a>/<a href="http://en.wikipedia.org/wiki/Post_Office_Protocol">POP</a> service we provide a webmail front end to interact with our mail server via <a href="http://squirrelmail.org/index.php">SquirrelMail</a>. This tool has a very annoying feature, search results are ordered by date, but in the wrong way: From old to new!

SquirrelMail is a very simple to administrate front end, not very nice, but if my experimental icedove doesn't work I use it too. Furthermore we have staff members, who <em>only</em> use this tool and aren't impressed by real user-side clients like <a href="http://en.wikipedia.org/wiki/Mozilla_Corporation_software_rebranded_by_the_Debian_project">icedove</a> or <a href="http://sylpheed.sraoss.jp/en/">sylpheed</a>.. What ever, I had to resort these search results!

Searching for a solutions doesn't result in a solution, so I had three options: Modifying the SquirrelMail code itself (very bad idea, I know), providing a plugin for SquirrelMail, or writing a userscript.

Ok, hacking the core of SquirrelMail is deprecated, writing a plugin is to much work for now, so I scripted some JavaScript.

The layout of this website is lousy! I think the never heard of <a href="http://en.wikipedia.org/wiki/Span_and_div">div</a>'s or <a href="http://en.wikipedia.org/wiki/Cascading_Style_Sheets">CSS</a>, everything is managed by tables in tables of tables and inline layout specifications -.-
So detecting of the right table wasn't that easy. I had to find the table that contains a headline with the key  `From` :



{% highlight javascript %}
var tds = document.getElementsByTagName ('td');
var table = 0;
for (var i = 0; i < tds.length; i++)
{
	if(tds[i].innerHTML.match(/^\\s*<b>From<\\/b>\\s*$/))
	{
		table = tds[i].parentNode.parentNode;
		break;
	}
}
{% endhighlight %}



If I've found such a table, all the rows have to be sorted from last to first. Except the first ones defining the headline of that table. So I modified the <a href="http://en.wikipedia.org/wiki/Document_Object_Model">DOM</a>:



{% highlight javascript %}
if (table)
{
	var old = table.cloneNode (true);
	var tru = false;
	var oldi = old.childNodes.length - 1;
	var tablelen = table.childNodes.length;
	for (var i = 0; i < tablelen; i++)
	{
		// don't sort the head to the end...
		if (!tru)
		{
			if (table.childNodes[i].innerHTML && table.childNodes[i].innerHTML.replace(/\\n/g,'').match (/<b>From<\\/b>.*<b>Date<\\/b>.*<b>Subject<\\/b>/))
				tru = true;
			continue;
		}
		table.replaceChild (old.childNodes[oldi--], table.childNodes[i]);
	}
}
{% endhighlight %}



Ok, that's it! Using this script the search results are ordered in the correct way. Let's wait for a response from these nerdy SquirrelMail-user ;-)

<div class="download"><strong>Download:</strong>
JavaScript: <a href='/wp-content/uploads/pipapo/user-scripts/squirrelmail_search_reorder.user.js'>squirrelmail_search_reorder</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
