---
date: '2014-03-10 08:29:51'
link: http://mayurrokade.com
name: Mayur Rokade
post_id: /2012/09/08/howto-debug-bash-scripts
---

Thanks for nice tip. Btw I tweaked your PS4 value for color high lighting of green colored line numbers. Here is the PS4 I used. 



{% highlight bash %}
export 'PS4=\[\e[1;32m\]\][Line: ${LINENO}]\[\e[0m\]\] :${FUNCNAME[0]}: '
{% endhighlight %}



For more terminal color info check: https://wiki.archlinux.org/index.php/Color_Bash_Prompt