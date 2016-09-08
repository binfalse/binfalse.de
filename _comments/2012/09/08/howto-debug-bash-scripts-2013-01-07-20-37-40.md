---
date: '2013-01-07 20:37:40'
link: http://deranfangvomende.wordpress.com
name: Florian Heigl
post_id: /2012/09/08/howto-debug-bash-scripts
---

Hi,

there's two more things I love in debugging scripts:

set -n "parse it but don't run it" (thats what I call as the first test of a new script)
So, I very very often use this.
The next one I only use rarely outside of debugging:
set -e "exit on the first error" This can be interesting to catch errors that happen early in a script. Ideally, you handled all expected error scenarios and then set -e is catching on some more unexpected ones.
Very naive people think it to be error handling if they put set -e in the start of a script, they are wrong ;)
For debugging it's definitely great.
What other purposes? Very critical scripts that are better dead than doing anything unexpected AND also able to clean up their last run.

Give it a test next time :&gt;
And thanks for the wordpress Nagios check.
Bye