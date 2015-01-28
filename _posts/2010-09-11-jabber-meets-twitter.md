---
layout: post
title: 'Jabber meets Twitter'
tags:
  - Jabber
  - Media
  - Network
  - Programming
  - twitter
  - userinteraction
categories:
  - Media
  - Network
  - Perl
  - Software
  - Web

---

This evening I implemented a <a href="http://xmpp.org/">XMPP</a> bridge to <a href="http://twitter.com/">twitter</a>. So I'll get all news via IM and can update my status by sending an IM to a bot.

Nothing new, I don't like the twitter web interface. Neither to read, nor to write messages. So I developed <a href="/2010/09/twitter-disabled-basic-authentication/">some scripts</a> to tweet from command line. These tools are still working, but not that comfortable as preferred.

Today I had a great thought. At <a href="http://www.gajim.org/">Gajim</a> I'm online at least 24/7, talking with people, getting news etc. So the comparison with twitter is obvious.

After some research how to connect to twitter and jabber I decided to implement the bot in Perl. I still worked a little bit with <a href="http://search.cpan.org/~mmims/Net-Twitter-3.13008/lib/Net/Twitter.pod">Net::Twitter</a>, so one side of the connection is almost done. For the other side I used the module <a href="http://search.cpan.org/~toddr/Net-Jabber-Bot-2.0.8/lib/Net/Jabber/Bot.pm">Net::Jabber::Bot</a> to implement a bot listening for messages or commands and sending twitter news via IM to my jabber account. The call for the jabber bot looks like:



{% highlight perl %}
my $bot = Net::Jabber::Bot->new ({
	server => $j_serv
	, port => $j_port
	, username => $j_user
	, password => $j_pass
	, alias => $j_user
	, message_function => \\&messageCheck
	, background_function => \\&updateCheck
	, loop_sleep_time => 40
	, process_timeout => 5
	, forums_and_responses => {}
	, ignore_server_messages => 1
	, ignore_self_messages => 1
	, out_messages_per_second => 20
	, max_message_size => 1000
	, max_messages_per_hour => 1000});

$bot->SendPersonalMessage($j_auth_user, "hey i'm back again!");
$bot->Start();
{% endhighlight %}



Most of it should be clear, the function  `messageCheck`  is called when a new message arrives the bot's jabber account. There I parse the text whether it starts with  `!`  (then it's a command) otherwise the bot schould take the message to update the twitter status.
 `updateCheck`  is the background function, it's called when the bot idles. Here is time to check for news at twitter. It is called  `loop_sleep_time`  secs.

The rest is merely a matter of form. News from twitter are jabber'ed, IM's from the authorized user are twitter'ed. Cool, isn't it!?

Just download the tool, create a new jabber account for the bot (you'll get one for example from <a href="http://web.jabber.ccc.de/">jabber.ccc.de</a>) and update the  `jmt.conf`  file with your credentials.
Of course you need the additional Perl modules, if you also experience various problems with <em>Net::Jabber::Bot</em> try to use the latest code from <a href="http://github.com/toddr/perl-net-jabber-bot.git">git://github.com/toddr/perl-net-jabber-bot.git</a>.

The bot could simply be launched by running the Perl script. Send  `!help`  to the bot to get some information about known commands.
Just start it at any server/PC that has a network connection.

What comes next? If anyone would provide a server I would like to implement a multiuser tool, maybe with database connectivity!?


<div class="download"><strong>Download:</strong>
Perl: <strike><a href='https://sourceforge.net/projects/jabbervstwitter/files/latest'>jmt.tgz</a></strike> <small>please see <a href="https://github.com/binfalse/jabber-vs-twitter">GitHub</a> for the latest version</small>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
