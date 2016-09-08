---
date: '2015-11-21 16:04:11'
link: ''
name: anonymous
post_id: /2010/08/21/show-all-tags-in-wp-when-creating-new-post
---

Thanks so much for posting this, Mr Scharm! It really saved me a lot of time, since I am not that faimilar with the WordPress structure yet. In my version, hey aren&#39;t at the exact line numbers cited here, but are easy to find with a search for the words.

For a new site where few tags had been used yet, I wanted to see them all, even if unused, and also do not like the &quot;filter bubble&quot; effect of ordering by popularity. I include the parameters to achieve these changes to save someone else the trouble of looking them up:

     `$tags = get_terms( $taxonomy, array( 'number' => 999, 'orderby' => 'name', 'order' => 'DESC' , 'hide_empty'=> false) );`

Cordially,
B. Magilavy