---
layout: post
title: 'Configure TinyTinyRSS to use a Proxy'
categories:
  - Junk

---





It's apparently undocumented, but looking into the code feeds are fetched using curl. And the code already supports the usage of a proxy:

if (defined('_CURL_HTTP_PROXY')) {
        curl_setopt($ch, CURLOPT_PROXY, _CURL_HTTP_PROXY);
}

Not sure why it's not documented. However, you may define the variable _CURL_HTTP_PROXY in your config file. For example to use a proxy at 127.0.0.1:8123 add the following to your config:

define ('_CURL_HTTP_PROXY', '127.0.0.1:8123');

tested it...




<h1>References</h1>
		<dl>
		<dt><a name='SHORT'>[SHORT]</a></dt>
		<dd>WHO
		<em>TITLE</em>
		WHERE
		LINK
		</dd>
		<dt><a name=''>[]</a></dt>
		<dd>
		<em></em>


		</dd>
		</dl>

<div class="download"><strong>Download:</strong>

		<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
		</div>
