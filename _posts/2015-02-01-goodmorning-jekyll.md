---
layout: post
title: Goodmorning jekyll!
tags:
  - fail
categories:
  - CC
  - Debian
  - Ruby
  - Software

---

As you can see, I left WordPress and moved to jekyll!
Even if I really like the name, discarding WordPress was on my schedule for quite some time.

## Why leaving?
The main reasons for leaving WordPress:

* I always wanted to get rid of the whole overhead: admin interface, database connection, all the javascript stuff that slows the browser... All not necessary for just publishing some words...
* I do not like software that calls home without asking me. Sure, it's convenient for some people, but I hate such a behavior. And it makes me skeptic. No idea what is transferred exactly, but I'm almost sure they have my mail address..

There are some more reasons, but those two were sufficient to make me move.

## Where to go?

Recently, Micha pointed me to jekyll. [Jekyll](http://jekyllrb.com/) is a software to generate websites. You can simply write your stuff using [MarkDown](https://en.wikipedia.org/wiki/Markdown) and jekyll will build your page. Jekyll is really very simple. The generated page is static. And Jekyll is blog-aware.

I of course had a look at some other static-page-generators, but jekyll indeed seems to be the most convenient (and maybe sophisticated?) software.


## But how?

Basically, building a jekyll blog is dead easy.

### Install jekyll

You need to have `ruby` and `ruby-dev` installed, the just call:

    gem install jekyll

Not you can create a new website using

    jekyll new my-site

And you'll find a directory structure as explained [on their website](http://jekyllrb.com/docs/structure/).
You can also just [clone a git repository](https://github.com/plusjade/jekyll-bootstrap) to get a start. There are also [plenty of themes](http://jekyllthemes.org/) out there.


### Start publishing

A bit trickier than installing: You need to think.. ;-)

Posts go to `_posts` and should always be named `YYYY-MM-DD-identifier.md`. They always have a preamble (so-called [front matter](http://jekyllrb.com/docs/frontmatter/)) which looks like:

~~~~~
---
layout: post
title: Your title goes here.
---
~~~~~

But that's it. Now you can start writing. Read [more about posting](http://jekyllrb.com/docs/posts/).

Pages just live in the root of your jekyll instance. They will just be copy-translated. Thus, if you create a file `about.html` in the root jekyll will just translate included markdown and then copies it to `your-site.com/about.html`.



## But how2?

Yes, of course, I didn't want to start from scratch.
So I was looking for tools to convert my WordPress stuff to markdown for jekyll.
That was more or less successfull. There are tons of approaches. But non of them really met my needs. So I decided to extend on of those and forked a php-based [wordpress-to-jekyll](https://github.com/binfalse/wordpress-to-jekyll) converted from [davidwinter](https://github.com/davidwinter/wordpress-to-jekyll).

After a few commits the converter now exports posts, pages, and comments. It also distinguishes between published and draft. And downloads the attachments. Just give it a try and tell me if you experience any trouble.

### Comments

You're right. Comments on a static page are a bit contradictory. But not impossible.. ;-)

I saw some blogs using the crap of Disqus and Facebook and stuff. Not my world, obviously..

But there is also a [static comment pluglin](http://www.hezmatt.org/~mpalmer/blog/2011/07/19/static-comments-in-jekyll.html) for jekyll.
https://github.com/binfalse/jekyll-static-comments

