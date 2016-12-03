BINFALSE -- Blog
=====

My blog at [binfalse.de](http://binfalse.de).
Stylesheet based on [dbyll](https://github.com/dbtek/dbyll-ghost).
Generated from Worpress using the [wordpress-to-jekyll converter](https://github.com/binfalse/wordpress-to-jekyll)

## Useful stuff for copy and paste

include image:

    {% include image.html align="alignright" url="LINKTOPIC" img="LINKTOPIC" title="ALT" caption="CAPTION" maxwidth="300px" %}

include code:

    {% highlight bash %}
    some code
    {% endhighlight %}

## Build

To build the websites I created a Docker image at [binfalse/jekyll](https://hub.docker.com/r/binfalse/jekyll/), which uses jekyll to translate the the text to HTML.
The Docker image [binfalse/jekyll-git](https://hub.docker.com/r/binfalse/jekyll-git/) is based on [binfalse/jekyll](https://hub.docker.com/r/binfalse/jekyll/), but also includes support for git to pull the latest version of the blog from GitHub.

### License
Text stuff is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).
Code stuff is licensed under [GPLv3](http://www.gnu.org/licenses/).

