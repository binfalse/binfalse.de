---
layout: page
title: 'YOURLS Firefox WebExtension'

---

This Web Extension for [Firefox](http://www.mozilla.com/en-US/firefox/new/) allows you to shorten URLs using your own [YOURLS](https://yourls.org) instance. This is a rebuild of the [first version](../yourls-firefox-extension/), which uses legacy Firefox techniques that are not supported anymore.



<a href="/2011/06/private-url-shortener/">YOURLS is an URL shortener</a>, just like bit.ly or goo.gl, but it is open source and you can install your own private instance. Thus, you can diminish the tracking of these big platforms ;-)

This extension integrates into to the UI of Firefox to quickly shorten the URL of a website you visiting.
All you need is a Firefox and an installation of YOURLS. You can also find this plugin at <a href="https://addons.mozilla.org/en-US/firefox/addon/yourls-shortener/">Mozillas addon service platform</a>.

## Integration

The YOURLS extension integrates into Firefox as a toolbar button.
Once it's clicked you will see a popup with some options to shorten the current page's URL:


{% include image.html align="aligncenter" url="/assets/media/pics/2017/yourls-firefox/popup.png" img="/assets/media/pics/2017/yourls-firefox/popup.png" title="Through a popup window you can shorten the current URL. It shows the original (source) version and you may provide a keyword. A click on 'shorten' sends the job to your YOURLS server and shows you the resulting short URL in the lower text field. The result can be copied to the clipboard. Two more buttons provide quick access to the extension's settings page and the YOURLS admin interface." caption="Through a popup window you can shorten the current URL. It shows the original (source) version and you may provide a keyword. A click on 'shorten' sends the job to your YOURLS server and shows you the resulting short URL in the lower text field. The result can be copied to the clipboard. Two more buttons provide quick access to the extension's settings page and the YOURLS admin interface." %}


The extension also adds an entry to the context menu.
If you right click into the page you'll spot the logo:



{% include image.html align="aligncenter" url="/assets/media/pics/2017/yourls-firefox/context-menu.png" img="/assets/media/pics/2017/yourls-firefox/context-menu.png" title="The context menu receives another item 'Shorten URL' that can be used to trigger the popup. If you selected some text on the web page the selection will be nominated as a keykowrd, see also following picture." caption="The context menu receives another item 'Shorten URL' that can be used to trigger the popup. If you selected some text on the web page the selection will be nominated as a keykowrd, see also following picture." %}


The extension is able to detect selected text on the page.
It will propose this selection as a keyword for shortening:



{% include image.html align="aligncenter" url="/assets/media/pics/2017/yourls-firefox/selection.png" img="/assets/media/pics/2017/yourls-firefox/selection.png" title="Selected text will be suggested as a keyword. You can still change it before clicking 'shorten'!" caption="Selected text will be suggested as a keyword. You can still change it before clicking 'shorten'!" %}


Right-clicking a link will shorten it's target and not the current URL:


{% include image.html align="aligncenter" url="/assets/media/pics/2017/yourls-firefox/link.png" img="/assets/media/pics/2017/yourls-firefox/link.png" title="Right-clicking a link offers a menu item to shorten the link's target. Thus, not the active page will be shortened, but the page that is linked to!" caption="Right-clicking a link offers a menu item to shorten the link's target. Thus, not the active page will be shortened, but the page that is linked to!" %}


## Preferences

The extension can be configured through the AddOn manager at `about:addons` (*Menu->Add-ons*).
Double-click the YOURLS shorter and you will find the following menu:


{% include image.html align="aligncenter" url="/assets/media/pics/2017/yourls-firefox/preferences.png" img="/assets/media/pics/2017/yourls-firefox/preferences-preview.png" title="Preferences of the YOURLS Firefox extension" caption="Preferences of the YOURLS Firefox extension" %}



Following values can be configures:

* **Server URL:** The URL to your YOURLS installation. In my case it's [https://s.binfalse.de/](https://binfalse.de/). You don't need to add anything, just specify the URL to the admin interface. The extension will care about the rest.
* **Signature:** The signature of your account. You will find this string on the *Tools* page in the *Secure passwordless API call* section.
* **Ask for a keyword?:** Should the extension ask for a keyword before shortening? If this box is checked you'll always be asked for a keyword before shortening. You may still leave the keyword field empty to let YOURLS assign a keyword automatically. If you leave this box unticked: clicking the toolbar button will immediately shorten the URL without any other interaction required.
* **Auto-copy result to clipboard:** If checked, the extension will automatically copy the short URL to your clipboard if the shortening was successful.
* **Max wait time:** There may always be a network issue or server downtime... How many seconds should we wait for an answer from the API before we give up?


## Download

This extension is licensed under <a href="http://www.gnu.org/licenses/gpl.html">GPLv3</a> and is developed at <a href="ihttps://github.com/binfalse/YOURLS-FirefoxExtension">GitHub/binfalse/YOURLS-FirefoxExtension</a>. It's of course available from <a href="https://addons.mozilla.org/en-US/firefox/addon/yourls-shortener/"><abbr title="Addons.Mozilla.Org">Mozilla's Add-on Platform</abbr></a>.

* [Extension at AMO](https://addons.mozilla.org/en-US/firefox/addon/yourls-shortener/)
* [Releases at GitHub](https://github.com/binfalse/YOURLS-FirefoxExtension/releases)
* [SourceCode at GitHub](https://github.com/binfalse/YOURLS-FirefoxExtension)


## Issues

If you experience any problems, doubts, or feature requests please do not hesitate to [contact me](https://binfalse.de/contact/) or file an issue at [the GitHub project](https://github.com/binfalse/YOURLS-FirefoxExtension/issues/).


<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://github.com/binfalse/YOURLS-FirefoxExtension/issues">bugs and feature requests</a>.)</small>
