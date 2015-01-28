---
layout: post
title: 'Bash Wildcards'
tags:
  - Bash
  - explained
categories:
  - Shell
  - Software

---

I wanted to publish this summary about wildcards in the bash (and similar shells) some time ago, but didn't finish it. But finally it gets published.

The shell handles words or patterns containing a wildcard as a template. Available filenames are tested to see if they fit this template. This evaluation is also called <em>globbing</em>.
Let's have a look at a small example:



{% highlight bash %}
me@kile /tmp/blog $ ls
aaa   aaa2  aaaa1  aaaa3  aaaa5  abbb  bbbb
aaa1  aaa3  aaaa2  aaaa4  aaab   acdc  caab
me@kile /tmp/blog $ ls *b
aaab  abbb  bbbb  caab
{% endhighlight %}



In this example  `*`  is replaced by appropriate characters, and the list of matching files are passed to the  `ls`  command. This set of files will be used in the following examples.

<h2>Encode for a single character:  `?` </h2>
The question mark can be replaced by a single character. So if you want to get the files  `aaa1` ,  `aaa2` ,  `aaa3`  and  `aaab`  you can use the following pattern:



{% highlight bash %}
me@kile /tmp/blog $ ls aaa?
aaa1  aaa2  aaa3  aaab
{% endhighlight %}



So you see, the  `?`  is replaced by exactly one character. That is, both  `aaa`  and  `aaaa1`  won't match.

<h2>Encode for a an arbitrary number of characters:  `*` </h2>
To match any number of characters you can use the asterix  `*` . It can replace  `0`  to  `n`  characters,  `n`  is limited by the max length of the file name and depends on the file system you're using. Adapting the previous snippet you'll now also get  `aaa`  and  `aaaa1` :



{% highlight bash %}
me@kile /tmp/blog $ ls aaa*
aaa  aaa1  aaa2  aaa3  aaaa1  aaaa2  aaaa3  aaaa4  aaaa5  aaab
{% endhighlight %}



<h2>Encode for a set of characters:  `[...]` </h2>
Most of the common tasks can be done with the previous templates, but there are cases when you need to define the characters that should be replaced. You can specify this set of characters using brackets, e.g.  `[3421]`  can be replaced by  `3` ,  `4` ,  `2`  or  `1`  and is the same as  `[1-4]` :



{% highlight bash %}
me@kile /tmp/blog $ ls aaaa?
aaaa1  aaaa2  aaaa3  aaaa4  aaaa5
me@kile /tmp/blog $ ls aaaa[3421]
aaaa1  aaaa2  aaaa3  aaaa4
me@kile /tmp/blog $ ls aaaa[1-4]
aaaa1  aaaa2  aaaa3  aaaa4
{% endhighlight %}



As you can see aaaa5 doesn't match  `[3421]` , and btw. the order of the specified characters doesn't matter. And because it would be very annoying if you want to match against any alphabetic character (you would need to type all 26 characters), you can specify character ranges using a hyphen ( `a-z` ). Here are some exmaples:

<table><tr><th>Template</th><th>Character set</th></tr>
<tr><td> `[xyz1]` </td><td> `x` ,  `y` ,  `z`  or  `1` </td></tr>
<tr><td> `[C-Fc-f]` </td><td> `C` ,  `D` ,  `E` ,  `F` ,  `c` ,  `d` ,  `e`  or  `f` </td></tr>
<tr><td> `[a-z0-9]` </td><td>Any small character or digit</td></tr>
<tr><td> `[^b-d]` </td><td>Any character except  `b` ,  `c` ,  `d` </td></tr>
<tr><td> `[Yy][Ee][Ss]` </td><td>Case-insensitive matching of <em>yes</em></td></tr>
<tr><td> `[[:alnum:]]` </td><td>Alphanumeric characters, same as  `A-Za-z0-9` </td></tr>
<tr><td> `[[:alpha:]]` </td><td>Alphabetic characters, same as  `A-Za-z` </td></tr>
<tr><td> `[[:digit:]]` </td><td>Digits, same as  `0-9` </td></tr>
<tr><td> `[[:lower:]]` </td><td>Lowercase alphabetic characters, same as  `a-z` </td></tr>
<tr><td> `[[:upper:]]` </td><td>Uowercase alphabetic characters, same as  `A-Z` </td></tr>
<tr><td> `[[:space:]]` </td><td>Whitespace characters (space, tab etc.)</td></tr>
</table>

Btw. the files that match such a template are sorted before they are passed to the command.
