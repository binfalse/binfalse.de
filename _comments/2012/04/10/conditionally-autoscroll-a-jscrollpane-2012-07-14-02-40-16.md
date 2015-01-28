---
name: Harold
link: ''
date: '2012-07-14 02:40:16'
comment: "Thanks for the post, it was very useful to me. But when i tried to implement it i ran into some trouble because the scroll bar wouldn't follow the incoming data. It turned out that i had to add to the current position the value of the visible part of the scroll bar like: \n\n\n{% highlight java %}\nint currentpos	=vbar.getValue()  +vbar.getVisibleAmount();\n{% endhighlight %}\n\n\n Once i did this it worked just fine. Thanks again for the post."
post_id: /2012/04/10/conditionally-autoscroll-a-jscrollpane

---


