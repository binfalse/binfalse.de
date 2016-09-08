---
date: '2014-01-08 18:04:03'
link: http://binfalse.de
name: Martin Scharm
post_id: /software/browser-extensions/yourls-chrome-extension
---

I'm not sure how you're going to deploy the extension automatically!? However, as far as i know you either:

<ul>
<li>need to configure each browser individually in order to setup URL and signature according to your YOURLS server (in that case it's not that much more effort to also tick the corresponding checkbox)</li>
<li>or you need to modify the sources. This plugin is open source, feel free to clone/fork it from GitHub and include your defaults.</li>
</ul>

One option to define defaults is substituting the function  `RestoreOptions`  (defined in <a href="https://github.com/binfalse/YOURLS-ChromeExtension/blob/master/js/options.js#L27"> js/options.js</a>) with:



{% highlight javascript %}
function RestoreOptions ()
{
	var url   = document.getElementById ('url');
	var secret = document.getElementById ('secret');
	var keyword = document.getElementById ('keyword');
	var wait = document.getElementById ('wait');
	
	if (typeof localStorage['yourls_url'] == 'undefined')
		localStorage['yourls_url'] = ">>> default url <<<";
	if (typeof localStorage['yourls_secret'] == 'undefined')
		localStorage['yourls_secret'] = ">>> default secret <<<";
	if (typeof localStorage['yourls_keyword'] == 'undefined')
		localStorage['yourls_keyword'] = ">>> default use keyword <<<"; // you probably want to set this to true
	if (typeof localStorage['yourls_wait'] == 'undefined')
		localStorage['yourls_wait'] = ">>> default wait time <<<";
	
	wait.value = localStorage['yourls_wait'];
	url.value   = localStorage['yourls_url'];
	secret.value = localStorage['yourls_secret'];
	keyword.checked = localStorage['yourls_keyword'] === "true";
}
{% endhighlight %}



Does this solve your problem? If you need help with building the extension I could modify the code and compile a customized extension just for you and your customers.!?