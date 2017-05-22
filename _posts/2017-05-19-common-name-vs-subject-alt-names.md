---
title: "Common Name vs Subject Alternative Names"
layout: post
published: true
date: 2017-05-19 16:01:30 +0200
categories:
  - network
  - security
  - web
  - website
  - administration
tags:
  - ssl
  - chrome
  - openssl
  - crypt
  - google
  - network
  - security
---

You probably heard about the conflict between the fields *Common Name* (`CN`) and *Subject Alt Names* (`subjectAltName`) in [SSL certificates](https://en.wikipedia.org/wiki/Transport_Layer_Security).
It seems best practice for clients to compare the `CN` value with the server's name.
However, [RFC 2818](https://tools.ietf.org/html/rfc2818) already advised against using the *Common Name* and google now takes the gloves off.
Since [Chrome version 58](https://www.chromestatus.com/features/4981025180483584) they do [not support the CN anymore, but throw an error:](https://bugs.chromium.org/p/chromium/issues/detail?id=308330)

> Subject Alternative Name Missing

Good potential for some administrative work ;-)

## Check for a Subject Alternative Names

You can use [OpenSSL](https://www.openssl.org/) to obtain a certificate, for example for `binfalse.de`:

{% highlight bash %}
openssl s_client -showcerts -connect binfalse.de:443 </dev/null 2>/dev/null
{% endhighlight %}

Here, `openssl` will connect to the server behind `binfalse.de` at port `443` (default port for [HTTPS](https://en.wikipedia.org/wiki/HTTPS)) to request the SSL certificate and dump it to your terminal.
`openssl` can also print the details about a certificate. You just need to pipe the certificate into:

{% highlight bash %}
openssl x509 -text -noout
{% endhighlight %}

Thus, the whole command including the output may look like this:

{% highlight bash %}
openssl s_client -showcerts -connect binfalse.de:443 </dev/null | openssl x509 -text -noout
Certificate:
  Data:
    Version: 3 (0x2)
    Serial Number:
      03:a1:4e:c1:b9:6c:60:61:34:a2:e1:9f:ad:15:2b:f9:fd:f0
  Signature Algorithm: sha256WithRSAEncryption
    Issuer: C = US, O = Let's Encrypt, CN = Let's Encrypt Authority X3
    Validity
      Not Before: May 12 07:11:00 2017 GMT
      Not After : Aug 10 07:11:00 2017 GMT
    Subject: CN = binfalse.de
    Subject Public Key Info:
      Public Key Algorithm: rsaEncryption
        Public-Key: (4096 bit)
        Modulus:
          00:ae:8d:6a:74:0b:10:4e:8e:07:1e:c8:3e:b8:83:
          11:4f:b0:af:2b:eb:49:61:82:4f:6f:73:30:0c:d6:
          3e:0a:47:bc:72:55:df:84:8c:56:1a:4a:87:ec:d4:
          72:8d:8c:3d:c4:b3:6c:7a:42:e2:f4:6e:c0:5e:50:
          e4:c0:9c:63:6c:0b:e0:12:15:0c:28:2d:4f:67:ad:
          69:9a:b4:ee:dc:12:b1:02:83:00:b7:22:22:60:13:
          a6:7d:e3:8a:e5:0c:f3:15:17:69:5e:fe:de:af:ea:
          1e:71:b4:90:df:97:fe:d2:1b:ef:58:d5:43:35:8b:
          81:e1:62:d6:6b:eb:18:e5:5b:a8:5c:da:f8:39:be:
          8b:9a:34:c1:54:d2:5c:bc:22:85:6b:2e:30:8c:d8:
          fa:dd:2c:9d:ae:5e:c9:21:43:86:d5:f8:dc:aa:d6:
          d4:2c:a8:0b:ca:d8:16:cb:98:d3:c9:c8:c0:a3:6c:
          1e:2f:9d:6f:5b:d3:09:1f:4e:1b:a7:48:99:25:84:
          ef:5f:5a:db:c1:19:82:fd:8c:9e:b2:68:da:1b:98:
          b8:60:49:62:82:8e:75:ea:03:be:0d:df:e1:8c:40:
          8a:10:48:f4:c0:f8:89:02:29:9b:94:3f:6d:68:72:
          42:e8:2e:ad:e6:81:cd:22:bf:cd:ff:ce:40:89:73:
          2e:1e:b7:94:3f:f1:9e:36:89:37:4a:04:81:80:70:
          8f:39:fe:b2:90:b5:5e:cb:93:7e:71:e3:e1:2a:bc:
          21:9a:ef:a6:e2:2b:1c:8c:da:53:bf:79:37:7d:6e:
          0e:eb:de:c3:aa:9f:64:f6:c9:58:35:d2:32:ab:4f:
          f7:8d:6e:a1:7f:7a:de:d4:48:cd:0d:18:b7:20:84:
          b5:8c:d8:f5:b1:ac:e3:b4:66:9f:9f:ab:01:22:c8:
          f2:f8:09:36:f1:c5:90:ff:d3:a4:80:8e:f4:c4:05:
          c5:4f:7f:ca:f3:fd:42:ec:25:b7:38:42:af:fd:37:
          da:5e:2f:a8:c4:23:fe:24:d2:72:16:1e:96:50:45:
          05:cb:39:6c:95:69:a0:39:48:73:72:a4:d5:c0:a0:
          b3:9a:cb:27:fe:7c:87:b8:53:3b:52:50:b6:5d:11:
          ea:b5:42:1a:80:07:4d:4c:b4:79:59:7c:b9:4b:2f:
          0b:b4:2e:57:a6:6c:5f:45:c6:4d:20:54:9d:e3:1b:
          82:0c:16:65:a0:fa:e9:cb:98:6d:59:3c:a5:41:22:
          22:e8:38:38:b6:fe:05:d5:e5:34:7f:9e:52:ba:34:
          4c:ab:9b:8d:e0:32:ce:fa:cd:2b:a3:57:7a:2c:fc:
          2c:e7:31:00:77:d7:d1:cd:b5:d2:6a:65:0f:97:63:
          b0:36:39
        Exponent: 65537 (0x10001)
    X509v3 extensions:
      X509v3 Key Usage: critical
        Digital Signature, Key Encipherment
      X509v3 Extended Key Usage: 
        TLS Web Server Authentication, TLS Web Client Authentication
      X509v3 Basic Constraints: critical
        CA:FALSE
      X509v3 Subject Key Identifier: 
        3B:F7:85:9A:2B:1E:1E:95:20:1B:21:D9:2C:AF:F4:26:E8:95:29:BA
      X509v3 Authority Key Identifier: 
        keyid:A8:4A:6A:63:04:7D:DD:BA:E6:D1:39:B7:A6:45:65:EF:F3:A8:EC:A1
      
      Authority Information Access: 
        OCSP - URI:http://ocsp.int-x3.letsencrypt.org/
        CA Issuers - URI:http://cert.int-x3.letsencrypt.org/
      
      X509v3 Subject Alternative Name: 
        DNS:binfalse.de
      X509v3 Certificate Policies: 
        Policy: 2.23.140.1.2.1
        Policy: 1.3.6.1.4.1.44947.1.1.1
          CPS: http://cps.letsencrypt.org
          User Notice:
            Explicit Text: This Certificate may only be relied upon by Relying Parties and only in accordance with the Certificate Policy found at https://letsencrypt.org/repository/
  
  Signature Algorithm: sha256WithRSAEncryption
    1b:82:51:b3:1c:0d:ae:8c:9f:25:4e:87:1a:4b:e9:b4:77:98:
    74:22:f1:27:c5:c1:83:45:7c:89:34:43:fe:76:d8:90:56:c5:
    b1:a7:74:78:f1:e4:4c:69:2c:9f:55:d1:a3:c9:ce:f1:b6:4a:
    40:e4:18:ae:80:03:76:bd:d5:25:ff:4b:4b:68:cd:98:09:48:
    e4:42:07:bc:4a:ad:a3:f7:46:8a:fe:46:c2:6a:b2:28:01:4d:
    89:09:2a:31:15:26:c5:aa:14:93:5e:8c:a6:cb:30:af:08:7f:
    6f:d8:ef:a2:d7:de:33:3e:f2:c3:17:c6:08:4a:3b:c6:67:05:
    07:c0:b8:52:13:e1:c8:13:d4:0e:19:11:0f:54:4e:ea:d0:2b:
    c2:3d:93:51:8a:15:da:f7:4b:78:08:cd:c1:d0:f2:f7:e0:98:
    f7:0a:bc:13:ca:d0:9b:be:2d:2b:d5:e9:03:29:12:aa:97:ec:
    1a:d1:2c:51:7d:21:d1:38:39:aa:1d:9e:a5:98:1d:94:e2:66:
    ea:31:c4:18:b6:13:6c:6f:8e:2f:27:77:7b:af:37:e0:0b:86:
    4b:b5:cc:7b:96:31:0c:30:c6:9e:12:a2:15:07:29:9f:78:3e:
    5e:2a:3f:cf:f8:27:82:30:72:6b:63:64:5a:d1:2d:ed:08:ed:
    71:13:a9:0b
{% endhighlight %}


As you can see in the [`X.509` extension](https://en.wikipedia.org/wiki/X.509) this server's SSL certificate does have a Subject Alternative Name: 


{% highlight bash %}
X509v3 Subject Alternative Name:
  DNS:binfalse.de
{% endhighlight %}


To quick-check one of your websites you may want to use the following [`grep`](https://en.wikipedia.org/wiki/Grep) filter:

{% highlight bash %}
openssl s_client -showcerts -connect binfalse.de:443 </dev/null | openssl x509 -text -noout | grep -A 1 "Subject Alternative Name"
{% endhighlight %}

If that doesn't print a proper *Subject Alternative Name* you should go and create a new SSL certificate for that server!
