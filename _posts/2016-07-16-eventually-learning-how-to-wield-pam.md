---
title: "Eventually learning how to wield PAM"
layout: post
published: true
date: 2016-07-16 20:56:42 +0200
categories:
  - uncategorized
tags:
  - untagged
---

PAM. The Pluggable Authentication Modules. I'm pretty sure you heard of it. It sits in its `/etc/pam.d/` and does a very good job. Reliable and performant, as my guts tend to tell me.

Unless... You want something specific! For me that always implied a lot of trial and error. Copying snippets from the browser and moving lines up and down and between different PAM config files. So far, I managed to conquer that combinatorial problem in less time than I would need to learn PAM - always with bad feeling because I don't know what I've been doing with the f*cking sensible auth system...

But this time PAM drives me nuts. I want to authenticate users via the default *nix passwd and an LDAP server -AND- pam_mount should mount something special for every LDAP user. The trial and error method gave me two versions of the config that works for one of the issues, but I'm unable to find a working config for both. So... Let's learning PAM.

## The PAM
On linux systems, PAM lives in `/etc/pam.d/`. There are several config files for differen purposes. You may change them and they will have effect immediately -- no need to restart something.

Every line in a config file containes three tokens:

* **the realm is** the first word in a line; it is either auth, account, password or session
* **he control** determines what PAM should do if the module either succeeds/fails
* **the module** the actual module that gets invoked; modules can be stacked

### Realms
There are four different realms:

* **auth:** checks that the user is who he claims to be; usually password base
* **account:** account verification functionality; checking group membership, time of day, whether a user account is local or remote
* **password:** needed for updating passwords for a given service; may involve e.g. dictionary checking
* **session:** stuff to setup or cleanup a service for a given user; e.g. launching system-wide init script or performing special logging


### Controls
In most cases the controls consist of a single keyword that tells PAM what to do if the corresponding module either succeeds or fails. You need to understand, that this just *controls* the PAM library, the actual module neither knows not cares about it. The four typical keywords are:

* **required:** if a 'required' module is not successful, the operation will ultimately fail. **BUT** only after the modules below are done! That is because an attacker shouldn't know which or when a module fails. So all modules will be invoked even if the first on fails, giving less information to the bad guys. Just note, that a single failure of a 'required' module will cause the whole thing to fail, even if everything else succeeds.
* **requisite:** similar to required, but the whole thing will fail immediately and the following modules won't be invoked.
* **sufficient:** a successful 'sufficient' module is enough to satisfy the requirements in that realm. That means, the following 'sufficient' won't be invoked! However, sufficient modules are only sufficient, that means (i) they may fail but the realm may still be satisfied by something else, and (ii) they may all succeed but the realm may fail because a required module failed.
* **optional:** optional modules may fail or not, PAM actually doesn't care. PAM only cares if there are only optional modules in a certain stack for realm. In that case at least one of them needs to succeed.





{% include image.html align='alignright' url='/assets/media/pics/2016/' img='/assets/media/pics/2016/' title='ALT' caption='CAPTION' maxwidth='300px' %}

{% highlight bash %}
some code
{% endhighlight %}

*italics*

**strong**

[link](url)


