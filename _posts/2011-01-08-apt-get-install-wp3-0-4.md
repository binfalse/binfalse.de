---
layout: post
title: 'apt-get install WP'
tags:
  - Blog
  - hacked
  - Private
  - Rumpel
  - Wordpress
categories:
  - Junk
  - Private
  - Software
  - Website
  - Wordpress

---

Finally I also upgraded my blog to <a href="http://wordpress.org/">Wordpress</a>@<a href="http://wordpress.org/download/">3.0.4</a>, eliminating a <a href="http://wordpress.org/news/2010/12/3-0-4-update/">critical bug</a>.


<a href="http://users.informatik.uni-halle.de/~ruttkies/RforRocks/2010/12/wordpress-upgrade/">Rumpel</a> frequently reminded me to do that, but I was too lazy to find my own modifications to the WP core... But today I did! And thinking ahead, here I record what I'm changing to this version! Majorly for me, but maybe you like it ;-)

<h2>Display whole tag cloud in wp-admin</h2>
When you create an article WP by default only displays the 45 most-used tags in the sidebar. I want to see all of them:

<strong>File to change:</strong>  `wp-admin/includes/meta-boxes.php` 


{% highlight diff %}
273c273
< <p class="hide-if-no-js"><a href="#titlediv" class="tagcloud-link" id="link-<?php echo $tax_name; ?>"><?php echo $taxonomy->labels->all_items; ?></a></p>
---
> <p class="hide-if-no-js"><a href="#titlediv" class="tagcloud-link" id="link-<?php echo $tax_name; ?>"><?php echo $taxonomy->labels->choose_from_most_used; ?></a></p>
{% endhighlight %}



<strong>File to change:</strong>  `wp-admin/admin-ajax.php` 


{% highlight diff %}
616c616
<       $tags = get_terms( $taxonomy, array( 'number' => 999, 'orderby' => 'count', 'order' => 'DESC' ) );
---
>       $tags = get_terms( $taxonomy, array( 'number' => 45, 'orderby' => 'count', 'order' => 'DESC' ) );
{% endhighlight %}



<h2>Remove http:// from JavaScript prompts</h2>
If I want to insert a link into an article I often use the button above the textarea. It's very friendly from WP to remind the users to start links with  `http://` , but for me it's only disgusting because I usually copy&paste the URL from the browsers address bar and have to delete the  `http://`  from the pop-up...
To delete them permanently edit  `wp-includes/js/quicktags.js` . Unfortunately this script is just one line, so a diff won't help you, but I can give you a vim substitution command:



{% highlight perl %}
s/"http:\\/\\/"/""/g
{% endhighlight %}



<strong>Update 07. July 2011:</strong> For <strong>WP > 3.2</strong> you also need to apply this regex for  `wp-includes/js/tinymce/plugins/wplink/js/wplink.js`  to also eliminate this disgusting  `http://`  from the new link-overlay...
