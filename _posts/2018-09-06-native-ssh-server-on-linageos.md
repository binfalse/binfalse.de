---
title: "Native SSH server on LinageOS"
layout: post
published: true
date: 2018-09-06 13:41:26 +0200
categories:
  - network
  - software
  - security
  - administration
  - private
  - operatingsystem
  - howto
  - phone
  - cyanogen
  - lineageos
tags:
  - android
  - backup
  - config
  - cyanogen
  - lineageos
  - network
  - phone
  - private
  - remote
  - ssh
  - trick
---

I finally trashed my shitty [Shift5.2](https://www.shiftphones.com/) and got a spare [OnePlus One](https://www.oneplus.com/de/one) from a good colleague.

tldr: scroll down to *Setup of SSH on LineageOS*.

**I strongly discourage everyone from buying a ShiftPhone.**
The Phone was/is on [Android](https://www.android.com/) patch level from 2017-03-05 -- which is one and a half year ago!
Not to mention that it was running an Android 5.1.1 in 2018...
With soo many bugs and security issues, in my opinion this phone is a danger to the community!
And nobody at Shift seemed to really care...

However, I now have a OnePlus One, which is supported by [LineageOS](https://lineageos.org/) - the successor of [CyanogenMod](https://en.wikipedia.org/wiki/CyanogenMod).
So, first action was installing LineageOS.
Immediately followed by installing [SU](https://download.lineageos.org/extras) to get root access.

Next, I'd like to have [SSH](https://en.wikipedia.org/wiki/Secure_Shell) access to the phone.
I did love the native SSH server on my [Galaxy S2](https://en.wikipedia.org/wiki/Samsung_Galaxy_S_II), which used to run CyanogenMod for 5+ years.
Using the SSH access I was able to integrate it in my backup infrastructure and it was much easier to quickly copy stuff from the phone w/o a cable :)

The original webpage including a how-to for installing SSH on CyanogenMod has unfortunately vanished.
There is a [copy available from the WayBackMachine](https://web.archive.org/web/20160909004028/https://wiki.cyanogenmod.org/w/Doc:_sshd) ([thanks a lot guys!!](https://archive.org/donate/)).
I still thought dumping an up-to-date step-wise instruction here may be a good idea :)


## Setup of SSH on LineageOS

The setup of the native SSH server on LineageOS seems to be pretty similiar to the CyanogenMod version.
First you need a shell on the phone, e.g. through adb, and become root (su).
Then just follow the following three steps:

### Create SSH daemon configuration

You do not need to create a configuration file from scratch, you can use `/system/etc/ssh/sshd_config` as a template.
Just copy the configuration file to `/data/ssh/sshd_config`;

{% highlight bash %}
cp /system/etc/ssh/sshd_config /data/ssh/sshd_config
{% endhighlight %}

Just make sure you set the following things:
* `PermitRootLogin without-password`
* `PubkeyAuthentication yes`
* `PermitEmptyPasswords no`
* `ChallengeResponseAuthentication no`
* `Subsystem sftp internal-sftp`

### Setup SSH keys

We'll be using SSH-keys to authenticate to the phone.
If you don't know what SSH keys are, or how to create them, you may go to [an article that I wrote in 2009](/2009/08/19/ssh-authentication-via-public-key/) (!!) or use an [online search engine](https://duckduckgo.com/?q=generate+ssh+keys).

First, we need to create `/data/.ssh` on the phone (note the `.`!) and give it to the `shell` user:

{% highlight bash %}
mkdir -p /data/.ssh
chmod 700 /data/.ssh
chown shell:shell /data/.ssh
{% endhighlight %}

Second, we need to store our public SSH key (probably stored in `~/.ssh/id_rsa.pub` on your local machine) in `/data/.ssh/authorized_keys` on the phone.
If that file exists, just append your public key into a new line.
Afterwards, handover the `authorized_keys` file to the shell user:

{% highlight bash %}
chmod 600 /data/.ssh/authorized_keys
chown shell:shell /data/.ssh/authorized_keys
{% endhighlight %}


### Create a start script

Last but not least, we need a script to start the SSH service.
There is again a template available in `/system/bin/start-ssh`.
Just copy the script to `/data/local/userinit.d/`:

{% highlight bash %}
mkdir /data/local/userinit.d/
cp /system/bin/start-ssh /data/local/userinit.d/99sshd
chmod 755 /data/local/userinit.d/99sshd
{% endhighlight %}

Finally, we just need to update the location of the `sshd_config` to `/data/ssh/sshd_config` in our newly created `/data/local/userinit.d/99sshd` script (there are 2 occurences).


## That's it

You can now run `/data/local/userinit.d/99sshd` and the SSH server should be up and running :)

Earlier versions of Android/CyanogenMod auto-started the scripts stored in `/data/local/userinit.d/` right after the boot, but this feature was removed with CM12..
Thus, at the moment it is not that easy to automatically start the SSH server with a reboot of your phone.
But having the SSH daemon running all the time may also be a bad idea, in terms of security and battery...

