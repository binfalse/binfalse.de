---
layout: post
title: 'encfs: transparent crypto overlay'
tags:
  - cloud
  - crypt
  - debian
  - explained
  - media
  - pam
  - security
  - share
  - sync
categories:
  - linuxunix
  - media
  - network
  - security
  - software
  - unix
  - web

---

 `encfs`  is a cryptographic file system (<a href="http://www.arg0.net/encfs">encfs-website</a>). The principle is very easy, you <em>"bind-mount"</em> one directory (containing the crypt stuff) to another directory (where it's unencrypted). Thus, you can share the encrypted stuff and nobody but you can read your data. So this system is excellent applicable for cloud services like Dropbox, which trap you with some space in the cloud "<a href="http://lifehacker.com/5697167/if-youre-not-paying-for-it-youre-the-product">for</a> <a href="http://geekandpoke.typepad.com/.a/6a00d8341d3df553ef0147e0e1aec2970b-pi">free</a>", but want you to share your private data with them. In some <em>&lt;p&gt;</em>'s we'll see how to setup  `encfs`  for Dropbox, but let's first take a look at  `encfs`  itself.



<h2>encfs</h2>
First of all you have to <strong>install encfs</strong>. Assuming you're sitting in front of a Debian-based os:



{% highlight bash %}
root@abakus ~ # aptitude install encfs
{% endhighlight %}



Since  `encfs`  is <a href="http://fuse.sourceforge.net/">fuse</a>-based the user who wants to use  `encfs`  has to be member of the group  `fuse` . You may use the  `groups`  command to make sure you belong to  `fuse` :



{% highlight bash %}
martin@abakus ~ % groups
martin mail fuse
{% endhighlight %}



If you're not yet member of that group edit the  `/etc/group`  file or use the  `useradd`  command (<a href="https://help.ubuntu.com/community/AddUsersHowto">howto</a>). To apply the changes you need to re-login or use  `newgrp`  (<a href="http://www.linuxcommand.org/man_pages/newgrp1.html">man newgrp</a>).

That's it, now the way to use encfs is parved. Let's say we want to work with our data in  `/dir/clear` , while the whole stuff is stored encrypted in  `/dir/crypt` . It's <strong>quite simple to setup</strong> this environment, just call  `encfs [crypt-dir] [decrypt-dir]`  :



{% highlight bash %}
martin@abakus ~ % encfs /dir/crypt /dir/clear
Creating new encrypted volume.
Please choose from one of the following options:
 enter "x" for expert configuration mode,
 enter "p" for pre-configured paranoia mode,
 anything else, or an empty line will select standard mode.
?>
{% endhighlight %}



Give it a  `p`  and choose a password. This command will install an encrypted container in  `/dir/crypt`  and immediately mount it to  `/dir/clear` . Feel free to create some files in  `/dir/clear`  (you're new working directory) and compare this directory with  `/dir/crypt` . You'll see that you are not able to understand the files in  `/dir/crypt` , unless you're a genius or the setup failed. Thus, it's no issue if anyone might have access to the content in  `/dir/crypt` .

To <strong>unmount</strong> the clear data use  `fusermount -u /dir/clear` . To <strong>remount</strong> it just call again  `encfs /dir/crypt /dir/clear` , it will just ask you for the password to decrypt the data.

Of course it's not very convenient to mount the directory every time manually, hence there is a workaround to <strong>automount</strong> your  `encfs`  directories on login. You need to install  `libpam-mount`  and  `libpam-encfs` :



{% highlight bash %}
root@abakus ~ # aptitude install libpam-mount libpam-encfs
{% endhighlight %}



To automatically mount an  `encfs`  on login the password for the crypt-fs has to be the same as the password for your user account! If that's the case, add a line like the following to  `/etc/security/pam_mount.conf.xml` :



{% highlight xml %}
<pam_mount>
    [...]
    <volume user="martin" fstype="fuse" path="encfs#/dir/crypt" mountpoint="/dir/clear" />
    [...]
</pam_mount>
{% endhighlight %}



On your next login this directory will automatically be mounted. Very smart!

<a name="encfscloud"></a>
<h2>Using encfs for the cloud</h2>
Ok, let's get to the main reason for this article, winking towards Norway ;) . 
As you might have heard, there are some <a href="http://en.wikipedia.org/wiki/Comparison_of_file_hosting_services">file hosting services</a> out there, like <a href="http://en.wikipedia.org/wiki/Dropbox_(service)">Dropbox</a> or <a href="http://en.wikipedia.org/wiki/Ubuntu_One">Ubuntu One</a>. They provide some space in the cloud which can be mounted to different devices, so that your data is sync'ed between your systems.
Unfortunately, most of these services want to read your data. E.g. the Dropbox system wants to store a file used by multiple users only once. Even if they pretend to assure that nobody's able to read your private data, you all know that this is <del datetime="2013-01-16T02:24:59+00:00">bullshit</del> nearly impossible! However, I strongly recommend to not push critical/private files to these kind of providers.

But, thada, you've just learned how to sync your files using the cloud while keeping them private! Let's assume the directory  `/home/martin/Dropbox`  is monitored by Dropbox, you just need to create two more directories, like  `/home/martin/Dropbox/private`  (for encrypted files to be sync'ed) and  `/home/martin/Dropbox-decrypt`  (for decryption). Mount  `/home/martin/Dropbox/private`  to  `/home/martin/Dropbox-decrypt`  using  `encfs`  and work in  `/home/martin/Dropbox-decrypt` . As explained above, feel free to setup an automount using pam ;-)
Everything in  `/home/martin/Dropbox`  but not in the  `private`  directory will be sync'ed unencrypted, so you won't loose the opportunity to share some open data with [whoever] e.g. via web browser.

Of course, this method comes with some drawbacks:
<ul>
	<li>It is a bit more work to setup every client, before you can start working with your private data (fortunately the overhead is kept in reasonable limits)</li>
	<li>You cannot access these files through the web browser, or using your mobile phone (unless your phone comes with encfs-support)</li>
</ul>

All in all, you need to decide on your own, how much you trust Dropbox (and alike) and which kind of data you commit to Dropbox unencrypted.
