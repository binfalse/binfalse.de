---
title: "Monitoring of XOS devices"
layout: post
published: true
date: 2016-02-05 22:38:30 +0100
categories:
  - network
  - administration
  - monitoring
tags:
  - job
  - network
  - monitoring
  - icinga
  - nagios
  - programming
---

{% include image.html align="alignright" url="/assets/media/pics/2016/no-move-pc.png" img="/assets/media/pics/2016/no-move-pc.png" title="Monitor Relocation of Hardware" caption="Monitor Relocation of Hardware" maxwidth="200px" %}

This week I developed some plugins for Nagios/Icinga to monitor network devices of the vendor [**<span style="color:#472E8D">Extreme Networks</span>**](http://www.extremenetworks.com/). All these plugins receive status information of, eg. switches, via SNMP.

## The Basic: Check Mem, CPU, and Fans

Checking for [available memory](/software/nagios/check_extreme_mem-pl/), for the [device's temperature](/software/nagios/check_extreme_temp-pl/), for the [power supplies](/software/nagios/check_extreme_powersupply-pl/), and for [fan states](/software/nagios/check_extreme_fans-pl/) is quite straight forward. You just ask the switch for the values of a few OIDs, evaluate the answer, and tell Nagios/Icinga what to do.

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
I implemented a script to also monitor the FDB.
FDB is and abbreviation for forwarding databases: The switch maintains a forwarding database (FDB) of all MAC addresses received on all of its ports. It, for example, uses the information in this database to decide whether a frame should be forwarded or filtered. Each entry consists of

* the MAC address of the device behind the port
* the associated VLAN
* the age of the entry -- depending on the configuration the entries age out of the table
* some flags -- e.g. is the entry dynamic or static
* the port

The table may look like the following:

~~~~~~bash
> show fdb
Mac                     Vlan       Age  Flags         Port / Virtual Port List
------------------------------------------------------------------------------
01:23:45:67:89:ab    worknet(0060) 0056 n m           9
01:23:42:67:89:ab     mobnet(0040) 0001 n m           21

Flags : d - Dynamic, s - Static, p - Permanent, n - NetLogin, m - MAC, i - IP,
        x - IPX, l - lockdown MAC, L - lockdown-timeout MAC, M- Mirror, B - Egress Blackhole,
        b - Ingress Blackhole, v - MAC-Based VLAN, P - Private VLAN, T - VLAN translation,
        D - drop packet, h - Hardware Aging, o - IEEE 802.1ah Backbone MAC,
        S - Software Controlled Deletion, r - MSRP
~~~~~~

As soon as the switch gets a frame on one port it learns the corresponding MAC address, port number, etc. into this table. So if a frame for this MAC address arrives it know where to send it to.

However, that content of a networking class.
All we need to know is that a switch can tell you <s>which device</s> which MAC address is is connected to which port.
And that's the idea of [`check_extreme_fdb.pl`](/software/nagios/check_extreme_fdb-pl/)! It compares the entries of the FDB with some expected entries in an CSV file. The CSV is supposed to contain three coloumns:

~~~~~~bash
mac,port,vlan
~~~~~~

If a MAC address in the FDB matches the MAC address in the CSV file it checks the ports and vlans.
If those do not match, it will raise an error.

For the CSV: Feel free to leave port or vlan empty if you do not care about this detail.
That means, if you just want to make sure that the device with the MAC `01:23:45:67:89:ab` is in vlan `worknet` you add an entry such as:

~~~~~~bash
01:23:45:67:89:ab,,worknet
~~~~~~

Use `-e <FILE>` to pass the CSV file containing expected entry to the program and call it like beckham:

~~~~~~bash
perl -w check_extreme_fdb.pl -s <SWITCH> -C <COMMUNITY-STRING> -e <EXPECTED>
~~~~~~

Here, `SWITCH` being the switch's address and `COMMUNITY-STRING` beeing the SNMP "passphrase". You may also want to add `-w` to raise a warning if one of the entries in the CSV file wasn't found in the FDB. To create a sample CSV file that matches the current FDB you can call it with `--print`.

To get the script have a look at [the `check_extreme_fdb.pl` software page](/software/nagios/check_extreme_fdb-pl/).


## More Extreme Stuff

In addition there are some other scripts to monitor [**<span style="color:#472E8D">Extreme Networks</span>**](http://www.extremenetworks.com/) devices:

* [check_extreme_fans.pl](/software/nagios/check_extreme_fans-pl/)
* [check_extreme_fdb.pl](/software/nagios/check_extreme_fdb-pl/)
* [check_extreme_mem.pl](/software/nagios/check_extreme_mem-pl/)
* [check_extreme_powersupply.pl](/software/nagios/check_extreme_powersupply-pl/)
* [check_extreme_temp.pl](/software/nagios/check_extreme_temp-pl/)
