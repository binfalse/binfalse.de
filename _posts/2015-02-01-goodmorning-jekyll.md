---
layout: post
title: Goodmorning jekyll!
tags:
  - blog
  - media
  - private
  - wordpress
  - jekyll
  - explained
  - simplification
categories:
  - website
  - web
  - ruby
  - software
  - private
  - html
  - howto

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
layout: post
title: Your title goes here.
~~~~~

But that's it. Now you can start writing. Read [more about posting](http://jekyllrb.com/docs/posts/).

Pages just live in the root of your jekyll instance. They will just be copy-translated. Thus, if you create a file `about.html` in the root jekyll will just translate included markdown and then copies it to `your-site.com/about.html`.



## But how2?

Yes, of course, I didn't want to start from scratch.
So I was looking for tools to convert my WordPress stuff to markdown for jekyll.
That was more or less successfull. There are tons of approaches. But non of them really met my needs. So I decided to extend on of those and forked a php-based [wordpress-to-jekyll](https://github.com/binfalse/wordpress-to-jekyll) converted from [davidwinter](https://github.com/davidwinter/wordpress-to-jekyll).

After a few commits the converter now exports posts, pages, and comments. It also distinguishes between published and draft. And downloads the attachments. Just give it a try and tell me if you experience any trouble.

### Comments

You're right. Comments on a static page is a bit contradictory. But not impossible.. ;-)  
I saw some blogs using the crap of Disqus and Facebook and stuff. Not my world, obviously..

But there is also a [static comment pluglin](http://www.hezmatt.org/~mpalmer/blog/2011/07/19/static-comments-in-jekyll.html) for jekyll. I [forked it](https://github.com/binfalse/jekyll-static-comments) to implement my changes. I do not need the PHP stuff, to submit a comment for my blog you can use one of the following three options. I will then decide whether I'm going to include the comment in my blog. I guess that is the ultimate way to fight Spam..

#### Submit a comment

* **[Send me an email](/contact/) with your comment.** Do not forget to mention the article you want to comment. And optionally include a website and a name to *sign* the comment.
* I am maintaining a [feedback site](fb.binfalse.de/). It is meant to receive feedback in general, for presentations, for my work, code, for the coffee that I serve to guests. Stuff, precisely. It is also available [through the TOR network](http://3djgibyu5osi4na5.onion/), so you can make sure you're really anonymously. You can use this website to also create comments. Every page contains a link **submit a comment through the feedback page**, which brings you to that page. Just make sure to mention the article, and if you want me to give you the credits also add include your name and a mail address; and optionally a website.
* You can simply **fork [the blog's repository](https://github.com/binfalse/binfalse.de)** and create a comment yourself in the `_comments` directory. Just have a look at the other comments. Send me a pull request and I'll have a look at it :)

### Images

Converting images from WordPress was a bit trickier.
There they use code similar to this:

{% highlight html %}
[caption id="attachment_XXX" align="alignXXX" width="XXX" caption="XXX"]<a href="XXX"><img src="XXX" alt="XXX" title="XXX" width="XXX" height="XXX" class="size-thumbnail wp-image-XXX" /></a> XXX[/caption]
{% endhighlight %}

However, in jekyll you do not have the whole environment by default.
After some searching I stumbled across a [solution](http://codingtips.kanishkkunal.in/image-caption-jekyll/).
Eventually, my [wordpress-to-jekyll converter](https://github.com/binfalse/wordpress-to-jekyll) substitues these environments with

{% highlight html %}
{ % include image.html align="alignXXX" url="XXX" img="XXX" title="XXX" caption="XXX" % }
{% endhighlight %}


and `_includes/image.html` (see [GitHub](https://github.com/binfalse/binfalse.de/blob/master/_includes/image.html)) creates something that's similar to the caption environment of WordPress. Some more CSS and everything worked like a charm! :)

I think that's it for the moment. Moving to jekyll was not that difficult. And I now have a static website that's hopefully changing from time to time...
