---
layout: page
title: check_passwd_exp.pl


---

Perl script to check if an LDAP account is about to expire.

It searches an LDAP tree for accounts and evaluates their `PWDLASTSET` value (if the `ACCOUNTEXPIRES` is not `0`, which would mean that the account does not expire).

The maximum age of a password is typically determined by your organisation (typically something like 1 or 3 years). You can set the max using the `--max-age` flag.

The warning and critical thresholds can be configured in seconds using `--warning` (default: `30*24*60*60` = 30 days) and `--critical` (default: `5*24*60*60` = 5 days).



<a href='/assets/resources/stuff/monitoring/check_reboot.sh'>Here is the code</a>.

Please consider to take a look at my [general setup notes](/software/nagios/plugin-setup-notes/).
