---
title: "PHP file transfer: Forget the @ - use `curl_file_create`"
layout: post
published: true
date: 2016-06-21 21:16:32 +0200
categories:
  - php
  - network
  - software
  - web
  - programming
tags:
  - upgrade
  - network
  - programming
---

I just struggled uploading a file with PHP cURL. Basically, sending HTTP POST data is pretty easy. And to send a file you just needed to prefix it with an at sign (@). Adapted from the [most cited example](https://blog.derakkilgo.com/2009/06/07/send-a-file-via-post-with-curl-and-php/):

{% highlight php %}
<?php
$target_url = 'http://server.tld/';

$post = array (
    'extra_info' => '123456',
    'file_contents' => '@' . realpath ('./sample.jpeg');
    );

$ch = curl_init ($target_url);
curl_setopt ($ch, CURLOPT_POST, 1);
curl_setopt ($ch, CURLOPT_POSTFIELDS, $post);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
$result=curl_exec ($ch);
curl_close ($ch);
?>
{% endhighlight %}

You see, if you add an '@' sign as the first character of a post field the content will be interpreted as a file name and will be replaced by the file's content.


At least, that is how it used to be... And how most of the examples out there show you.

However, they changed the behaviour. They recognised that this is obviously inconvenient, insecure and error prone. You cannot send POST data that starts with an @ and you always need to sanitise user-data before sending it, as it otherwise may send the contents of files on your server. And, thus, they changed that behaviour in version 5.6, see the [RFC](https://wiki.php.net/rfc/curl-file-upload).

That means by default the `@/some/filename.ext` won't be recognized as a file -- PHP cURL will literally send the @ and the filename (`@/some/filename.ext`) instead of the content of that file. Took ma a while and some [tcpdump](http://www.tcpdump.org/)ing to figure that out..

Instead, they introduced a new function called `curl_file_create` that will create a proper `CURLFile` object for you. Thus, you should update the above snippet with the following:

{% highlight php %}
<?php
$target_url = 'http://server.tld/';

$post = array (
    'extra_info' => '123456',
    'file_contents' => curl_file_create ('./sample.jpeg');
    );
    
$ch = curl_init ($target_url);
curl_setopt ($ch, CURLOPT_POST, 1);
curl_setopt ($ch, CURLOPT_POSTFIELDS, $post);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
$result=curl_exec ($ch);
curl_close ($ch); 
?>
{% endhighlight %}

Note that the contents of the `file_contents` field of the `$post` data differs.

The php.net manual for the [file_contents function](http://php.net/manual/en/function.curl-file-create.php) is unfortunatelly not very verbose, but [the RFC on wiki.php.net](https://wiki.php.net/rfc/curl-file-upload) tells you a bit more about the new function:


{% highlight php %}
<?php
/**
 * Create CURLFile object
 * @param string $name File name
 * @param string $mimetype Mime type, optional
 * @param string $postfilename Post filename, defaults to actual filename
 */
function curl_file_create($name, $mimetype = '', $postfilename = '')
{}
?>
{% endhighlight %}

So you can also define a mime type and some file name that will be sent.

That of course makes it a bit tricky to develop for different platforms, as you want your code to be valid on both PHP 5.4 and PHP 5.6 etc. Therefore you could introduce the following as a fallback:


{% highlight php %}
<?php
if (!function_exists('curl_file_create'))
{
	function curl_file_create($filename, $mimetype = '', $postname = '')
	{
		return "@$filename;filename="
			. ($postname ?: basename($filename))
			. ($mimetype ? ";type=$mimetype" : '');
	}
}
?>
{% endhighlight %}

as suggested by [mipa on php.net](http://php.net/manual/en/curlfile.construct.php#114539). This creates a dummy function that is compliant with the old behaviour if there is no `curl_file_create`, yet.
