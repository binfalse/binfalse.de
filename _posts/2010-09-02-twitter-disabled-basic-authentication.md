---
layout: post
title: 'Twitter disabled Basic Authentication'
tags:
  - hacked
  - Media
  - Network
  - Programming
  - Security
  - twitter
  - ugly
  - userinteraction
categories:
  - Network
  - Perl
  - Security
  - Software
  - Web

---

Some of you may have recognized that twitter has disabled the so called <em>Basic Authentication</em>. So my <a href="/2010/07/welcome-to-twitter/">previous twitter-tools</a> don't work anymore. But don't bury your head in the sand, here are the newer versions.

Basic Authentication means you send your account information (username/password) unencrypted with your query (status update/timeline request/...) to twitter. Of course this method isn't a nice way, so twitter disabled this method of authentication.

But the new methods of API calls are more complicated (called <a href="https://api.twitter.com/oauth/request_token">"OAuthcalypse"</a>) and I really don't like them. But whoever listens to me?

If you now want to interact with the twitter API, you have to register your tool as <a href="http://dev.twitter.com/apps/new">new twitter tool</a>. Don't ask me why, but you have to choose an unique name (all over the twitter world) for your application and get some random strings. For example for a Perl script you need the ones called <em>Consumer key</em> and <em>Consumer secret</em>.

If you want to interact with twitter, you have to do the following:

	<li>send the combination of <em>Consumer key</em> and <em>Consumer secret</em> to the server
	<li>receive an URL from the server where the user itself can find a pin code (when (s)he is logged into twitter)
	<li>send this code to the server again and the user is verified
	<li>receive some more authentication information from the server, store it for the next time, so the user don't have to authenticate again


Very annoying method, but there is no alternative method and at least your account is more save against hijacker.

By the way I found a Perl module called <a href="http://search.cpan.org/perldoc?Net::Twitter">Net::Twitter</a> that helps a lot.

Here is my snippet to solve this authentication stuff:



{% highlight perl %}
use Net::Twitter;

my $CRED_FILE = "somefile";

sub restore_cred {#read creds from $CRED_FILE}
sub save_cred {#write creds to $CRED_FILE}

my $nt = Net::Twitter->new(traits => ['API::REST', 'OAuth'], consumer_key => "KEY", consumer_secret => "SECRET",);
my ($access_token, $access_token_secret) = restore_cred();
if ($access_token && $access_token_secret)
{
	$nt->access_token($access_token);
	$nt->access_token_secret($access_token_secret);
}

unless ( $nt->authorized )
{
	print "Authorize this app at ", $nt->get_authorization_url, " and enter the PIN: ";
	chomp (my $pin = <stdin>);
	my($access_token, $access_token_secret, $user_id, $screen_name) = $nt->request_access_token(verifier => $pin);
	if (save_cred($access_token, $access_token_secret))
	{ print "successfull enabled this app! credentials are stored in: " . $CRED_FILE . "\\n" }
	else
	{ die "failed\\n"; }
}
if ($nt->update({ status => $status }))
{% endhighlight %}



Ok, you see it's not impossible to solve this problem. And there is another advantage, with these two scripts I don't have to provide my username/passwort any more.

Here is <a href='/wp-content/uploads/2010/09/tweet-v2.pl'>the script to tweet from command line </a> and <a href='/wp-content/uploads/2010/09/twitstat-v2.pl'>this script dumps the actual news</a> to the console.

To use my tools just download them to your machine, rename them as you want and then just run it:

* To tweet something call  `tweet-v2.pl`  with your status message as argument.
* To get latest informations from the people you are following just call  `twitstat-v2.pl`  with an optional argument defining the maximal number of messages you want to see.

For the first time you'll see a link where you'll get your pin (open the link with your browser), after wards the tools will store your credentials in  `[toolname].credentials` . Just try it, won't (hopefully) break anything :P

<div class="download"><strong>Download:</strong>
Perl: <a href='/wp-content/uploads/2010/09/tweet-v2.pl'>tweet-v2.pl</a> (tweet from command line)
Perl: <a href='/wp-content/uploads/2010/09/twitstat-v2.pl'>twitstat-v2.pl</a> (get latest news)
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
