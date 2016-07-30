---
title: "Eventually learning how to wield PAM"
layout: post
published: true
date: 2016-07-16 20:56:42 +0200
categories:
  - security
  - administration
  - linuxunix
  - operatingsystem
  - howto
tags:
  - auth
  - debian
  - explained
  - config
  - security
  - university
---

PAM. The *Pluggable Authentication Modules.* I'm pretty sure you heard of it. It sits in its `/etc/pam.d/` and does a very good job. Reliable and performant, as my guts tend to tell me.

Unless... You want something specific! In my case that always implied a lot of trial and error. Copying snippets from the internet and moving lines up and down and between different PAM config files. So far, I managed to conquer that combinatorial problem in less time than I would need to learn PAM - always with bad feeling because I don't know what I've been doing with the f*cking sensible auth system...

But this time PAM drives me nuts. I want to authenticate users via the default *nix passwd as well as using an LDAP server -AND- `pam_mount` should mount something special for every LDAP user. The trial and error method gave me two versions of the config that works for one of the tasks, but I'm unable to find a working config for both. So... Let's learn PAM.


## The PAM
On linux systems, PAM lives in `/etc/pam.d/`. There are several config files for differen purposes. You may change them and they will have effect immediately -- no need to restart anything.

PAM allows for what they call "stacking" of modules: Every configuration file defines a stack of modules that are relevant for the authentication for an application. 
Every line in a config file containes three tokens:

* **the realm is** the first word in a line; it is either auth, account, password or session
* **he control** determines what PAM should do if the module either succeeds/fails
* **the module** the actual module that gets invoked and optionally some module parameters


### Realms
There are four different realms:

* **auth:** checks that the user is who he claims to be; usually password base
* **account:** account verification functionality; for example checking group membership, account expiration, time of day if a user only has part-time access, and whether a user account is local or remote
* **password:** needed for updating passwords for a given service; may involve e.g. dictionary checking
* **session:** stuff to setup or cleanup a service for a given user; e.g. launching system-wide init script, performing special logging, or configuring [SSO](https://en.wikipedia.org/wiki/Single_sign-on)


### Controls
In most cases the controls consist of a single keyword that tells PAM what to do if the corresponding module either succeeds or fails. You need to understand, that this just *controls the PAM library*, the actual module neither knows not cares about it. The four typical keywords are:

* **required:** if a 'required' module is not successful, the operation will ultimately fail. **BUT** only after the modules below are done! That is because an attacker shouldn't know which or when a module fails. So all modules will be invoked even if the first on fails, giving less information to the bad guys. Just note, that a single failure of a 'required' module will cause the whole thing to fail, even if everything else succeeds.
* **requisite:** similar to required, but the whole thing will fail immediately and the following modules won't be invoked.
* **sufficient:** a successful 'sufficient' module is enough to satisfy the requirements in that realm. That means, the following 'sufficient' won't be invoked! However, sufficient modules are only sufficient, that means (i) they may fail but the realm may still be satisfied by something else, and (ii) they may all succeed but the realm may fail because a required module failed.
* **optional:** optional modules are non-critical, they may succeed or fail, PAM actually doesn't care. PAM only cares if there are exclusively optional modules in a particular stack. In that case at least one of them needs to succeed.


### Modules
The last token of every line lists the path to the module that will be invoked. You may point to the module using an absolute path starting with `/` or a path relative from PAMs search directories. The search path depends on the system your working on, e.g. for Debian it is `/lib/security/` or `/lib64/security/`. You may also pass arguments to the module, common arguments include for example `use_first_pass` which provides the password of an earlier module in the stack, so the users doesn't need to enter their password again (e.g. useful when mounting an encrypted device that uses the same password as the user account).

There are dozens of modules available, every module supporting different options. Let me just forward you to a [PAM modules overview at linux-pam.org.](http://www.linux-pam.org/Linux-PAM-html/sag-module-reference.html) and an [O’Reilly article on useful PAM modules](http://www.linuxdevcenter.com/pub/a/linux/2001/10/05/PamModules.html?page=1).


## That's it

Yeah, reading and writing about it helped me fixing my problem. This article is probably just one within a hundred, so if it didn't help you I'd like to send you to one of the following. Try reading them, if that doesn't help write a blog post about it ;-)

## Further Resources

* [Centos documents on PAM](https://www.centos.org/docs/5/html/Deployment_Guide-en-US/ch-pam.html), including writing of PAM modules
* [The Linux-PAM Guides](http://www.linux-pam.org/Linux-PAM-html/)
* [O’Reilly's  Introduction to PAM](http://www.linuxdevcenter.com/pub/a/linux/2001/09/27/pamintro.html)
* [The Linux-PAM System Administrators' Guide](http://uw714doc.sco.com/en/SEC_pam/pam.html#toc3)
