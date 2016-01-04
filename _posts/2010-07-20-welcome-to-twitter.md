---
layout: post
title: 'Welcome to twitter'
tags:
  - bash
  - curl
  - media
  - network
  - programming
  - twitter
categories:
  - media
  - perl
  - shell
  - software
  - web

---

When I signed in this morning <a href="http://0rpheus.net/">Micha</a> greets me with his status of eliminating the first pot of coffee. Very interesting... So we decided to start twittering ;)


<div class="alert">This version is deprecated since twitter disabled <em>Basic Authentication</em>. For a new version see <a href="/2010/09/twitter-disabled-basic-authentication/">Twitter disabled Basic Authentication</a></div>
I already registered an account about ten months ago, just to see how it works, but now I'll try to show some activity and tweet a lot of boring things..

First of all I developed a little script that tweets my messaged via curl:



{% highlight bash %}
#!/bin/bash

user=USER
msg=$*
if [ "${#msg}" -gt 140 ]
then
    echo "msg too long: ${#msg}"
    exit 1
fi

curl --basic -u $user -d status="$msg" https://twitter.com/statuses/update.xml >> /dev/null
{% endhighlight %}



Just call it with your message, it will ask for a passphrase to your account.. Just <a href='/wp-content/uploads/2010/07/tweet.sh'>download it</a> and use it like  `./tweet.sh yeah it works` .

And of course I've written a script that dumps all news to my console. To parse the XML I'm using Perl:



{% highlight perl %}
#!/usr/bin/perl -w
use warnings;
use strict;
use LWP::UserAgent;
use XML::TreeBuilder;
use XML::Entities;
use POSIX;
binmode STDOUT, ":utf8";

my $max = 10;
$max = $ARGV[0] if ($ARGV[0] && isdigit ($ARGV[0]));

my $browser = LWP::UserAgent->new;
$browser->credentials('twitter.com:443', 'Twitter API', 'USER' => 'PASSWORD' );
my $response = $browser->get('https://twitter.com/statuses/friends_timeline.xml');
die "failed...\\n" . $response->status_line if (!$response->is_success);
my $tree = XML::TreeBuilder->new();
$tree->parse($response->decoded_content);

my $anz = 1;
foreach my $status ($tree->find_by_tag_name ('status'))
{
	my $time = XML::Entities::decode ('all', $status->find_by_tag_name ('created_at')->as_text);
	my $text = XML::Entities::decode ('all', $status->find_by_tag_name ('text')->as_text);
	my $user = XML::Entities::decode ('all', $status->find_by_tag_name ('user')->find_by_tag_name ('screen_name')->as_text);
	print "$text\\n\\tby $user at $time\\n\\n";
	last if (++$anz > $max);
}
{% endhighlight %}



A little bit more code, but easy to use! Just <a href='/wp-content/uploads/2010/07/twitstat.pl'>download</a> and run it with  `./twitstat.pl [MAX_NUMBER_OF_TWEETS]` . (You may need some additional Perl libs)

So let's see how long I keep going on.. You can follow me at <a href="http://twitter.com/binfalse">http://twitter.com/binfalse</a>

<div class="download"><strong>Downloads:</strong>
Bash: <a href='/wp-content/uploads/2010/07/tweet.sh'>tweet.sh</a> (tweet from command line)
Perl: <a href='/wp-content/uploads/2010/07/twitstat.pl'>twitstat.pl</a> (get latest news)
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
