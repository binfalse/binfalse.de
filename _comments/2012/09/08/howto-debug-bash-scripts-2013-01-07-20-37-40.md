---
name: 'Florian Heigl'
link: 'http://deranfangvomende.wordpress.com'
date: '2013-01-07 20:37:40'
comment: "Hi,\n\nthere's two more things I love in debugging scripts:\n\nset -n \"parse it but don't run it\" (thats what I call as the first test of a new script)\nSo, I very very often use this.\nThe next one I only use rarely outside of debugging:\nset -e \"exit on the first error\" This can be interesting to catch errors that happen early in a script. Ideally, you handled all expected error scenarios and then set -e is catching on some more unexpected ones.\nVery naive people think it to be error handling if they put set -e in the start of a script, they are wrong ;)\nFor debugging it's definitely great.\nWhat other purposes? Very critical scripts that are better dead than doing anything unexpected AND also able to clean up their last run.\n\nGive it a test next time :&gt;\nAnd thanks for the wordpress Nagios check.\nBye"
post_id: /2012/09/08/howto-debug-bash-scripts

---


