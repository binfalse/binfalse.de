---
layout: post
title: 'Suspend and Resume Aircrack sessions'
tags:
  - network
  - trick
categories:
  - network
  - software

---

The [aircrack](http://www.aircrack-ng.org/) tool unfortunately does not have a suspend or pause mechanism, thus as soon as you stop it you need to start again from the very beginning. Of course, you may manually adjust the dictionary, but that's tedious and "error prone".. ;-)

Lucky us, there is [john the ripper](http://www.openwall.com/john/) to give us a hand. John knows about sessions. Just start a run which prints the words in the dictionary one after the other:

    john --session=somename --stdout --wordlist=dictionary

Stop the run at any point in time using e.g. `Ctrl+c` and john will store the information about the session. Just return the session with `--restore`:

    john --restore=somename

and john will continue from where it was stopped.

To make aircrack read the words from stdin use `-w -`. A typical run might look like

    # start john
    john --session=somename --stdout --wordlist=dictionary | aircrack-ng -w - handshake.cap -b 01:12:23:34:45:56
    # kill the run
    ^C
    # restart from where is was stopped
    john --restore=somename | aircrack-ng -w - handshake.cap -b 01:12:23:34:45:56
