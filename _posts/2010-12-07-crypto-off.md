---
layout: post
title: 'Crypto off'
tags:
  - explained
  - hacked
  - Network
  - Private
  - Programming
  - Security
  - SSL
  - ugly
  - userinteraction
  - Wordpress
categories:
  - Network
  - Private
  - Programming
  - Security
  - Website
  - Wordpress

---

if you haven't noticed yet: SSL is turned off...

Of course it isn't really turned off, all content is still available through encrypted connections (all links are still working), but it's disabled by default.

<strong>But why!?</strong>
I got a lot of mails during the last weeks, telling me that there is a problem with my SSL cert.
Yes, your browser is completely right, my cert isn't valid because I've signed it by myself.. To get a trusted certificate that your browser recognizes to be valid is very expensive. For a cheap one I still have to pay about $100, that's neither worthy nor affordable for me and my private blog. But I'm always interested in ideally offering secure mechanisms, so I tried to provide SSL.
Another reason for SSL was my auth stuff. Wordpress doesn't provide both SSL and SSL-free access. In an installation you have to decide whether to use  `https://...`  or  `http://...`  for URL's. So all links are either to SSL encrypted content or the next click is unencrypted. Don't ask me why they don't check whether SSL was turned on/off for the last query and decide afterwards on using SSL for all further links.. However, I didn't want to authenticate myself unencrypted and so I enabled SSL by default.

To be congenial to my visitors I turned off SSL, <em>until somebody sponsors a valid certificate</em>. There are also many disgusting tools having problems with my website, so it might be the better way to deliver unencrypted contend. The information on my site isn't that secret ;-)

As a consequences you aren't able to register/login anymore. I scripted a little bit to find a secure way for authenticating myself, but you aren't allowed to take this path :-P
Nevertheless, comments are still open and doesn't require any authentication.

<strong>If you can find any SSL zombies please inform me!</strong>
