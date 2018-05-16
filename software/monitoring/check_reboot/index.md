---
layout: page
title: check_reboot.sh

---

Shell script to check if a reboot is required.

It basically just checks whether the file `/var/run/reboot-required` is present.
Should work on all Debian-based systems.

You may also want to have a look at [check_kernel](/software/monitoring/check_kernel-sh/), to verify that you're running the latest kernel (this plugin does not evaluate the kernel)..



Download the tool at [check_reboot.sh](/assets/resources/stuff/monitoring/check_reboot.sh) (or see [GitHub](https://github.com/binfalse/monitoring/blob/master/check_reboot.sh))

Please consider to take a look at my [general monitoring setup notes](/software/nagios/plugin-setup-notes/).
