---
layout: post
title: 'SSH authentication via public key'
tags:
  - network
  - security
  - ssh
  - trick
categories:
  - network
  - security
  - software

---

<small>This is a translation of <a href="http://esmz-designz.com/index.php?site=blog&entry=36&title=SSHZugang_mit_Keys_absichern">my German entry.</a></small>

SSH is a secure way to connect to a remote system, for administration or working. The communication between these two workstations is encrypted, so an enemy isn't able to listen to the transferred data.



Although the password that is sent to access the other system is encrypted it's possible to guess it via brute force. To decrease this risk one can turn off password authentication and just allow the authentication via keys, so that the access is only possible to people that have specific private keys. It is much harder to guess such a private key than guessing a password.

To create such a key pair, containing private and public key, just type  `ssh-keygen -t rsa -b 4096`  in your terminal. This command will create an RSA-key width 4096 bits (the more bits the harder to guess the key). The output may look like this:



```
Generating public/private rsa key pair.
Enter file in which to save the key (/home/user/.ssh/id_rsa):
Created directory '/home/user/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/user/.ssh/id_rsa.
Your public key has been saved in /home/user/.ssh/id_rsa.pub.
The key fingerprint is:
16:59:cb:9f:55:b1:39:ee:b3:72:14:19:13:5c:60:4d user@abakus
The key's randomart image is:
+--[ RSA 4096]----+
| . +*E|
| + . . =+|
| o o .++|
| . . o.o.|
| S o ..|
| . .. |
| .o |
| . .o|
| o. |
+-----------------+
```



Congratulations, your are now owner of a 4096 bit SSH-key! It is not necessary to assign a passphrase, so you can connect to the server without any password. But if anyone can get access to your private key he is also able to connect to any server that knows your public key! So it is very insecure. For more options see  `man ssh-keygen` .

If you now take a look in your  `$HOME/.ssh/`  directory you'll find two keys, a public key named  `id_rsa.pub`  and a private key  `id_rsa` . This private key is just for you, don't send it to anyone!

To publish the public key, you can use the  `ssh-copy-id`  tool:



{% highlight bash %}
user@abakus ~ $ ssh-copy-id user@192.168.0.111
The authenticity of host '192.168.0.111 (192.168.0.111)' can't be established.
RSA key fingerprint is 34:cd:e7:95:48:75:d4:16:86:84:19:f0:b4:d3:2c:ad.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.0.111' (RSA) to the list of known hosts.
user@192.168.0.111's password:
Now try logging into the machine, with "ssh 'user@192.168.0.111'", and check in:

.ssh/authorized_keys

to make sure we haven't added extra keys that you weren't expecting.
{% endhighlight %}



All that it does is appending the contents of your public key to the  `$HOME/.ssh/authorized_keys`  file of the user on the remote system. So if you don't have this tool, you can do it by hand.
At the next login I don't have to provide the password to the remote account, I need only the passphrase for the private key:



{% highlight bash %}
user@abakus ~ $ ssh user@192.168.0.111
Enter passphrase for key '/home/user/.ssh/id_rsa':
Linux siduxbox 2.6.30-4.slh.1-sidux-amd64 #1 SMP PREEMPT Sun Aug 2 09:58:18 UTC 2009 x86_64
Last login: Wed Aug 19 12:12:18 2009 from 192.168.0.55
user@siduxbox ~ $
{% endhighlight %}



If you didn't supply a passphrase for the key you'll never get asked for one.

Last but not least we can disable the password authentication with the following settings in  `/etc/ssh/sshd_config` :



{% highlight bash %}
PasswordAuthentication no
UsePAM no
{% endhighlight %}



From now on only people that have private keys compatible to those public keys written in  `$HOME/.ssh/authorized_keys`  on the server can access it.
