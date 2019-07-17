---
title: "Dockerising a Contao website II"
layout: post
published: true
date: 2018-02-20 14:54:38 +0100
categories:
  - network
  - software
  - university
  - website
  - administration
  - web
  - php
  - programming
tags:
  - apache
  - config
  - explained
  - bug
  - contao
  - docker
  - network
  - university
  - curl
  - firefox
  - fix
  - http
  - job
  - cron
  - php
  - programming
  - snippet
  - ssl
  - trick
---

**This article is based on Contao 3. There is a new version, see [Dockerising Contao 4](/2019/07/17/dockerising-contao-4/)**

In a [previous post](/2018/01/24/dockerising-a-contao-page/) I explained how to run a [Contao](https://contao.org/en/) website in a [Docker](https://www.docker.com/) infrastructure.
That was a good opening.
However, after running that setup for some time I discovered a few issues...

A central idea of Docker is to install the application in an image and mount persistent files into a running container.
Thus, you can just throw away an instance of the app and start a new one very quickly (e.g. with an updated version of the app).
Unfortunately, using Contao it's not that straight-forward -- at least when using [the image decribed earlier](https://hub.docker.com/r/binfalse/contao/).

Here I'm describing how I fought the issues:

## Issues with Cron

The first issue was [Contao's Poor-Man-Cron](https://docs.contao.org/books/cookbook/de/Cronjobs-in-Contao.html).
This cron works as follows:

* The browser requests a file `cron.txt`, which is supposed to contain the timestamp of the last cron run.
* If the timestamp is "too" old, the browser will also request a `cron.php`, which then runs overdue jobs.
* If a job was run, the timestamp in `cron.txt` will be updated, so `cron.php` won't be run every time.

Good, but that means the `cron.txt` will only be written, if a cron job gets executed.
But let's assume the next job will only be run next week end!?
The last cron-run-time is stored in the database, but the `cron.txt` won't exist by default.
That means, even if the `cron.php` is run, it will know that there is no cron job to execute and, therefore, exit without creating/updating the `cron.txt`.
Especially when using Docker you will hit such a scenario every time when starting a new container..
Thus, every user creates a [404](https://en.wikipedia.org/wiki/HTTP_404) error (as there is no `cron.txt`), which is of course ugly and spams the logs..


I fixed the issue by [extending the Contao source code](https://github.com/contao/core/pull/8838).
The patch is already merged into the official [release of Contao 3.5.33](https://github.com/contao/core/milestone/146?closed=1).
In addition, I'm initialising the `cron.txt` in my Docker image with a time stamp of `0`, see the [Dockerfile](https://github.com/binfalse/docker-contao/blob/73dcc462f8c49450e9ad5d0b5c4f035276ab9ea4/Dockerfile#L28).





## Issues with Proxies

A typical Docker infrastructure (at least for me) consists of bunch containers orchestrated in various networks etc..
Usually, you'll have at least one (reverse) proxy, which distributes HTTP request to the container in charge.
However, I experienced a few issues with my proxy setup:



### HTTPS vs HTTP

While the connection between client (user, web browser) and reverse proxy is SSL-encrypted, the proxy and the webserver talk plain HTTP.
As it's the same machine, there is no big need to waste time on encryption.
But Contao has a problem with that setup.
Even though, the reverse proxy properly sends the `HTTP_X_FORWARDED_PROTO`, Contao only sees incomming HTTP traffic and uses `http://`-URLs in all documents...
Even if you ignore the mixed-content issue and/or implement a rewrite of HTTP to HTTPS at the web-server-layer, this will produce twice as much connections as necessary!

The solution is however not that difficult.
Contao does not understand `HTTP_X_FORWARDED_PROTO`, but it recognises the `$_SERVER['HTTPS']` variable.
Thus, to fix that issue you just need to add the following to your `system/config/initconfig.php` (see also [Issue 7542](https://github.com/contao/core/issues/7542)):

{% highlight php %}
<?php
if (isset ($_SERVER['HTTP_X_FORWARDED_PROTO']) && 'https' === $_SERVER['HTTP_X_FORWARDED_PROTO'])
{
	$_SERVER['HTTPS'] = 1;
}
{% endhighlight %}

In addition, this will generate URLs including the port number (e.g. `https://example.com:443/etc`), but they are perfectly valid. (Not like `https://example.com:80/etc` or something that I saw during my tests... ;-)

**This workaround doesn't work for Contao 4 anymore! To fix it see [Dockerising Contao 4](/2019/07/17/dockerising-contao-4/)**



### URL encodings in the Sitemap

The previous fix brought up just another issue: The URL encoding in the sitemap breaks when using the port component (`:443`)..
Conato uses [`rawurlencode`](https://github.com/contao/core/blob/c7f0310ebd3f4e8b32a82f10f9ffa6827ab4b2a3/system/modules/core/library/Contao/Automator.php#L414) to encode all URLs before writing them to the sitemap.
However, `rawurlencode` encodes quite a lot!
Among others, it converts `:`s to `%3A`.
Thus, all URLs in my sitemap looked like this: `https://example.com%3A443/etc` - which is obviously invalid.

I [proposed](https://github.com/contao/core/issues/8848#issuecomment-363861386) using [htmlspecialchars](https://secure.php.net/manual/en/function.htmlspecialchars.php) instead to encode the URLs, but it was finally fixed by [splitting the URLs](https://github.com/contao/core/pull/8849#issuecomment-364951494) and should be working in [release 3.5.34](https://github.com/contao/core/milestone/149?closed=1).


## Issues with Cache and Assets etc

A more delicate issue are cache and assets and sitemaps etc.
Contao's backend comes with convenient buttons to clear/regenerate these files and to create the search index.
Yet, you don't always want to login to the backend when recreating the Docker container..
Sometime you simply can't - for example, if the container needs to be recreated over night.

Basically, that is not a big issue.
Assets and cache will be regenerate once they are needed.
But the sitemaps, for instance, will only be generated when interacting with the backend.


Thus, we need a solution to create these files as soon as possible, preferably in the background after a container is created.
Most of the stuff can be done using the [`Automator` tool](https://github.com/contao/core/blob/3.5/system/modules/core/library/Contao/Automator.php), but I also have some personal scripts developed by a company, that require other mechanisms and are unfortunately not properly integrated into Contao's hooks landscape.
And if we need to touch code anyways, we can also generate all assets and rebuild the search index manually (precreating necessary assets will later on speed up things for users...).
To generate all assets (images and scripts etc), we *just* need to access every single page at the frontend.
This will then trigger Contao to create the assets and cache, and subsequent requests from real-life users will be much faster!

The best hack that I came up with so far looks like the following script, that I uploaded to `/files/initialiser.php` to Contao instance:



{% highlight php %}
<?php
define ('TL_MODE', 'FE');
require __DIR__ . '/../system/initialize.php';

$THISDIR = realpath (dirname (__FILE__));

$auto = new \Automator ();
// purge stuff
$auto->purgeSearchTables ();
$auto->purgeImageCache ();
$auto->purgeScriptCache();
$auto->purgePageCache();
$auto->purgeSearchCache();
$auto->purgeInternalCache();
$auto->purgeTempFolder();
$auto->purgeXmlFiles ();

// regenerate stuff
$auto->generateXmlFiles ();
$auto->generateInternalCache();
$auto->generateConfigCache();
$auto->generateDcaCache();
$auto->generateLanguageCache();
$auto->generateDcaExtracts();


// get all fe pages
$pages = \Backend::findSearchablePages();

if (isset($GLOBALS['TL_HOOKS']['getSearchablePages']) && is_array($GLOBALS['TL_HOOKS']['getSearchablePages'])) {
	foreach ($GLOBALS['TL_HOOKS']['getSearchablePages'] as $callback) {
		$classname = $callback[0];
		if (!is_subclass_of ($classname, 'Backend'))
			$pages =  (new $classname ())->{$callback[1]} ($pages);
	}
}

// request every fe page to generate assets and cache and search index
$ch=curl_init();
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_USERAGENT, 'conato-cleaner');
# maybe useful to speed up:
#curl_setopt($ch, CURLOPT_MAXCONNECTS, 50);
#curl_setopt($ch, CURLOPT_NOBODY, TRUE);
#curl_setopt($ch, CURLOPT_TIMEOUT_MS, 150);
#curl_setopt($ch, CURLOPT_CONNECTTIMEOUT_MS, 150);

foreach ($pages as $page) {
	curl_setopt($ch, CURLOPT_URL, $page);
	curl_exec($ch);
}
{% endhighlight %}

The first 3 lines initialise the Contao environment.
Here I assume that `../system/initialize.php` exists (i.e. the script is saved in the `files` directory).
The next few lines purge existing cache using the Automator tool and subsequently regenerate the cache -- just to be clean ;-)

Finally, the script
(i) collects all "searchable pages" using the [`Backend::findSearchablePages()` functionality](https://github.com/contao/core/blob/9ca7b0d03b522622ce4bd2b00ad4fc34efbf28f6/system/modules/core/classes/Backend.php#L666), 
(ii) enriches this set of pages with additional pages that may be hooked-in by plugins etc through `$GLOBALS['TL_HOOKS']['getSearchablePages']`,
and then (iii) uses [cURL](http://php.net/manual/de/book.curl.php) to iteratively request each page.

### But...

The first part should be reasonably fast, so clients may be willing to wait until the cache stuff is recreated.
Accessing every frontend page, however, may require a significant amount of time!
Especially for larger web pages..
Thus, I embedded everything in the following skeleton, which advises the browser to close the connection before we start the time-consuming tasks:

{% highlight php %}
<?php
/**
* start capturing output
*/
ob_end_clean ();
ignore_user_abort ();
ob_start() ;


/**
* run the tasks that you want your users to wait for
*/

// e.g. purge and regenerate cache/sitemaps/assets
$auto = new \Automator ();
$auto->purgeSearchTables ();
// ..

/**
* flush the output and tell the browser to close the connection as soon as it received the content
*/
$size = ob_get_length ();
header ("Connection: close");
header ("Content-Length: $size");
ob_end_flush ();
flush ();


/**
* from here you have some free computational time
*/

// e.g. collect pages and request the web sites
// users will already be gone and the output will (probably) never show up in a browser.. (but don't rely on that! it's still sent to the client, it's just outside of content-length)
$pages = \Backend::findSearchablePages();
// ...
{% endhighlight %}

Here, the browser is told to close the connection after a certain content size arrived.
I buffer the content that I want to transfer using `ob_start` and `ob_end_flush`, so I know how big it is (using `ob_get_length`).
Everything after `ob_get_length` can safely be ignored by the client, and the connection can be closed.  
<small>(You cannot be sure that the browser really closes the connection. I saw `curl` doing it, but also some versions of Firefox still waiting for the script to finish... Nevertheless, the important content will be transferred quick enough).</small>

In addition, I created some [`RewriteRules` for `mod_rewrite`](https://httpd.apache.org/docs/current/mod/mod_rewrite.html) to automatically regenerate missing files.
For example, for the sitemaps I added the following to the vhost config (or `htaccess`):

{% highlight htaccess %}
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^/share/(.*)\.xml.*$ https://example.com/files/initialiser.php?target=sitemap&sitemap=$1 [R=302,L]
{% endhighlight %}

That means, if for example `/share/sitemap.xml` not yet exists, the user gets automagically redirected to our `initialiser.php` script!
In addition, I added some request parameters (`?target=sitemap&sitemap=$1`), so that the `initialiser.php` *knows* which file was requested.
It can then regenerate everything and immediately output the new content! :)

For example, my snippet to regenerate and serve the sitemap looks similar to this:

{% highlight php %}
<?php
// ...

$auto = new \Automator ();
// ...
$auto->generateXmlFiles ();

if ($_GET['target'] == 'sitemap') {
	$sitemaps = $auto->purgeXmlFiles (true);
	$found = false;
	foreach ($sitemaps as $sitemap) {
		if ((!isset ($_GET['sitemap']) || empty ($_GET['sitemap'])) || $_GET['sitemap'] == $sitemap) {
			$xmlfile = $THISDIR . "/../share/" . $sitemap . ".xml";
			
			// if it still does not exists -> we failed...
			if (!file_exists( $xmlfile )) {
				// error handling
			}
			// otherwise, we'll dump the sitemap
			else {
				header ("Content-Type: application/xml");
				readfile ($xmlfile);
			}
			$found = true;
			break;
		}
	}
	if (!$found) {
		// error handling
	}
}
{% endhighlight %}


Thus, the request to `/share/somesitemap.xml` will never fail.
If the file does not exist, the client will be redirected to `/files/initialiser.php?target=sitemap&sitemap=somesitemap`, the file `/share/somesitemap.xml` will be regenerated, and the new contents will immediately be served.
So the client will eventually get the desired content :)

Please be aware, that this script is easily [DOS](https://en.wikipedia.org/wiki/Denial-of-service_attack)-able!
Attackers may produce a lot of load by accessing the file.
Thus, I added some simple DOS protection to the beginning of the script, which makes sure the whole script is not run more than once per hour (3600 seconds):


{% highlight php %}
<?php
$dryrun = false;
$runcheck = "/tmp/.conato-cleaner-timestamp";

if (file_exists ($runcheck) && filemtime ($runcheck) > time () - 3600) {
	$dryrun = true;
    if (!isset ($_GET['target']) || empty ($_GET['target']))
        die ();
}
else
	touch ($runcheck);
{% endhighlight %}


If `$dryrun` is `true`, it won't regenerate cache etc, but still serve the sitemap and other files if requested..
However, if there is also no `$_GET['target']` defined, we don't know what to serve anyway and can `die` immediately...

You could include the script at the footer of your webpage, e.g. using

{% highlight html %}
<script src="/files/initialiser.php"></script>
</body></html>
{% endhighlight %}

<small>(you may want to make sure that the generated output, if any, is valid JavaScript. E.g. embed everything in `/*...*/` or something...)</small>

This way you would make sure, that *every* request produces a fully initialised system.
However, this will probably also create unnecessary load every hour...
You could increase the time span in the DOS-protection-hack, but I guess it should be sufficient to run the script only if a missing file is requested.
Earlier requests then need to wait for pending assets etc, but to be honest, that should not be too long (or you have a different problem anyway...).

And if your website provides an RSS feed, you could subscribe to it using your default reader, which will regularly make sure that the RSS feed is generated if missing.. (and thus trigger all the other stuff in our `initialiser.php`)
-- A feed reader as the [poorest-man-cron](https://docs.contao.org/books/cookbook/en/Cron-jobs-in-Contao.html) ;-)

### Share


As I said earlier, my version of the script contains plenty of personalised stuff.
That's why I cannot easily share it with you.. :(

However, if you have trouble implementing it yourself just let me know :)
