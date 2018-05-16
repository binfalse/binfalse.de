---
layout: page
title: check_links.pl

---

Perl script to monitor resources on the internet.

**check_links** is quit powerful, as it can monitor 

* availability of webpages
* content delivery
* uptime of web servers
* content negotiation
* etc

## Requirements

The Perl script requires

* the Nagios plugin library in `/usr/lib/nagios/plugins/utils.pm`
* [LWP::UserAgent](http://search.cpan.org/~ether/libwww-perl-6.15/lib/LWP/UserAgent.pm)
* [Getopt::Long](http://search.cpan.org/~jv/Getopt-Long-2.49.1/lib/Getopt/Long.pm)
* [HTTP::Cookies](http://search.cpan.org/~oalders/HTTP-Cookies-6.03/lib/HTTP/Cookies.pm)
* [URI](http://search.cpan.org/~ether/URI-1.71/lib/URI.pm)

## USAGE

    perl -w check_links.pl [OPTIONS] -u URL

Here, `OPTIONS` may be:

* `--url URL` or `-u URL`         the URL to the site
* `---status STATUS` or `-s STATUS`     you expect `STATUS` to be the returned HTTP status code (default: `200`)
* `---no-status`     do not check the HTTP status
* `---content "CONTENT"` or `-c "CONTENT"`   you expect `CONTENT` to appear within the response
* `---referer "REFERER"` or `-r "REFERER"`   use `REFERER` when sending the request
* `---user-agent "USER AGENT"`    pretend to be the user agent `USER AGENT`
* `---header "KEY=VALUE"`        expected HTTP header value as `KEY=VALUE`, multiple options are possible and `VALUE` may be a regex
* `---cookie "NAME=VALUE"`        sent a cookie `NAME=VALUE`, multiple options possible
* `---accept "MIME"` or `-a "MIME"`     ask for a result of content type `MIME`, especially useful to check for content negotiation
* `---follow` or `-f`     should we follow redirects?
* `---timeout INT` or `-t INT`    wait `INT` seconds before timeout
* `---help` or `-h`       show this help

The script's return code and message is to be interpreted by your monitoring infrastructure.

### EXAMPLES

#### Check a URL is accessible

	perl -w check_links.pl -u https://binfalse.de

#### Check a URL-shortener does the proper redirection

	perl -w check_links.pl -u http://goo.gl/33e3Lb -s 301 --header location=https://binfalse.de/

#### Check that your webserver properly redirects HTTP to HTTPS

	perl -w check_links.pl -u http://binfalse.de/ -s 301 --header location=https://binfalse.de/

#### Check that a web resource has a specific size and that the webserver is NGINX

	perl -w check_links.pl -h content-length=191406 -h "server=nginx.*" -u https://binfalse.de/assets/media/pics/2016/drm-inchains.png

Here, the image needs to be exactly of size 191406 Bytes and the regex `nginx.*` matches to NGINX in any version.

#### Perform a check using a cookie

	perl -w check_links.pl -c userid=karl -c secret=passwd123456 -u https://secret.site

#### Test content negotiation

Check that you get XML when asking for XML:

	check_links.pl -u http://purl.uni-rostock.de/comodi/comodi#Attribution -f -a text/xml --header content-type=xml

Check that you get HTML when asking for HTML:

	check_links.pl -u http://purl.uni-rostock.de/comodi/comodi#Attribution -f -a text/html --header content-type=text/html



## TESTS

There is a [python tool in `src/test.py`](https://github.com/binfalse/check_links/blob/master/src/test.py) that performs some basic test to verify that `check_links.pl` is working correctly.
I'd like to encourage you to add further test when extending `check_links.pl`!


## Download and install

Download the tool at [check_links.pl](/assets/resources/stuff/monitoring/check_links/src/check_links.pl) (or see the [project on GitHub](https://github.com/binfalse/check_links))

Please consider to take a look at my [general monitoring setup notes](/software/monitoring/plugin-setup-notes/).
