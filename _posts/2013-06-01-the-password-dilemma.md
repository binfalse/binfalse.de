---
layout: post
title: 'The Password Dilemma'
tags:
  - analyzed
  - cloud
  - hacked
  - Private
  - Security
categories:
  - Junk
  - Security
  - Software
  - Web

---

Earlier this week I had a very small conversation with <a href="http://en.wikipedia.org/wiki/Pedro_Pedrosa_Mendes">Pedro Mendes</a> on twitter (well in terms of twitter it might be a long dicussion). It was initiated by him <a href="https://twitter.com/gepasi/status/339639093426274304">calling for suggestions for a password safe</a>. I suggested better using a system for your passwords, which he thought was a bad idea. So lets have a look at both solutions.


You all know about these rules for choosing a password. It should contain a mix of lower and upper case letters, numerals, special characters, and punctuation. Moreover, it should be at least eight characters long and has to be more or less random. Since our brain is limited in remembering such things we tend to use easy-to-remember password (e.g. replacing letters using <a href="http://en.wikipedia.org/wiki/Leet">leet</a>). But of course hackers are aware of that and it is quite easy to also encode such rules in their cracking algorithms. Equally bad is using one strong password for all accounts.
So, how to solve this problem?

<h2>Using a Password Safe</h2>
The first good idea is using very strong passwords for every account and writing them down, so you don't have to remember them. You probably often heard that writing passwords on a sheet of paper is a very stupid idea. And storing them in a document on your desktop is even worse. But there are lots of tools that help you with that problem, e.g. <a href="http://keepass.info/">KeePass</a> or <a href="http://www.keepassx.org/">KeePassX</a>, just to name two open source solutions.
You can organize your passwords and store them in an encrypted file. Thus, you just have to remember one single password to open this safe. These tools often include an excellent password generation functionality that helps you choosing passwords. <a href="http://www.name.com/blog/general/2013/05/we-got-hacked/">And</a> <a href="http://hackread.com/university-of-zurich-hacked-3200-officials-accounts-leaked-by-ag3nt47/">even</a> <a href="http://www.theregister.co.uk/2013/05/30/drupal_sites_hacked/">if</a> <a href="http://tvnz.co.nz/technology-news/daily-deal-site-hacked-millions-customers-affected-5419102">another</a> <a href="http://www.bbc.co.uk/news/technology-22594136">website</a> <a href="http://en.wikipedia.org/wiki/PlayStation_Network_outage">gets</a> <a href="http://en.wikipedia.org/wiki/2012_LinkedIn_hack">hacked</a>, you just need to open your safe and replace the password with a new one. Very convenient.

Unfortunately, this solution also comes with some drawbacks. Since you cannot remember a single password you always need to have this safe with you. I usually use five different machines, so you have to distribute this file (at least to have a backup). And of course you want to have it in sync, so you might want to store it in a cloud or something. But every copy of this safe increases the chance that an attacker gets access to it. Moreover, you cannot put a subsafe containing only passwords for trivial accounts (like twitter) on your mobile phone (which I also do not trust). So, there are many weak points to get access to the safe (e.g. a <a href="http://www.discourse.net/2011/04/dropbox-is-much-less-private-than-i-thought/">design fail of the cloud</a>, a <a href="http://www.wired.com/threatlevel/2011/06/dropbox/">bug in the cloud</a>, an evil system administrator having access to your PCs at work, a law enforcements etc.). And as soon as the attacker has access to this file he just has to crack one human rememberable password to see the whole collection of your passwords. Probably including login names and links to the web sites. Worst case scenario.

<h2>Using a Password System</h2>
The second idea is using a system to generate passwords for each account. You have to choose a very strong password $$p$$, and a function $$f$$ that creates a unique password $$u$$ for every account using $$p$$ and the (domain) name $$n$$ of the related service: $$u = f (p, n)$$.
You just need to remember this very good $$p$$ and $$f$$. Depending on your paranoia and your mind capabilities there are many options to choose $$f$$. An easy $$f_1$$ might just put the 3<sup>rd</sup> and last letters of $$n$$ at the 8<sup>th</sup> and 2<sup>nd</sup> pos in $$p$$ (see example below). More paranoid mathematicians might choose an $$f_2$$ that ASCII-adds the 3<sup>rd</sup> letter of $$n$$ to the 8<sup>th</sup> position of $$p$$, puts the $$\lfloor\sqrt{n} * 10\rceil/10$$ at the 2<sup>nd</sup> position in $$p$$, and appends the <a href="http://en.wikipedia.org/wiki/Base64">base64</a> representation of the <a href="http://en.wikipedia.org/wiki/Multiplicative_digital_root">multiplicative digital root</a> of the int values of the ASCII letters of $$n$$ to $$p$$. Here you can see the examples:

 $$p$$ | $$n$$ | $$f_1 (p, n)$$ | $$f_2 (p, n)$$
-|-|-|-
`u:M~a{em0` | `twitter` | `ur:M~a{eim0` | `u2.6:M~a{eW0Mi4yNDU2MjFlKzE0Cg==`
  `u:M~a{em0` | `google` | `ue:M~a{eom0` | `u2.4:M~a{e]0MS40MjU4MjNlKzEyCg==`


So, you see if the password for twitter gets known the hacker isn't able to log into your google account. To be honest, I guess that nobody will choose $$f_2$$, but I think even $$f_1$$ is quite good and leaves some space for simple improvements.

However, as expected this solution also has some dramatic disadvantages. If one of your passwords gets compromised you need to change your system, at least choosing a different $$p$$ and maybe also an alternative for $$f$$. As soon as a hacker is able to get two of these passwords he will immediately recognize the low entropy and it is not difficult to create a pattern for your passwords making it easy to guess all other passwords.

<h2>Conclusion</h2>
This is not to convince somebody to use one or the other solution, its more or less a comparison of the pros and cons. In my opinion the current password mechanism is sort of stupid, but we need to find the least bad solution until we have some alternatives. So what about creating a small two-factor auth system? You could combine the two above mentioned solutions and use a password safe in combination with a password system. So keep a short lock in mind which is necessary to unlock the passwords in the safe. Maybe something like <a href="http://www.urbandictionary.com/define.php?term=29A"> `29A` </a> which you have to add to every password (on some position of your choice, e.g. just append it). Thus, if a hacker breaks into one service only a singe password is compromised and you just need to update this entry in your safe, and if your whole safe is cracked all passwords are useless crap. Of course you have to create a new safe and update all your passwords, but the guy who knows your old "passwords" doesn't know how to use them.
However, we are discussing on a very high level. The mentioned scenarios are more or less just attacks against a particular person. I am a sysadmin, so I would already be very glad if users won't use passwords like  `mama123`  and stop sending passwords in clear-text mails!

<h2>Supp: The Conversation</h2>
just for the logs (in twitter chronology: new -> old):


> **Pedro Mendes** *@gepasi at 1:13 PM - 30 May 13*  
> @binfalse I agree, but using 30 character completely random ones seems to be the best.
>
> **martin scharm** *@binfalse at 5:40 PM - 29 May 13*  
> @gepasi either using a password safe (which also has drawbacks) or a system with a strong p and a complex f.
>
> **martin scharm** *@binfalse at 5:39 PM - 29 May 13*  
> @gepasi however, i support the attitude seeing every pw as compromised. so the most important rule is using unique pws for every service.
>
> **martin scharm** *@binfalse at 5:39 PM - 29 May 13*  
> @gepasi even after reading this article i'd say that ur:M~a{eim0 is quite strong and i'd expect to find it within the 10% uncracked.
>
> **Pedro Mendes** *@gepasi at 1:18 PM - 29 May 13*  
> @binfalse but thanks for the tip on KeePassX
>
> **Pedro Mendes** *@gepasi at 1:18 PM - 29 May 13*  
> @binfalse a system is not recommended. Anything a human can remember is broken within 24h. Read http://arstechnica.com/security/2013/05/how-crackers-make-minced-meat-out-of-your-passwords/
>
> **martin scharm** *@binfalse at 1:03 PM - 29 May 13*  
> @gepasi and even if someone breaks into twitter, your google passphrase ("ue:M~a{eom0") isn't compromised.
>
> **martin scharm** *@binfalse at 1:03 PM - 29 May 13*  
> @gepasi quite easy to remember (when you know p), very hard to guess and brute-forcing the related hash really takes some time.
>
> **martin scharm** *@binfalse at 1:03 PM - 29 May 13*  
> @gepasi e.g. p="u:M~a{em0" and n="twitter" would result in "ur:M~a{eim0" as a password for twitter.
>
> **martin scharm** *@binfalse at 1:02 PM - 29 May 13*  
> @gepasi you just need to remember p and f, which may put the 3rd and last letter of n at the 8th and 2nd pos in p.
>
> **martin scharm** *@binfalse at 1:02 PM - 29 May 13*  
> @gepasi choose a password p (as strong as possible) and a function f(p,n) that creates a unique password from p and a (domain) name n.
>
> **martin scharm** *@binfalse at 1:02 PM - 29 May 13*  
> @gepasi afaik KeePassX is a good one. but i recommend to use a system!
>
> **Pedro Mendes** *@gepasi at 9:07 AM - 29 May 13*  
> I need suggestions for a good password manager. Ideally only local storage (ie no cloud storage)
