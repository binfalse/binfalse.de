---
layout: post
title: 'Getting into a new group'
categories:
  - 
tags:
  - 
---

You know, ... you just got this new floppy disk with very important material but you cannot access it because you're not in the system's `floppy` group and, thus, you're not allowed to access the floppy device. Solution is easy: add your current user to the `floppy` group! Sounds easy, doesn't it? The annoying thing is that those changes won't take affect in the current session. You need to log out and log in again -- quite annoying, especially if you're into something with lots of windows and stuff. Just happened to me with docker again..

However, there are two methods to get into the new groups without the need to kill the current session:

* **su yourself:** let's say your username is `myname` you just need to `su myname` to get a prompt with the new group memberships.
* **ssh localhost:** that also gives you a new session with updated *affiliations*.

That way, you do not need to start a new session. However, you still need to start all applications/tools from that terminal - might be odd to those who are used to the gnome/kde menues.. :)

## Supplemental material

Display group membership:

     groups USERNAME

Add a new system group:

     groupadd GROUPNAME

Add a user to a group:

     useradd -G GROUPNAME USERNAME

