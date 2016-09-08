---
name: 'binfalse'
date: '2016-09-07 16:33:08'
link: 'https://binfalse.de'
post_id: "/2016/06/21/forget-the-at-use-curl-file-create"
---

Hi Frank,


the `$post` variable is only an associative array. Thus, you should be
able to simply add whatever you want to send. Let's assume you have an
array called `$image_paths` that contains the paths to images, then you
may do something like this:


{% highlight php %}
<?php
    for ($i = 0; $i < count($image_paths); ++$i) {
        $post["upload-$i"] = curl_file_create ($image_paths[$i]);
    }
?>
{% endhighlight %}

and afterwards send the the `$post` contents as usual.
Does that help?



Btw, the function is called `curl_file_create` ;-)

