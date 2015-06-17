---
layout: post
title: 'Kile menu bar hides entries'
categories:
  - software
  - tex
tags:
  - LaTeX
  - bug
  - fix
  - kde
---

{% include image.html align="alignright" url="/assets/media/pics/2015/kile-expected.png" img="/assets/media/pics/2015/kile-expected.png" title="Figure 1: Kile -- the menu as expected" caption="Figure 1: Kile -- the menu as expected" maxwidth="300px" %}
[Kile](https://www.kde.org/applications/office/kile/), KDE's Integrated LaTeX Environment, has a weird bug: Every time I update something in the UI it recreates its config file and I loose some menu options, such as *Settings -> Configure Kile* where you used to configure your preferences..

In Figure 1 you can see the menu as expected. There are some entries to *Configure Kile*, t0 *Configure Toolbars*, to *Configure Shortcuts* and to switch to *Full Screen Mode*, etc. However, as soon as I update certain things in the user interface (UI), eg. if I add a new action icon to the toolbar to quickly get the `\textbf{}` environment for bold fonts, these entries get lost. In those cases Kile won't be configureable anymore. The resulting toolbar is shown in Figure 2. You see, the number of entries significantly decreased..

{% include image.html align="alignright" url="/assets/media/pics/2015/kile-unexpected.png" img="/assets/media/pics/2015/kile-unexpected.png" title="Figure 2: Kile -- the unexpected menu" caption="Figure 2: Kile -- the unexpected menu" maxwidth="300px" %}

However, I just discovered the reason: Kile in these cases rewrites its config in an unexpected manner...
If you have a look at the configuration stored in `~/.kde/share/apps/kile/kileui.rc` you'll find an XML subtree such as:

{% highlight xml %}
...
<Menu noMerge="1" name="settings">
	<text>&amp;Settings</text>
	<Action name="Mode"/>
	<Separator/>
	<Action name="settings_perform_check"/>
	<Separator/>
	<Action append="show_merge" name="StructureView"/>
	<Action append="show_merge" name="MessageView"/>
</Menu>
...
{% endhighlight %}

No idea where it comes from, but the `1` in `noMerge` prevents the default menu entries to be merged into the minimal set of entries defined in that snippet. However, now that we know what's wrong we can easily fix it! Just replace the `1` with a `0` and restart Kile. You might want to do the same for all other menus to discover that you've also been missing some entries in the *Help* menu ;-)
