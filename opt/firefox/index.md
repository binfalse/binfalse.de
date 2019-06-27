---
layout: page
title: Firefox

---

[Firefox](https://www.mozilla.org/en-US/firefox/) is a web browser, in [Debian](https://www.debian.org/)s world also known as [Iceweasel](https://en.wikipedia.org/wiki/Mozilla_software_rebranded_by_Debian)


## Installation

[Firefox](https://www.mozilla.org/en-US/firefox/)/[Iceweasel](https://en.wikipedia.org/wiki/Mozilla_software_rebranded_by_Debian) can be installed from the repository:

    aptitude install firefox-esr



## Configuration
The configuration of Firefox/Iceweasel can be accessed by browsing to  `about:config` . The following configuration reflect my preferences:

* Just store the **latest 20 closed tabs in history**: Set  `browser.sessionstore.max_tabs_undo`  to  `30` .
* Set the **delay before the save-button becomes active** to only 1ms: Set `security.dialog_enable_delay` to `1`.
* Configure default file name for print to PDF: Set `print.print_to_filename` to eg. `/tmp/mozilla.pdf`.
* Do not play standalone media (such as `.mp4` files) directly in the browser: Set `media.play-stand-alone` to `false`.
* Mute media (autoplay etc): Set
    * `media.block-autoplay-until-in-foreground` to `true`
    * `media.autoplay.enabled` to `false`
    * `dom.audiochannel.mutedByDefault` to `true`
    * `plugins.click_to_play` to `true`


## AddOns
Here is a list of Firefox extensions that I find useful:

* [Awesome RSS](https://addons.mozilla.org/en-US/firefox/addon/awesome-rss/) brings you an RSS icon to the URL bar if the page provides a feed.
* [Cookiebro](https://addons.mozilla.org/en-US/firefox/addon/cookiebro/) provides a cookie whitelist.
* [Empty Cache Button](https://addons.mozilla.org/en-US/firefox/addon/empty-cache-button/) helps you to clean the cache.
* [Download Star](https://addons.mozilla.org/en-US/firefox/addon/download-star/) to download all items in a webpage that match a pattern.
* [FoxyProxy Standard](https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard/) manages proxys including URL patterns.
* [Ghostery](https://addons.mozilla.org/en-US/firefox/addon/ghostery/) to block ads, stop trackers and speed up websites.
* [Open Tab Count](https://addons.mozilla.org/en-US/firefox/addon/open-tab-count-resurrected/) shows you the number of open tabs.
* [Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/) lets you keep parts of your online life separated.
* [Neat URL](https://addons.mozilla.org/en-US/firefox/addon/neat-url/) gets rid of URL parameter trash.
* [Referer Control](https://addons.mozilla.org/en-US/firefox/addon/referercontrol/) to block/rewrite referrers.
* [uMatrix](https://addons.mozilla.org/en-US/firefox/addon/umatrix/) sohpisticated filter to block/allow requests to remote content.
* [User-Agent Switcher](https://addons.mozilla.org/en-US/firefox/addon/uaswitcher/) lets you spoof the user agent.
* [YOURLS shortener](https://addons.mozilla.org/en-US/firefox/addon/yourls-shortener/) shorten URLs with your own YOURLS instance.




