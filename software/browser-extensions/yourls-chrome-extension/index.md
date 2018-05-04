---
layout: page
title: 'YOURLS Chrome extension'

---

This is an extension for [Chromium](https://en.wikipedia.org/wiki/Chromium_%28web_browser%29) (Google's web browser) to shorten URLs with your own [YOURLS](http://yourls.org/) installation.



[YOURLS is an URL shortener](/2011/06/private-url-shortener/), just like *bit.ly* or *goo.gl*, but it's open source and so you're able to install your own private instance. Thus, you can diminish the tracking of these big platforms ;-)
This piece of software is an extension for the browser Chromium that let's you quickly shorten the URL of the website you are currently visiting. All you need is an installation of YOURLS. You can also find this plugin in [Chrome's Web Store](https://chrome.google.com/webstore/detail/yourls/nddaaiojgkoldnhnmkoldmkeocbooken).


## Installation

The extension is available from [Chrome's Web Store](https://chrome.google.com/webstore/detail/yourls/nddaaiojgkoldnhnmkoldmkeocbooken).
To install the latest dev version just clone the [GitHub](https://github.com/binfalse/YOURLS-ChromeExtension) repository and load this extension *unpacked* (read more at Googles [get-started-guide](https://developer.chrome.com/extensions/getstarted)).

{% include image.html align="alignright" url="/assets/media/pics/2018/yourls-chrome/options.png" img="/assets/media/pics/2018/yourls-chrome/options.png" title="Figure 1: Options Page" caption="Figure 1: Options Page" maxwidth="300px" %}

Before you can start shortening URLs you need to do some configuration. Open the configuration page by right-clicking the icon next to your address bar and choose *Options*, or open  `chrome://extensions/`  and click the *Options* link of the YOURLS entry. You'll see a page similar to the screenshot in Figure 1.

Following settings can be configures:

* **Server URL:** The URL to your YOURLS installation. In my case it's [https://s.binfalse.de/](https://binfalse.de/). You don't need to add anything, just specify the URL to the admin interface. The extension will care about the rest.
* **Signature:** The signature of your account. You will find this string on the *Tools* page in the *Secure passwordless API call* section.
* **Ask for a keyword?:** Should the extension ask for a keyword before shortening? If this box is checked you'll always be asked for a keyword before shortening. You may still leave the keyword field empty to let YOURLS assign a keyword automatically. If you leave this box unticked: clicking the toolbar button will immediately shorten the URL without any other interaction required.
* **Auto-copy result to clipboard:** If checked, the extension will automatically copy the short URL to your clipboard if the shortening was successful.
* **Max wait time:** There may always be a network issue or server downtime... How many seconds should we wait for an answer from the API before we give up?

If the form is filled correctly save your settings and give it a try!

## Usage

The extension provides two different ways for interaction:


{% include image.html align="alignright" url="/assets/media/pics/2018/yourls-chrome/popup.png" img="/assets/media/pics/2018/yourls-chrome/popup.png" title=" Figure 2: The popup produced by the extension." caption=" Figure 2: The popup produced by the extension." maxwidth="300px" %}

### The Icon in the Toolbar

Click the icon to shorten the URL of the web site you're currently visiting and a popup will appear, see Figure 2.
It shows the original (source) version and you may provide a keyword. A click on **shorten** sends the job to your YOURLS server and shows you the resulting short URL in the lower text field. The result can be copied to the clipboard. Two more buttons provide quick access to the extension's settings page and the YOURLS admin interface.


### The Context Menu

{% include image.html align="alignright" url="/assets/media/pics/2018/yourls-chrome/context-arrow.png" img="/assets/media/pics/2018/yourls-chrome/context-arrow.png" title=" Figure 3: The resulting overlay after clicking the context menu." caption=" Figure 3: The resulting overlay after clicking the context menu." maxwidth="300px" %}

If you right-click selected text in the current page the extension adds a context menu entry **Shorten URL** to shorten the page using the selected text as keyword, see Figure 3. (The selection will just appear in the textfield for the keyword, you still have to press the button to start shortening.)  






<div class="download"><strong>Download:</strong>
Extension: <a href="https://chrome.google.com/webstore/detail/yourls/nddaaiojgkoldnhnmkoldmkeocbooken">in Google's Web Store</a>
SourceCode: <a href="https://github.com/binfalse/YOURLS-ChromeExtension">at GitHub</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
