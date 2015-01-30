---
layout: post
title: 'Pre- and Post-suspend'
tags:
  - DBus
  - explained
  - Jabber
  - Network
  - Notebook
  - trick
  - userinteraction
categories:
  - Media
  - Network
  - Web

---

Today I got another complaint in a row of complaints of my Jabber contacts, arguing that they can't send me messages although my account seems to be online in their buddy list. That happens when I put my notebook to sleep, this time I got informed by <a href="http://0rpheus.net/">Micha</a>.

Here are 3 steps to patch this problem, dealing with gajim-remote, PowerManagement-Utils and DBus.


This annoying events happens when I was online with my notebook and close the lid so the notebook goes sleeping. Unfortunately my <a href="http://www.jabber.org/">Jabber</a> client <a href="http://www.gajim.org/">Gajim</a> doesn't notice that I'm going to disconnect and so the Jabber server isn't informed about my absence. Due to connection instabilities the server waits some time of inactivity until it recognizes that there is really no more client before it tells all my friends I'm gone.
During  this time I appear online but messages are not able to reach my client, so they are lost in hell. That sucks, I know, and now I've reacted.

First of all I checked how to tell Gajim to disconnect via command line and found the tool  `gajim-remote` , it comes with Gajim itself. Here are some examples of using it:



{% highlight bash %}
# disconnect
gajim-remote change_status offline
# reconnect setting status message to "meetunix is sexy"
gajim-remote change_status online "meetunix is sexy"
# learn what can be done!?
gajim-remote -h
{% endhighlight %}



Of course the manpage will give you more information.

Ok, so far, next task is to understand what is done when the lid is closed. The task to suspend or hilbernate is, at least in my case, done by  `pm-utils`  (PowerManagement-Utils). It comes with some tools like  `pm-suspend`  or  `pm-hibernate`  and so on. To tell these tools to do something before respectively after suspending there is a directory in  `/etc/pm/sleep.d` . Here You can leave some script that look like those in  `/etc/init.d/*` .
Here is a smart example now located in  `/etc/pm/sleep.d/01users`  on my notebook, you can use it as skeleton:



{% highlight bash %}
#!/bin/bash
# check which users are logged in
USERS=$(/usr/bin/finger | /bin/grep ':0'| /bin/grep -o '^\\w*'| /usr/bin/uniq)
prepare_sleep ()
{
        for user in $USERS
        do
                uhome=$(/bin/su $user -c 'echo $HOME')
                [ -x $uhome/.suspend ] && /bin/su $user -c $uhome/.suspend
        done
}
revive ()
{
        for user in $USERS
        do
                uhome=$(/bin/su $user -c 'echo $HOME')
                [ -x $uhome/.awake ] && /bin/su $user -c $uhome/.awake
        done
}
case "$1" in
        hibernate|suspend|suspend_hybrid)
                prepare_sleep
                ;;
        thaw|resume)
                revive
                ;;
        *) exit 1
                ;;
esac
exit 0
{% endhighlight %}



Make it executable and give it a try. It checks for each logged-in user whether there is a  `.suspend`  or  `.awake`  in its  `$HOME`  to execute it before suspending respectively after resuming.

Next step is telling Gajim to change its status. Unfortunately the  `gajim-remote`  script is speaking to the running Gajim-instance via <a href="http://www.freedesktop.org/wiki/Software/dbus">DBus</a>. You may have heard about DBus, there are two main options of DBus buses: system- and session-bus. To speak to Gajim you use the session DBus and need the bus address. That is a problem, this address is acquired while your X-login, and you don't know it from a remote session or if the system executes scripts while suspending. So if you just try to execute  `gajim-remote change_status offline`  in your  `.suspend`  you'll get an error like  `D-Bus is not present on this machine or python module is missing`  or  `Failed to open connection to "session" message bus` .
Your DBus session address within an X-session is set in your environment in  `$DBUS_SESSION_BUS_ADDRESS`  ( `echo $DBUS_SESSION_BUS_ADDRESS` ).
So what are your options to get this address for your  `.suspend`  script?

* You can export your  `env`  to a file when you login (maybe automatically via  `.xinitrc` ) to parse it
* All addresses are saved in  `$HOME/.dbus/session-bus/` , so try to find the right one..
* Get it from a process environment

The last possibility is of course the nicest one. So check if Gajim is running and extract the  `DBUS_SESSION_BUS_ADDRESS`  from  `/proc/GAJIM_PID/environ` ! Here is how it can be done:



{% highlight bash %}
#!/bin/bash

gajim_logout ()
{
    # is gajim-remote present
    [ -x /usr/bin/gajim-remote ] || return 1

    # is gajim running
    gajim_pid=$(/bin/ps -f --user $(whoami) | /bin/grep [g]ajim.py | /usr/bin/awk '{print $2}')
    [ -f /proc/$gajim_pid/environ ] || return 1

    # get the dbus address
    DBUS_SESSION_BUS_ADDRESS=$(/bin/cat /proc/$gajim_pid/environ | /bin/grep -z DBUS_SESSION_BUS_ADDRESS | /bin/sed 's/^[^=]*=//')
    [ -n $DBUS_SESSION_BUS_ADDRESS ] || return 1
    export DBUS_SESSION_BUS_ADDRESS

    # now gajim is ready to go offline ;-)
    /usr/bin/gajim-remote change_status offline >> /dev/null
}

gajim_logout

exit 0
{% endhighlight %}



That's it, great work! Save this file in  `$HOME/.suspend`  and give it the right for execution. You can also write a similar script for  `$HOME/.awake`  to reconnect to your Jabber server, but you eventually don't want to reconnect each time you open the lid..

So the next time I close my laptops lid Gajim disconnects immediately! No annoyed friends anymore :P
