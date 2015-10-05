---
layout: post
title: 'Hacking Shibboleth'
tags:
  - explained
  - hacked
  - network
  - security
  - ugly
  - university
  - userinteraction
categories:
  - network
  - security
  - software
  - university

---

Today I attended a workshop on <a href="http://shibboleth.internet2.edu/">Shibboleth</a>, organized by the <a href="https://www.aai.dfn.de/">AAI team</a> of the <a href="https://www.dfn.de/">DFN</a>. There are several problems I'll explain in this posting.


<h2>What the hell is Shibboleth!?</h2>
<h3>Basics</h3>
Shibboleth is a system to provide a single sign-on (<abbr title="single sign-on">SSO</abbr>) solution for different services. It is split into two modules, the Identity Provider (<abbr title="Identity Provider">IdP</abbr>), that knows the authentication stuff by an Identity Management (<abbr title="Identity Management">IdM</abbr>) (e.g. a database like LDAP), and the Service Provider (<abbr title="Service Provider">SP</abbr>), that has (generally) no knowledge about accounts of the users that make use of its services. One example may be a university (school, company etc.) as <abbr title="Identity Provider">IdP</abbr>, that provides accounts of its students and staff members, and a scientific journal (mail provider, library, e-learning platform etc.) as <abbr title="Service Provider">SP</abbr>, that will offer copies to students. So the journal has to verify that the requesting user is a student or a staff. The actual system is either based on user authentication on each <abbr title="Service Provider">SP</abbr> or on IP restrictions (e.g. only user from  `141.48.x.x`  are allowed to download), so the users have to manage a lot of different accounts for any service or otherwise the <abbr title="Service Provider">SP</abbr>'s have to maintain IP black- or whitelists. Of course this is an unsatisfying behavior.
Here comes Shibboleth! It provides the communication between the <abbr title="Identity Provider">IdP</abbr>'s and <abbr title="Service Provider">SP</abbr>'s, so a single user just has to have only one account at its <abbr title="Identity Provider">IdP</abbr> and is able to use all services of the <abbr title="Service Provider">SP</abbr>'s that have arrangements with the users <abbr title="Identity Provider">IdP</abbr>.

{% include image.html align="alignright" url="/wp-content/uploads/2010/10/shibboleth.png" img="/wp-content/uploads/2010/10/shibboleth-150x150.png" title="" caption="" %}

<h3>Working principle</h3>
I don't want to go into detail. Just for notice, it is based on XML messages via web, can be implemented via JAVA/C++/PHP, verification goes by certificates, a lot of restrictions...
However, figure 1 illustrates the working principle. First the user requests a service of a <abbr title="Service Provider">SP</abbr> (1), there are two possibilities:
<ol>
<li>There is no active session on the <abbr title="Service Provider">SP</abbr>, so the user is linked to a Discovery Service (<abbr title="Discovery Service">DS</abbr>) (2).
<ul>
<li>This <abbr title="Discovery Service">DS</abbr> lets the user choose its <abbr title="Identity Provider">IdP</abbr> in a pool of known <abbr title="Identity Provider">IdP</abbr>'s (3). The DC may be implemented by this <abbr title="Service Provider">SP</abbr> or it is provided by someone like the DFN.</li>
<li>The user chooses one of the <abbr title="Identity Provider">IdP</abbr>'s and is linked to the website of this <abbr title="Identity Provider">IdP</abbr> (4) to authenticate itself (5).</li>
<li>The <abbr title="Identity Provider">IdP</abbr> decides whether it is a valid user or not (authentication by form, session based recognition or something like that), so again two possibilities (6):
<ol>
<li>If it is a valid user, the <abbr title="Identity Provider">IdP</abbr> sends some user related stuff to the <abbr title="Service Provider">SP</abbr>, so the <abbr title="Service Provider">SP</abbr> knows it is a valid user.</li>
<li>Otherwise the <abbr title="Identity Provider">IdP</abbr> informs the <abbr title="Service Provider">SP</abbr> that the authentication has failed.</li>
</ol>
</li>
</ul>
</li>
<li>If there is an active session (7), the <abbr title="Service Provider">SP</abbr> already knows whether the user is allowed to request anything...</li>
</ol>

<h2>Problems</h2>
I'm not the person to evaluate that code, didn't yet saw any, but I see some other problems not concerned to code exploits.
<h3>Centralizing <abbr title="Identity Management">IdM</abbr></h3>
The first problem isn't that critical, but the current situation is that each <abbr title="Service Provider">SP</abbr> (library, mail provider, computer pools etc.) has a single account for every user. Due to historical reason they are all disconnected, so it will be a hard job to combine all of them. But nevertheless it's possible.
<h3>Privacy policies</h3>
Basically (yes, the instructors always said <em>basically</em>) the <abbr title="Service Provider">SP</abbr>'s shouldn't know anything about the user, except the validity. But they also mentioned that e.g. an e-learning platform might want to know whether the user has a prediploma or something like this, so they have to receive this information from the <abbr title="Identity Provider">IdP</abbr>. Of course this has to be controlled via contracts, but what if the <abbr title="Service Provider">SP</abbr> wants also to know some grades or an mail address to communicate with a user!? You may not want to provide that much information to any <abbr title="Service Provider">SP</abbr>.. That situation isn't considered anywhere.
It's also a terrible thing, that the user doesn't know what kind of information is offered by the <abbr title="Identity Provider">IdP</abbr>. In their demonstration one could see, that the <abbr title="Service Provider">SP</abbr> perfectly receives the information from a <abbr title="Identity Provider">IdP</abbr>, by displaying this information (consisting of role at the <abbr title="Identity Provider">IdP</abbr>, mail address, given name, sure name and so on). So the possibility to send all LDAP attributes to the <abbr title="Service Provider">SP</abbr> is undeniable there, who can promise that not all information will be transferred!?
Remember: <strong>The provided data is verified!</strong> No chance for trashmail or something like this!
I think a much better solution would be, if the <abbr title="Identity Provider">IdP</abbr> tells the user what attributes are requested by which <abbr title="Service Provider">SP</abbr> before a user authenticates itself and thus commits the access to this data.
<h3>Fishing</h3>
Yes, the good old fishing problem. I think it would be a very interesting experiment to build a fake <abbr title="Service Provider">SP</abbr>, maybe called <em>bamja</em>, and pretend to offer music for free to students. Just authenticate as member of an university..
Yeah, cool thing! Just log in and I get any music I want!?
But of course also the <abbr title="Discovery Service">DS</abbr> is faked, and why not, even the university website (maybe found at something like <em>auth.uni-halle.de.whatever.de</em>). We all know, that not every student has that technological knowledge like us, so I think that try will catch a lot of people. And if there is really some music behind the faked authentication page, this user will probably tell its friend about this cool feature and you are able to catch a lot of accounts in a short period of time.
Ahh, and, because we have this new feature, with this account you can access their mail accounts, you can request books in a library, you can buy lectures in an e-learning tool and so on! Maybe you can quit their university register!?
<h3><abbr title="Distributed Denial of Service">DDoS</abbr></h3>
<a href="http://0rpheus.net/">Micha</a> immediately recognized the high <abbr title="Distributed Denial of Service">DDoS</abbr> potential. Imagine one single <abbr title="Identity Provider">IdP</abbr> (e.g. a university) and hundreds of <abbr title="Service Provider">SP</abbr>'s (journals, libraries, software provider etc.). Every time you request something from one of these <abbr title="Service Provider">SP</abbr>'s they send a big XML message to the <abbr title="Identity Provider">IdP</abbr>, containing lots of data (certs, web addresses and so on). So you just have to request some stuff from different clients to any of these <abbr title="Service Provider">SP</abbr>'s and they will attack the <abbr title="Identity Provider">IdP</abbr> with that much data, that the <abbr title="Identity Provider">IdP</abbr> may fail parsing everything. The <abbr title="Service Provider">SP</abbr>'s don't recognize each other, and the <abbr title="Identity Provider">IdP</abbr> just sees different <abbr title="Service Provider">SP</abbr>'s until it parses the XML, so there is no chance to block a request!? Isn't that a nice scenario? ;-)

<h2>Conclusion</h2>
Of course the idea of <abbr title="single sign-on">SSO</abbr> is very smart, but I don't like what they build...
And, by the way, I don't really want that much cookie trash in my browser.
