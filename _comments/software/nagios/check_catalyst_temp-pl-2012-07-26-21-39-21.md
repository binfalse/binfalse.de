---
date: '2012-07-26 21:39:21'
link: ''
name: kvolaa
post_id: /software/nagios/check_catalyst_temp-pl
---

On C2960G-48 this OIDs don't exist.
You can use  `CISCO-STACK-MIB::chassisTempAlarm.0` , which return  `off(1)`  in normal state and  `on(2)`  when overheating ( `OID 1.3.6.1.4.1.9.5.1.2.13.0` ). 
The same is about fan,  `CISCO-STACK-MIB::chassisFanStatus.0`  return  `ok(2)`  in normal state ( `OID 1.3.6.1.4.1.9.5.1.2.9.0` ).
In IOS, you got:


{% highlight bash %}
Switch5#show env all
FAN is OK
TEMPERATURE is OK

POWER is OK
RPS is NOT PRESENT
{% endhighlight %}


but:


{% highlight bash %}
Switch5#show env temperature status
Temperature Value: Not Supported
Temperature State: Not Supported
{% endhighlight %}

