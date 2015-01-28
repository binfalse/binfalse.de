---
layout: post
title: 'LDAP commands'
categories:
  - Junk

---

Most of you should have [in kontakt gekommen] mit LDAP yet, so you should have learned that it's really powerful and not soo easy to administrate. Here is a collection of often used commands, to long to keep them in mind.


Which clients are connecting to your LDAP-Server? (given slapd log in  `/var/log/slapd.log` )


{% highlight bash %}
grep "ACCEPT from" /var/log/slapd.log | sed 's/^.*ACCEPT from IP=\\([^:]*\\).*$/\\1/g' | sort | uniq
{% endhighlight %}


to get the appropriate DNS:


{% highlight bash %}
for i in `grep "ACCEPT from" /var/log/slapd.log | sed 's/^.*ACCEPT from IP=\\([^:]*\\).*$/\\1/g' | sort | uniq`; do echo $i; nslookup $i | grep name; done
{% endhighlight %}





Search for a specific user entry:


{% highlight bash %}
ldapsearch -LLL -s sub -b 'BASE' -x -w 'PASSWORD' -D 'USER_ID' -H 'ldaps://SERVER:636' 'uid=USER'
{% endhighlight %}


Its possible to search for parts of a user name, for example  `'uid=*umpe*'`  will also find  `uid=Rumpel` . If you don't know the UID, you might search for the gecos field with  `'gecos=*umpe*'` , and if you are only interested in the loginShell of people with the name Rennecke try something like this:



{% highlight bash %}
$ ldapsearch -LLL -s sub -b 'BASE' -x -w 'PASSWORD' -D 'USER_ID' -H 'ldaps://SERVER:636' 'sn=rennecke' loginShell

dn: uid=XXX,ou=YYY
loginShell: /bin/bash
{% endhighlight %}




Add an <em>ldif</em> to your DB:


{% highlight bash %}
slapadd -n DBNUM -l LDIF.ldif
{% endhighlight %}



Dump the whole DB to a <em>ldif</em>:


{% highlight bash %}
slapcat -n DBNUM -l DUMP.ldif
{% endhighlight %}



Restore a dump:


{% highlight bash %}
cat DUMP.ldif | slapadd -n DBNUM
{% endhighlight %}



<h1>References</h1>
<dl>
 <dt><a name='SHORT'>[SHORT]</a></dt>
 	<dd>WHO
 		<em>TITLE</em>
 		WHERE
		LINK
	</dd>
 <dt><a name=''>[]</a></dt>
 	<dd>
		<em></em>
		
		
 	</dd>
</dl>

<div class="download"><strong>Download:</strong>

<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
