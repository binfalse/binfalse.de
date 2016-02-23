---
title: "Monitoring of XOS devices"
layout: post
published: true
date: 2016-02-05 22:38:30 +0100
categories:
  - uncategorized
tags:
  - untagged
---

{% include image.html align="alignright" url="assets/media/pics/2016/no-move-pc.png" img="assets/media/pics/2016/no-move-pc.png" title="Monitor Relocation of Hardware" caption="Monitor Relocation of Hardware" maxwidth="200px" %}

This week I developed some plugins for Nagios/Icinga to monitor network devices of the vendor [**<span style="color:#472E8D">Extreme Networks</span>**](http://www.extremenetworks.com/). All these plugins receive status information of, eg. switches, via SNMP.

## The Basic: Check Mem, CPU, and Fans

Checking for free memory, for CPU load, and for fan states is quite straight forward. You just ask the switch for the values of a few OIDs, evaluate the answer, and tell Nagios/Icinga what to do.

The [Simple Network Management Protocol](https://en.wikipedia.org/wiki/Simple_Network_Management_Protocol) (SNMP) is actually a very easy to use protocol. There is an SNMP server, such as a router or a switch, which exposes management data through the SNMP protocol. To access these data you just send an [object identify](https://en.wikipedia.org/wiki/Object_identifier) (OID) to an SNMP server and receive the corresponding value. So called [management information bases](https://en.wikipedia.org/wiki/Management_information_base) (MIB) can tell you what a certain OID stands for.

On the command line, for example, you could use `snmpwalk` to iterate over an OID subtree to, e.g., obtain information about the memory on a device:

~~~~~~bash
usr@srv $ snmpwalk -v 2c -c publicCommunityString switch.address.com 1.3.6.1.4.1.1916.1.32.2.2.1
1.3.6.1.4.1.1916.1.32.2.2.1.1.1 = Gauge32: 1
1.3.6.1.4.1.1916.1.32.2.2.1.2.1 = STRING: "262144"
1.3.6.1.4.1.1916.1.32.2.2.1.3.1 = STRING: "116268"
1.3.6.1.4.1.1916.1.32.2.2.1.4.1 = STRING: "7504"
1.3.6.1.4.1.1916.1.32.2.2.1.5.1 = STRING: "138372"
~~~~~~

The OID `1.3.6.1.4.1.1916.1.32.2.2.1` addresses the memory information table of the SNMP provider at `switch.address.com`.
The value at `*.2.1` shows how much memory is installed, `*.3.1` shows how much memory is free, `*.4.1` shows how much is consumed by the system, and `*.5.1` shows how much is consumed by user processes. Basic calculations tell us there are `262144/1024 = 256KB` in total and `100*116268/262144 = 44.35%` is free.
A bit more logic for a warning/critical switch and the plugin is done.

## The Feature: Monitoring of the FDB

But I would probably not write about that basic stuff if there was not an extra feature!
