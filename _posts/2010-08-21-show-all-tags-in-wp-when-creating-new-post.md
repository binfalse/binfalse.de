---
layout: post
title: 'Show all tags in WP when creating new post'
tags:
  - Ajax
  - Blog
  - Media
  - Programming
  - Wordpress
categories:
  - JavaScript
  - PHP
  - Software
  - Wordpress

---

I was annoyed that WordPress by default just shows 45 most used tags on the <em>Add New Post</em> page and found a solution to display all Tags.

After I create a new post in this blog I usually tag it. WordPress provides a very helpful widget that displays the most used tags, but I want to see all tags that I've created in the past.
Some research through the net doesn't bring solutions, so I had to walk through the code on my own. Wasn't very difficult, it was clear that the tags come with <a href="http://en.wikipedia.org/wiki/Ajax_%28programming%29">Ajax</a> to the site, and I found the code in  `wordpress/wp-admin/admin-ajax.php`  on line 616 (WordPress 3.0.1) or  `wordpress/wp-admin/includes/ajax-actions.php`  on line 666 (WordPress 3.6, see <a href="/2010/08/show-all-tags-in-wp-when-creating-new-post/comment-page-1/#comment-1093">comments</a>):


{% highlight php %}
$tags = get_terms( $taxonomy, array( 'number' => 45, 'orderby' => 'count', 'order' => 'DESC' ) );
{% endhighlight %}


That is what you'll carry by JavaScript. To get more tags just change this line to something like this:


{% highlight php %}
$tags = get_terms( $taxonomy, array( 'number' => 999, 'orderby' => 'count', 'order' => 'DESC' ) );
{% endhighlight %}


You can also edit  `wordpress/wp-admin/includes/meta-boxes.php` , original is:


{% highlight php %}
<p class="hide-if-no-js"><a href="#titlediv" class="tagcloud-link" id="link-<?php echo $tax_name; ?>">< ?php echo $taxonomy->labels->choose_from_most_used; ?></a></p>
{% endhighlight %}


If you change it to:


{% highlight php %}
<p class="hide-if-no-js"><a href="#titlediv" class="tagcloud-link" id="link-<?php echo $tax_name; ?>">< ?php echo $taxonomy->labels->all_items; ?></a></p>
{% endhighlight %}


the link to get the tags will be called <em>All Tags</em>, not <em>Choose from the most used tags</em>.

I hope this could help some of you. With the next WordPress update these changes will be lost, but you should be able to do it again and maybe I'll blog about it ;)


<h3>Update for WordPress 3.6</h3>
You need to edit:
<ul>
	<li> `wordpress/wp-admin/includes/ajax-actions.php`  line 666</li>
	<li> `wordpress/wp-admin/includes/meta-boxes.php` </li>
</ul>
(thanks to <a href="/2010/08/show-all-tags-in-wp-when-creating-new-post/comment-page-1/#comment-1093">Gustavo Barreto</a>)


<h3>Update for WordPress 3.8.1</h3>
You need to edit:
<ul>
	<li> `wordpress/wp-admin/includes/ajax-actions.php`  line 691</li>
	<li> `wordpress/wp-admin/includes/meta-boxes.php`  line 381</li>
</ul>
(thanks to <a href="/2010/08/show-all-tags-in-wp-when-creating-new-post/comment-page-1/#comment-1146">August</a> for reminder)


<h3>Update for WordPress 3.9.1</h3>
You need to edit:
<ul>
	<li> `wordpress/wp-admin/includes/ajax-actions.php`  line 702</li>
	<li> `wordpress/wp-admin/includes/meta-boxes.php`  line 410</li>
</ul>


<h3>Update for WordPress 4.1</h3>
You need to edit:
<ul>
	<li> `wordpress/wp-admin/includes/ajax-actions.php`  line 836</li>
	<li> `wordpress/wp-admin/includes/meta-boxes.php`  line 431</li>
</ul>

