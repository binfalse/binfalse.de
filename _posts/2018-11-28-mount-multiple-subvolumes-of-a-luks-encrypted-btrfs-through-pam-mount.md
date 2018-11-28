---
title: "Mount multiple subvolumes of a LUKS encrypted BTRFS through pam_mount"
layout: post
published: true
date: 2018-11-28 10:40:24 +0100
categories:
  - administration
  - hardware
  - software
  - linuxunix
  - operatingsystem
  - howto
  - debian
  - university
  - security
tags:
  - btrfs
  - ssd
  - mastodon
  - pam
  - crypt
  - auth
  - config
  - debian
  - explained
  - security
  - university
---

Some days ago, [@daftaupe@mamot.fr](https://mamot.fr/@daftaupe) convinced me on [Mastodon](https://en.wikipedia.org/wiki/Mastodon_(software)) to give [BTRFS](https://btrfs.wiki.kernel.org/index.php/Main%5FPage) a try.
That's actually been a feature on my list for some time already, and now that I need to switch PCs at work I'm going for it.
However, this post wouldn't exist if everything went straight forward.. ;-)


## The Scenario

I have a 1[TB](https://en.wikipedia.org/wiki/Terabyte) [SSD](https://en.wikipedia.org/wiki/Solid-state_drive) that I want to encrypt.
It should automatically get decrypted and mounted to certain places when I log in.
[pam_mount](https://wiki.archlinux.org/index.php/Pam_mount) can do that for you, and I've already been using that a lot in different scenarios.
However, with BTRFS it's a bit different.
With any other file systems you would create a partition on the hard drive, which is then [LUKS](https://en.wikipedia.org/wiki/Linux_Unified_Key_Setup) encrypted.
This has the drawback, that you need to decide on the partition's size beforehand!

With BTRFS you can just encrypt the whole drive and use so-called [subvolumes](https://btrfs.wiki.kernel.org/index.php/SysadminGuide#Subvolumes) on top of it.
Thus, you're a bit more flexible by creating and adjusting quotas as required at any point in time (if at all...), but (or and!) the subvolumes are not visible unless the device is decrypted.


Let's have a look into that and create the scenario.
I assume that the SSD is available as `/dev/sdb`.
Then we can create an encrypted container using LUKS:

{% highlight bash %}
root@srv ~ # cryptsetup -y -v --cipher aes-xts-plain64 --key-size 256 --hash sha256 luksFormat /dev/sdb

WARNING!
========
This will overwrite data on /dev/sdb irrevocably.

Are you sure? (Type uppercase yes): YES
Enter passphrase for /dev/sdb: ****
Verify passphrase: ****
Key slot 0 created.
Command successful.
{% endhighlight %}

You're not sure which *cipher* or *key-size* to choose?
Just run `cryptsetup benchmark` to see which settings perform best for you.
My CPU, for example, comes with hardware support for [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), thus the AES ciphers show a significantly higher throughput.
If you're still feeling uncompfortable with that step, I recommend reading the sophisticated article at the 
[ArchLinux' wiki on dm-crypt/Device encryption](https://wiki.archlinux.org/index.php/dm-crypt/Device_encryption).

We can now open the encrypted device using

{% highlight bash %}
root@srv ~ # cryptsetup luksOpen /dev/sdb mydrive
Enter passphrase for /dev/sdb: ****
{% endhighlight %}

This will create a node in `/dev/mapper/mydrive`, which represents the decrypted device.



Next, we'll create a BTRFS on that device:

{% highlight bash %}
root@srv ~ # mkfs.btrfs /dev/mapper/mydrive
btrfs-progs v4.17
See http://btrfs.wiki.kernel.org for more information.

Detected a SSD, turning off metadata duplication.  Mkfs with -m dup if you want to force metadata duplication.
Label:              home
UUID:               d1e1e1f9-7273-4b29-ae43-4b9ca411c2ba
Node size:          16384
Sector size:        4096
Filesystem size:    931.51GiB
Block group profiles:
Data:             single            8.00MiB
Metadata:         single            8.00MiB
System:           single            4.00MiB
SSD detected:       yes
Incompat features:  extref, skinny-metadata
Number of devices:  1
Devices:
ID        SIZE  PATH
1   931.51GiB  /dev/mapper/mydrive
{% endhighlight %}

That's indeed super fast, isn't it!?
I also couldn't believe it.. ;-)


We can now mount the device, for example to `/mnt/mountain`:


{% highlight bash %}
root@srv ~ # mount /dev/mapper/mydrive /mnt/mountain
root@srv ~ # cd /mnt/mountain
{% endhighlight %}


So far, the file system is completely empty.
But as it's a BTRFS, we can create some subvolumes.
Let's say, we want to create a volume for our `$HOME`, and as we're developing this website, we also want to create a volume called `www`:

{% highlight bash %}
root@srv /mnt/mountain # btrfs subvolume create home
Create subvolume './home'

root@srv /mnt/mountain # btrfs subvolume create www
Create subvolume './www'

root@srv /mnt/mountain # btrfs subvolume list .
ID 258 gen 21 top level 5 path home
ID 259 gen 22 top level 5 path www
{% endhighlight %}


So we have two subvolumes in that file system: `home` (id `258`) and `www` (id `259`).
We could now mount them with

{% highlight bash %}
root@srv ~ # mount -o subvol=/home /dev/mapper/mydrive  /home/user
root@srv ~ # mount -o subvol=/www  /dev/mapper/mydrive  /var/www
{% endhighlight %}

But we want the system to do it automatically for us, as we login.

So unmount everything and close the LUKS container:


{% highlight bash %}
root@srv ~ # umount /mnt/mountain /home/user /var/www
root@srv ~ # cryptsetup luksClose mydrive
{% endhighlight %}




## PamMount can Decrypt and Mount Automatically

I'm using `pam_mount` already for ages! It is super convenient.
To get your home automatically decrypted and mounted, you would just need to add the following lines to your `/etc/security/pam_mount.conf.xml`:


{% highlight xml %}
<volume path="/dev/disk/by-uuid/a1b20e2f-049c-4e5f-89be-2fc0fa3dd564" user="YOU"
        mountpoint="/home/user" options="defaults,noatime,compress,subvol=/home" />

<volume path="/dev/disk/by-uuid/a1b20e2f-049c-4e5f-89be-2fc0fa3dd564" user="YOU"
        mountpoint="/var/www" options="defaults,noatime,compress,subvol=/www" />
{% endhighlight %}

Given this, [PAM](https://en.wikipedia.org/wiki/Pluggable_authentication_module) tries to mount the respective subvolumes of the disk (identified by the [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) `a1b20e2f-049c-...`) to `/home/user` and `/var/www` as soon as `YOU` logs in.

Here, I am using UUIDs to identify the disks.
You can still use `/dev/sdb` (or similar), but there is a chance, that the disks are recognised in a different sequence with the next boot (and `/dev/sdb` may become `/dev/sdc` or something...).
Plus, the UUID is invariant to the system -- you can put the disk in any other machine and it will have the same UUID.

To find the UUID of your disk you can use [blkid](https://linux.die.net/man/8/blkid):

{% highlight bash %}
root@srv ~ # blkid
[...]
/dev/sdb: UUID="a1b20e2f-049c-4e5f-89be-2fc0fa3dd564" TYPE="crypto_LUKS"
[...]
{% endhighlight %}





## The Problem

As said above, with BTRFS you'll have your *partitions* (called subvolumes) right in the filesystem -- invisible unless decrypted.
So, what is PAM doing?
It discovers the first entry in the `pam_mount.conf.xml` configuration, which basically says

> *mount `a1b20e2f-049c-...` with some extra options to `/home/user` when `YOU` logs in*

PAM is also smart enough to understand that `a1b20e2f-049c-...` is a LUKS encrypted device and it decrypts it using your login password.
This will then create a node in `/dev/mapper/_dev_sdb`, representing the decrypted device.
And eventually, PAM mounts `/dev/mapper/_dev_sdb` to `/home/user`.
So far so perfect.


But as soon as PAM discovers the second entry, it tries to do the same!
Again it detects a LUKS device and tries to decrypt that.
But unfortunately, there is already `/dev/mapper/_dev_sdb`!?
Thus, opening the LUKS drive fails and you'll find something like that in your `/var/log/auth.log`:

{% highlight bash %}
(mount.c:72): Messages from underlying mount program:
(mount.c:76): crypt_activate_by_passphrase: File exists
(pam_mount.c:522): mount of /dev/disk/by-uuid/a1b20e2f-049c-... failed
{% endhighlight %}

First it seems annoying that it doesn't work out of the box, but at least it sounds reasonable that PAM cannot do what you what it to do..





## The Solution

... is quite easy, even though it took me a while to figure things out...

As soon as the first subvolume is mounted (and the device is decrypted and available through `/dev/mapper/_dev_sdb`), we have direct access to the file system!
Thus, we do not neet to tell PAM to mount `/dev/disk/by-uuid/a1b20e2f-049c-...`, but we can use `/dev/mapper/_dev_sdb`.
Or even better, we can use the file system's UUID now, to become invariant to the `sdb`-variable.
If you run `blkid` with the device being decrypted you'll find an entry like this:


{% highlight bash %}
root@srv ~ # blkid
[...]
/dev/sdb: UUID="a1b20e2f-049c-..." TYPE="crypto_LUKS"
/dev/mapper/_dev_sdb: UUID="d1e1e1f9-7273-..." UUID_SUB="..." TYPE="btrfs"
[...]
{% endhighlight %}


You see, the new node `/dev/mapper/_dev_sdb` also carries a UUID, actually representing the BTRFS :)  
This UUID was by the way also reported by the `mkfs.btrfs` call above.

What does that mean for our setup?
When we first need a subvolume of an encrypted drive we need to use the UUID of the parent LUKS container.
For every subsequent subvolume we can use the UUID of the internal FS.

Transferred to the above scenario, we'd create a `/etc/security/pam_mount.conf.xml` like that:


{% highlight xml %}
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE pam_mount SYSTEM "pam_mount.conf.xml.dtd">
<pam_mount>

  <volume path="/dev/disk/by-uuid/a1b20e2f-049c-4e5f-89be-2fc0fa3dd564" user="YOU"
          mountpoint="/home/user" options="defaults,noatime,subvol=/home" />

  <volume path="/dev/disk/by-uuid/d1e1e1f9-7273-4b29-ae43-4b9ca411c2ba" user="YOU"
          mountpoint="/var/www" options="defaults,noatime,subvol=/www" />

  <mkmountpoint enable="1" remove="true" />

</pam_mount>
{% endhighlight %}


Note the different UUIDs? Even though both mounts origin from the same FS :)




## Open Problems


Actually, I wanted to have my home in a raid of two devices, but I don't know how to tell `pam_mount` to decrypt two devices to make BTRFS handle the raid..?
The only option seems to use [mdadm](https://en.wikipedia.org/wiki/Mdadm) to create the raid, but then BTRFS just sees a single device and, therefore, cannot do its [extra raid magic](https://wiki.archlinux.org/index.php/Btrfs#RAID)...

If anyone has an idea on that issue you'll have my ears :)


