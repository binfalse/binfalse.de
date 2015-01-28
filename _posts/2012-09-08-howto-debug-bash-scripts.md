---
layout: post
title: 'HowTo Debug Bash Scripts'
tags:
  - Bash
  - debug
  - explained
  - Programming
categories:
  - HowTo
  - Shell
  - Software

---

Even shell scripts may get very complex, so it is helpful to know how to debug them.

Lets explain it on a small example:



{% highlight bash %}
#/bin/bash

echo lets go

# some comment
DIR=/boot
/bin/ls -l $DIR | /bin/grep initrd  | wc -l

echo done
{% endhighlight %}



Executing it you'll get an output like this:



{% highlight bash %}
usr@srv /tmp % bash test.sh
lets go
112
done
{% endhighlight %}



To debug the execution of scripts the bash provides a debugging mode. There is one option  `-x`  to trace the execution



{% highlight bash %}
usr@srv /tmp % bash -x test.sh
+ echo lets go
lets go
+ DIR=/boot
+ wc -l
+ /bin/grep initrd
+ /bin/ls -l /boot
112
+ echo done
done
{% endhighlight %}



So you see, every line that is executed at the runtime will be printed with a leading  `+` , comments are ignored. There is another option  `-v`  to enable verbose mode. In this mode each line that is read by the bash will be printed before it is executed:



{% highlight bash %}
usr@srv /tmp % bash -v test.sh
#/bin/bash

echo lets go
lets go

# some comment
DIR=/boot
/bin/ls -l $DIR | /bin/grep initrd  | wc -l
112

echo done
done
{% endhighlight %}



Of course you can combine both modes, so the script is sequentially printed and the commands are traced:



{% highlight bash %}
usr@srv /tmp % bash -vx test.sh
#/bin/bash

echo lets go
+ echo lets go
lets go

# some comment
DIR=/boot
+ DIR=/boot
/bin/ls -l $DIR | /bin/grep initrd  | wc -l
+ /bin/ls -l /boot
+ wc -l
+ /bin/grep initrd
112

echo done
+ echo done
done
{% endhighlight %}



These modes will help you to find some errors.
To modify the output of the tracing mode you may configure the  `PS4` :



{% highlight bash %}
export 'PS4=+${BASH_SOURCE}:${LINENO}:${FUNCNAME[0]}: '
{% endhighlight %}



This will also print the file name of the executing script, the line number of the current command that is executed and the respective function name:



{% highlight bash %}
usr@srv /tmp % export 'PS4=+${BASH_SOURCE}:${LINENO}:${FUNCNAME[0]}: '
usr@srv /tmp % bash -x test.sh
+test.sh:3:: echo lets go
lets go
+test.sh:6:: DIR=/boot
+test.sh:7:: /bin/ls -l /boot
+test.sh:7:: /bin/grep initrd
+test.sh:7:: wc -l
112
+test.sh:9:: echo done
done
{% endhighlight %}




if You don't want to trace a whole script you can enable/disable tracing from within a script:



{% highlight bash %}
# [...]
echo no tracing
set -x
echo trace me
set +x
echo no tracing
# [...]
{% endhighlight %}



This will result in something like:



{% highlight bash %}
usr@srv /tmp % bash test.sh
[...]
no tracing
+test.sh:14:: echo trace me
trace me
+test.sh:15:: set +x
no tracing
[...]
{% endhighlight %}



It is of course also possible to enable/disable verbose mode inside the script with  `set -v`  and  `set +v` , respectively.
