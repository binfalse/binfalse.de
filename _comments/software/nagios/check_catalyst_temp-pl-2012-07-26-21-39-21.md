---
name: kvolaa
link: ''
date: '2012-07-26 21:39:21'
comment: "On C2960G-48 this OIDs don't exist.\nYou can use  `CISCO-STACK-MIB::chassisTempAlarm.0` , which return  `off(1)`  in normal state and  `on(2)`  when overheating ( `OID 1.3.6.1.4.1.9.5.1.2.13.0` ). \nThe same is about fan,  `CISCO-STACK-MIB::chassisFanStatus.0`  return  `ok(2)`  in normal state ( `OID 1.3.6.1.4.1.9.5.1.2.9.0` ).\nIn IOS, you got:\n\n\n{% highlight bash %}\nSwitch5#show env all\nFAN is OK\nTEMPERATURE is OK\n\nPOWER is OK\nRPS is NOT PRESENT\n{% endhighlight %}\n\n\nbut:\n\n\n{% highlight bash %}\nSwitch5#show env temperature status\nTemperature Value: Not Supported\nTemperature State: Not Supported\n{% endhighlight %}\n\n"
post_id: /software/nagios/check_catalyst_temp-pl

---


