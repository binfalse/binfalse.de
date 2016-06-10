---
title: "Auto-Update Debian based systems"
layout: post
published: true
date: 2016-06-05 21:23:13 +0200
categories:
  - security
  - software
  - administration
  - debian
  - operatingsystem
tags:
  - aptitude
  - debian
  - job
  - security
  - simplification
  - ubuntu
---

{% include image.html align='alignright' url='/assets/media/pics/2016/automatic-os-update.svg' img='/assets/media/pics/2016/automatic-os-update.png' title='Updating System: automatically fixing security issues and installing latest features' caption='SysUpdate in Progress' maxwidth='300px' %}

Updating your OS is obviously super-important. But it's also quite annoying and tedious, especially if you're in charge of a number of systems. In about 99% it's a monkey's job, as it just involves variations of

{% highlight bash %}
aptitude update
aptitude upgrade
{% endhighlight %}

Usually, nothing interesting happens, you just need to wait for the command to finish.

## The Problem
The potential consequences in the 1% cases lets us usually swallow the bitter pill and play the monkey. The Problem is, that in some cases there is a an update that involves a modification of some configuration file that contains some adjustments of you. Let's say you configured a daemon to listen at a specific port of your server, but in the new version they changed the syntax of the config file. That can hardly be automatised. Leaving the old version of the config will break the software, deploying the new version will dispose your settings. Thus, human interaction is required...

At least I do not dare to think about a solution on how to automatise that. But we could ...



## Detect the 1% and Automatise the 99%
What do we need do to prevent the configuration conflict?
We need to find out which software will be updated and see if we modified one of the configuration files:

### Update the package list
Updating your systems package list can be considered safe:

{% highlight bash %}
aptitude update
{% endhighlight %}

The command downloads a list of available packages from the repositories and compares it with the list of packages installed on your system. Based on that, your update-systems knows which packages can be upgraded.


### Find out which software will be updated.
The list of upgradeable packages can be obtained by doing a dry-run. The `--simulate` flag shows us what will be done without touching the system, `-y` answers every question with *yes* without human interaction, and `-v` gives us a parsable list. For example, from a random system:

{% highlight bash %}
root@srv » aptitude --simulate -y -v safe-upgrade
The following packages will be upgraded:
  ndiff nmap
2 packages upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
Need to get 4,230 kB of archives. After unpacking 256 kB will be used.
Inst nmap [6.47-3+b1] (6.47-3+deb8u2 Debian:8.5/stable [amd64])
Inst ndiff [6.47-3] (6.47-3+deb8u2 Debian:8.5/stable [all])
Conf nmap (6.47-3+deb8u2 Debian:8.5/stable [amd64])
Conf ndiff (6.47-3+deb8u2 Debian:8.5/stable [all])
{% endhighlight %}

That tells us, the new versions of the tools `nmap` and `ndiff` will be installed. Capturing that is simple, we basically just need to [grep](https://en.wikipedia.org/wiki/Grep) for `'^Inst'`.


### Check if we modified corresponding configuration files
To get the configuration files of a specific package we can ask the [dpkg subsystem](https://en.wikipedia.org/wiki/Dpkg), for example for a dhcp client:

{% highlight bash %}
dpkg-query --showformat='${Conffiles}\n' --show isc-dhcp-client
 /etc/dhcp/debug 521717b5f9e08db15893d3d062c59aeb
 /etc/dhcp/dhclient-exit-hooks.d/rfc3442-classless-routes 95e21c32fa7f603db75f1dc33db53cf5
 /etc/dhcp/dhclient.conf 649563ef7a61912664a400a5263958a6
{% endhighlight %}

Every non-empty line contains a configuration file's name and the corresponding md5 sum of the contents as delivered by the repository. That means, we just need to `md5sum` all the files on our system and compare the hashes to see if we modified the file:

{% highlight bash %}
# for every non-empty line
dpkg-query --showformat='${Conffiles}\n' --show $pkg | grep -v "^$" |
# do the following
while read -r conffile
do
  file=$(echo $conffile | awk '{print $1}')
  # the hash of the original content
  exphash=$(echo $conffile | awk '{print $2}')
  # the hash of the content on our system
  seenhash=$(md5sum $file | awk '{print $1}')
  # do thy match?
  if [ "$exphash" != "$seenhash" ]
  then
    # STOP THE UPGRADE
    # AND NOTIFY THE ADMIN
    # TO MANUALLY UPGRADE THE OS
  fi
done
{% endhighlight %}

Now we should have everything we need to compile it into a script that we can give to cron :)

## The safe-upgrade script
I developed a [tiny tool that can be downloaded from GitHub.](https://github.com/binfalse/deb-safeautoupgrade). It consists of two files:

* `/etc/cron.daily/safeupdatescript.sh` is the actual acript that does the update and safe-upgrade of the system.
* `/etc/default/deb-safeupgrade` can be used to overwrite the settings (hostname, mail address of the admin, etc) for a system. If it exists, the other script will `source` it.

In addition, there is a Debian package available from my apt-repository. Just install it with:

{% highlight bash %}
aptitude install bf-safeupgrade
{% endhighlight %}

and let me know if there are any issues.


## Disclaimer

The mentioned figure `99%` is just a guess and may vary. It strongly depends on your operating system, version, and the software installed ;-)


## References
* [Everything you need to know about conffiles: configuration files managed by dpkg](https://raphaelhertzog.com/2010/09/21/debian-conffile-configuration-file-managed-by-dpkg/) by [Raphaël Hertzog](https://raphaelhertzog.com/author/rhertzog/)
* An [Apt Update Script](http://www.mattiaswikstrom.net/linux/20050526-apt-update-script.html) by [Mattias Wikström](http://www.mattiaswikstrom.net/)
* [Keeping unstable machines up to date easily](https://debian-administration.org/article/43/Keeping_unstable_machines_up_to_date_easily) by [Steve Kemp](https://www.steve.org.uk/)
* [A short introduction to cron-apt](https://debian-administration.org/article/162/A_short_introduction_to_cron-apt) by [Joe Topjian](https://debian-administration.org/users/joe)


