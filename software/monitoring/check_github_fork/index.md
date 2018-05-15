---
layout: page
title:  check_github_fork

---

Shell script to check if a forked project on GitHub is up-to-date with it's origin.

It will grab the project's website and check if it's *ahead* or *behind* something else.
All you need to provide is the URL to the project page on GitHub.
You can also just check for *ahead* xor *behind* using `--only-ahead` and `--only-behind`, respectively.

If your project is not up-to-date, the script will emit a warning.
If you instead want a critical notification you can call it with `--critical`.


Download the tool at [ccheck_github_fork](/assets/resources/stuff/monitoring/check_github_fork/check_github_fork) (or see [GitHub](https://github.com/binfalse/check_github_fork))

Please consider to take a look at my [general monitoring setup notes](/software/nagios/plugin-setup-notes/).
