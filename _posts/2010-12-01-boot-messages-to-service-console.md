---
layout: post
title: 'Boot messages to service console'
tags:
  - gnu
  - kernel
  - keyboard
  - network
  - university
  - userinteraction
categories:
  - network
  - software
  - university

---

You may have heard about management consoles!? If a server is dead you can revive it via service console without driving the long way to the data center (often miles away).


While logged into the service console you of course have the chance to reboot the machine itself. To get to know what it is doing while booting you may want to see all the messages that are usually prompted to the terminal at the attached monitor. Unfortunately you aren't next to the machine, and so there is no monitor attached to it, but you can force grub to prompt all messages both to terminal and to service console.

First of all you have to setup the serial console:



{% highlight bash %}
serial --unit=0 --speed=57600 --word=8 --parity=no --stop=1
{% endhighlight %}



The  `--unit`  parameter determines the COM port, here it's COM1, if you need COM2 you should use  `--unit=1` .  `--speed`  defines a baud rate of 57600 <acronym title="bits per second">bps</acronym>, see your manual. To learn more about the other parameter you are referred to the <a href="http://www.gnu.org/software/grub/manual/grub.html#serial">Grub manual for serial</a>.
Next you have to tell Grub where to write the output:



{% highlight bash %}
terminal --timeout=5 console serial
{% endhighlight %}



This line tells grub that there are two devices, the typical console on the attached screen and our previous defined serial console. With this directive Grub waits 5 seconds for any input from serial console or the attached keyboard and will print <em>its menu</em> to that device where the input was generated. That means if you're at home and press any key, Grub will show you all outputs to your serial connection, but your student assistant (who had to go to the server, by bike while raining!!) isn't able to see whats happening. But if your assistance is faster than you and hits a key on the physically attached keyboard, he'll see anything and you'll look through a black window...
If nobody produces any input the output is written to that device that is listed <strong>first</strong>.

Last but not least you have to modify the kernel sections of the boot menu and append something like that at the end of every kernel line:



{% highlight bash %}
console=tty0 console=ttyS0
{% endhighlight %}



That tells grub that <em>all kernel messages</em> should be printed to both the real console of the attached screen and the serial console. Keep in mind to modify  `ttyS0`  to match your serial port (here it is COM1).
Grub decides for the device that is listed last to also send <em>all stdin/stdout/stderr of the init process</em>, that means <strong>only the last</strong> device will act as interactive terminal. E.g. checks of  `fsck`  are only printed to the last device, so stay calm if nothing happen for a long time on the other one ;-)

Here is a valid example for copy and paste:



{% highlight bash %}
# init serial console
serial --unit=0 --speed=57600 --word=8 --parity=no --stop=1
# what device to use for grub menu!?
terminal --timeout=5 console serial
# ....
title           Debian GNU/Linux, LOCAL CONSOLE
root            (hd0,0)
kernel          /vmlinuz-SOMEWHAT-openvz-amd64 root=UUID=AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE ro console=ttyS0 console=tty0
initrd          /initrd.img-SOMEWHAT-openvz-amd64

title           Debian GNU/Linux, LOCAL CONSOLE
root            (hd0,0)
kernel          /vmlinuz-SOMEWHAT-openvz-amd64 root=UUID=AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE ro console=tty0 console=ttyS0
initrd          /initrd.img-SOMEWHAT-openvz-amd64
{% endhighlight %}



Here both Grub entries are booting the same kernel, but the first one will use the local console as interactive terminal whether the other entry takes the serial console for interactions.
