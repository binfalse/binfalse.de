---
date: '2013-08-30 16:59:05'
link: http://consciencia.net/gblog
name: Gustavo Barreto
post_id: /2010/08/21/show-all-tags-in-wp-when-creating-new-post
---

<strong>It has "moved" in Wordpress 3.6</strong>:

File:
 `wp-admin/includes/ajax-actions.php` 

Line  `666` :

`$tags = get_terms( $taxonomy, array( 'number' =&gt; 45, 'orderby' =&gt; 'count', 'order' =&gt; 'DESC' ) );`

Quite scary number ;)