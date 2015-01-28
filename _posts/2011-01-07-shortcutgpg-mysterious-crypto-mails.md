---
layout: post
title: 'ShortCut[GPG]: Mysterious crypto mails'
tags:
  - explained
  - GNU
  - Mail
  - Network
  - Security
  - ShortCut
  - Thunderbird
  - ugly
categories:
  - Mail
  - Security
  - ShortCut
  - Web

---

When I write mails to people for the first time they usually answer them immediately with something like

<blockquote>
What is that crazy crypto stuff surrounding your mails? Wondering why I can't read it!?
</blockquote>

There are lots of legends out there belonging to this clutter, most of them are only fairy tales, here is the one and only true explanation!

As a friend of security I always try to encrypt my mails via <abbr title="Gnu Privacy Guard">GPG</abbr>. That is only possible if the recipient is also using GPG and I have his/her public key. If this is not the case, I just sign my mail to give the addressee the chance to verify that the mail is from me and nobody else on its way has modified the content of the mail. So the clutter is the electronic signature of the mail! It's a simple ASCII code, however not readable for human eyes but readable for some intelligent tools.

There are two kinds of signatures:
<ul>
	<li>inline signature: it surrounds the message with cryptographic armor. That has the disadvantage that you can't sign attachments or HTML mails and the text is more or less hidden between PGP-goodies.</li>
	<li>attached signatures: the crypto stuff is attached as <em>signature.asc</em>. With the disadvantage that mailservers may be alarmed from this attachment and drop the mail.</li>
</ul>

Since I usually write ASCII mails without attachments I sign them inline. Such a signed mail that reaches your inbox may look like:



{% highlight bash %}
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA1

Dear Malte,

just asking for the weather on the other shore!?

Regards, Martin
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.10 (GNU/Linux)
Comment: Using GnuPG with Mozilla - http://enigmail.mozdev.org/

iEYEARECAAYFAk0hAAsACgkQ2bNRc0RtswagiwCeL5HPAGff5U34ldjeHIAgHiHS
T48AnjB+XPC7fTWcYw7S94IWAzvDTGkD
=PLl7
-----END PGP SIGNATURE-----
{% endhighlight %}



Depending on the used mail-client I usually also attach my public key, so if you're using a mail-client that is able to handle GPG signed/encrypted mails it should parse the crypto stuff and verify whether the signature is correct or not. In this case the mail will be collapsed so that you'll see something like this (with an indication whether the signature was valid or not):



{% highlight bash %}
Dear Malte,

just asking for the weather on the other shore!?

Regards, Martin
{% endhighlight %}



But if you're using a client that doesn't ever heard about GPG it won't recognize the cryptographic parts and you'll only see lot's of clutter. In this case I recommend to change the mail-client! ;-)

To learn more about GPG take a look at <a href="http://www.gnupg.org/">gnupg.org</a>.
