---
title: "GChat login-cookie generator for mautrix' puppeting bridge"
layout: post
published: true
date: 2023-08-08 21:57:09 +0200
categories:
  - debian
  - javascript
  - html
  - software
  - web
tags:
  - auth
  - chrome
  - debian
  - dall-e
  - explained
  - firefox
  - extension
  - git
  - javascript
  - mozilla
  - google
  - matrix
  - web
  - chat
lang: en
ref: gchat-login-cookie-generator-for-mautrix-puppeting-bridge
---
At work we're using Google Workspace to manage ourself. However, I do have a couple of reservations against those kinds of software. Especially on my google-free mobile I am not able to use it - and thus could not chat with the team on-the-go without [Matrix](https://matrix.org/) and [mautrix' Google Chat puppeting bridge](https://docs.mau.fi/bridges/python/googlechat/index.html) 🤩

## The Problem
It seems Google recently altered authentication, which caused the bridge to adapt and consequently I need to frequently re-authenticate the bridge. 
In addition, the process of authentication became significantly more complicated: You'd need to login to you google account with some browser, then open the browser's dev tools to access the cookie data and extract a couple of special cookies in the correct Google domain to create a custom JSON object for the bridge, see the [full authentication instructions.](https://docs.mau.fi/bridges/python/googlechat/authentication.html)
However, that causes far too much load in my brain, urging automation!

## The Solution

{% include image.html align='alignright' url='/assets/media/pics/2023/gchat-login-cookie-popup-firefox.png' img='/assets/media/pics/2023/gchat-login-cookie-popup-firefox.png' title='Screenshot of the web extension\'s popup with some mock data' caption='Screenshot of the web extension\'s popup with some mock data' maxwidth='300px' %}

The solution should be able to read Google's cookies and should technically be realisable in just a couple of hours... Thus, a little web seemed to be the most obvious solution: it runs in the browser and it's pretty simple to read the cookies of some domain.

Thus, I developed a little web extension that is already available for both [<i class="fab fa-firefox"></i> Firefox](https://addons.mozilla.org/en-US/firefox/addon/gchat-login-cookie-generator/) and [<i class="fab fa-chrome"></i> Chromium based browsers](https://chrome.google.com/webstore/detail/matrix-gchat-bridge-login/mofmfbkepponmdchhamalbcldoajbmho).
The code is available at the [Matrix-GChat Bridge Login Cookie Generator repository on <i class="fab fa-github"></i> GitHub](https://github.com/binfalse/matrix-gchat-bridge-login-cookie-generator) and pretty simple.
The web extension basically consists of only the popup part with an icon sitting in the browsers toolbar.
Just imagine the popup as a very simple [HTML web page](https://github.com/binfalse/matrix-gchat-bridge-login-cookie-generator/blob/main/cookies.html) with a little touch of [JavaScript sugar](https://github.com/binfalse/matrix-gchat-bridge-login-cookie-generator/blob/main/cookies.js).
It basically asks the browser for all the cookies for the URL `https://chat.google.com`

{% highlight javascript %}
function getAllCookies() {
    if (typeof browser === "undefined") {console.log('trying chrome...')
        return chrome.cookies.getAll({url: "https://chat.google.com"})
    } else {
        return browser.cookies.getAll({url: "https://chat.google.com"});
    }
}
{% endhighlight %}

Those cookies are then iterated to collect the relevant ones for the `login-cookie` command in a `LoginCookie` data structure.
If it managed to find all the necessary cookies, the corresponding `login-cookie` string can be generated:


{% highlight javascript %}
    getCookie() {
        return `login-cookie {
    "compass": "${this.compass}",
    "ssid": "${this.ssid}",
    "sid": "${this.sid}",
    "osid": "${this.osid}",
    "hsid": "${this.hsid}"
}`
    }
{% endhighlight %}

and it will be revealed in a text area that get dynamically injected into the popup's page, together with a little button that will copy the contents of the textarea once clicked:

{% highlight javascript %}
    button.onclick = function () {
        navigator.clipboard.writeText(loginCookieArea.value).then(
            () => {
                console.log('clipboard successfully set');
            },
            () => {
                console.error('clipboard write failed');
            }
        );
        return false;
    };
{% endhighlight %}


Thus, you only need to click the icon in some browser where you're authenticated to the Google chat and the popup will give you the necessary `login-cookie` \o/


## The Publication

{% include image.html align='alignright' url='/assets/media/pics/2023/google-login-cookie-icon.png' img='/assets/media/pics/2023/google-login-cookie-icon.png' title='Icon of the web extension, created using dall-e on Hugging Face' caption='Icon of the web extension, created using dall-e on Hugging Face' maxwidth='300px' %}


Building the web extension is a breeze: just zip a couple of files :)  
I've even automated the process with a [nifty script](https://github.com/binfalse/matrix-gchat-bridge-login-cookie-generator/blob/68d93eef3af9d316829701bf3ba3bd735d8c4138/build.sh#L45).
The real journey was the publication process with Mozilla's AddOn Directory and the Chrome WebStore.
Initially, I developed the extension on my Debian-based Firefox, which only supported web extensions in version 2.
But there's a twist - Chromium dropped full support for version 2...
Thus, you will find two manifests in the repository...

The next challenge was the publication itself.
It's all nice and complicated, especially in the chrome web store maze.
I submitted the first round of the extension and for review at both platforms.
You know it from emails: once sent you see the parts that could need a bit of polishing.
So I improved the extension, build pipelines etc and wanted to resubmit a new version.
AMO played nice, allowing re-submissions, but Chrome WebStore only allows one submission at a time - frustrated I needed to wait for the review results before creating a new version.
The next day, AMO listed the most recent version of the extension it took another day for the Chrome review.
In total it took 5 days to get it published at the Chrome WebStore.
Not sure why the reviews take so long over there...?
Perhaps extra scrutiny?
Would actually doubt that, though...




