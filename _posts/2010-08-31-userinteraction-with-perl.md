---
layout: post
title: 'Userinteraction with Perl'
tags:
  - Bash
  - hacked
  - Programming
  - simplification
  - userinteraction
categories:
  - Perl
  - Software

---

Til today I scripted the user interactions in Perl by my own, but now I've learned there is an easier way to interact with the user.

The old way was something like this:



{% highlight perl %}
my $input = "";
while ($input ne "yes")
{
    print "say yes: ";
    chomp ($input = <>); 
}
print "thanks\\n";
{% endhighlight %}



That does what I want it to do, but if you want more complex operations it's somewhat difficult to hack it. If you want the user to choose something from a menu or to give you an integer, you have to write lots of code and you have to verify the input by your own.
There is a Perl module called <a href="http://search.cpan.org/~dconway/IO-Prompt-0.997001/lib/IO/Prompt.pm">IO::Prompt</a> to simplify this ( `aptitude install libio-prompt-perl` ). For example to get an integer from the user you can use this part of code:



{% highlight perl %}
use IO::Prompt;
my $integer = prompt ("give me your integer: ", -integer);
{% endhighlight %}



The function  `prompt`  will print the string and waits for an input. When the user gives an input it will  `chomp`  it and verifies the input by your condition (here it tests whether the input is an integer). If the test fails it prints an error and gives the user a new chance to type a correct value until the conditions are complied. So you can be sure that the returned value is definitely an integer!
Of course you can tell prompt to check for more difficult conditions, something like a regular expression. For example to get a hexadecimal value you can use this:



{% highlight perl %}
use IO::Prompt;
my $hex = prompt ("give me a hex: ",
			 -req => {"Need a *hexadecimal* value!: " => qr/^[0-9A-F]+$/i}
			 );
print "decimal value: " . hex($hex) . "\\n";
{% endhighlight %}



With  `-req`  this function expects a hash, it's entries must match to the input or it will print the corresponding key as error message. As values you can pass functions that should return true if the input is correct, or a regular expression that must pattern match or something like this (see <a href="http://search.cpan.org/~dconway/IO-Prompt-0.997001/lib/IO/Prompt.pm">IO::Prompt</a>). Here I'm using a regular expression that matches to hexadecimal input and if the user enters a correct input it's converted to base 10. An example run might look like this:



{% highlight bash %}
/tmp % ./prompt-test.pl
give me a hex: NOHEX
Need a *hexadecimal* value!: w00t
Need a *hexadecimal* value!: A6
decimal value: 166
{% endhighlight %}



Even menus are simple to realize. For example:



{% highlight perl %}
use IO::Prompt;
my $day = prompt ('Whats your favorite day?',
				-menu =>
				[
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
					'Sunday'
				]);
print "your choice was: " . $day . "\\n";
{% endhighlight %}



If you run this program your menu may look like:



{% highlight bash %}
/tmp % ./prompt-test.pl
Whats your favorite day?
     a. Monday
     b. Tuesday
     c. Wednesday
     d. Thursday
     e. Friday
     f. Saturday
     g. Sunday

> f
your choice was: Saturday
{% endhighlight %}



The freaks among you will try more complex menus. You are allowed to use hashes in hashes in arrays for your menu and  `prompt`  will lead the user through your options. You should know where to find further information about this :P
