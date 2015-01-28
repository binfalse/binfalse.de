---
layout: post
title: 'Cool ZSH features'
categories:
  - Junk

---

This is a collection of smart ZSH features, to make beginners tempting for it ;-)



Functions

fpath
With fpath you can export functions to files. For example having a file /DIR/myFunction.sh:

#!/usr/bin/zsh
print arguments: $*
export test="$test 123"

You can of course run it from commandline:

% /DIR/myFunction.sh hey babe
arguments: hey babe
LANGUAGE=
KONSOLE_DBUS_SERVICE=:1.11
GLADE_PIXMAP_PATH=:
[...]

but you can also include this file in your fpath and call it as a function:

% fpath=(/DIR $fpath)
% autoload -U myFunction.sh # -U ignores aliases while loading, security first
% myFunction.sh hey babe
arguments: hey babe
LANGUAGE=
KONSOLE_DBUS_SERVICE=:1.11
GLADE_PIXMAP_PATH=:

But this is much more complicated, isn't it? So why shouldn't I call the file directly?
Run both versions again and take a look at your  `env`  (especially at the var  `$test` :  `print $test` ). You'll see that the file-call isn't able to change your environment, while the function-call is.

<h2>Aliases</h2>

<h3>Suffix Aliases</h3>
Typing a string ending in the  `.ALIAS`  will run the defined program with the string as an argument:

alias -s txt=vim xml=vim

If you have a XML file just type it's name and it will be opened in vim. There are some more useful examples:

alias -s log=$PAGER
alias -s com=$BROWSER de=$BROWSER org=$BROWSER

That will open logfiles with your pager (probably  `less`  or  `more` ) and domains in your browser. Just try to type binfalse.de ;-)

<h3>Global Aliases</h3>
Global aliases are expanded whereever the can be found in your commandline (as long as they are seperated with whitespaces from other). Here is a smart shortcut:

alias -g G='| grep'
cat file.txt G pattern

In combination with suffix aliases you can do the following:

# long command
cat file.txt | grep pattern | less
# aliases
alias -s txt=cat
alias -g G='|grep' L='|less'
# short
file.txt G pattern L




Expansion
Brace expansion
{}


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
