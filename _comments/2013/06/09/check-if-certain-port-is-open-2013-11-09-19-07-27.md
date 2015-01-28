---
name: rocky
link: ''
date: '2013-11-09 19:07:27'
comment: "Two alternatives come to mind. First use  `telnet`  with a port number. For example (using values in your example):\n\n\n\n{% highlight bash %}\ntelnet 1.2.3.4 1337\n{% endhighlight %}\n\n\n\nYou'll have to know how to close the connection if there is a \"Connected\" message.\n\nSecond use  `nmap`  which is something sysadmins should get very familiar with. Here: \n\n\n\n{% highlight bash %}\nnmap 1.2.3.4 -p 1337\n{% endhighlight %}\n\n"
post_id: /2013/06/09/check-if-certain-port-is-open

---


