---
layout: post
title: 'Expiration dates of hash functions!?'
tags:
  - Junk
  - Network
  - Security
categories:
  - Junk
  - Security

---

Just read the so called <a href="http://www.bundesnetzagentur.de/cln_1912/DE/Sachgebiete/QES/Veroeffentlichungen/Algorithmen/algorithmen_node.html">Algorithmencatalog</a> (maybe <em>Algorithms Catalog</em> in English!?), published by our German <a href="http://www.bundesnetzagentur.de/">Bundesnetzagentur</a>. They seem to know exact expiration dates for hash functions ;)



{% include image.html align="alignright" url="/wp-content/uploads/2010/08/hash-ablauf.png" img="/wp-content/uploads/2010/08/hash-ablauf-150x150.png" title="" caption="" %}

In <a href="http://www.bundesnetzagentur.de/cae/servlet/contentblob/148572/publicationFile/3994/2010AlgoKatpdf.pdf">this PDF</a> file I found the following table (see original screen-shot):
<table>
<caption>* i.e. for creation of qualified certs, not for creation or verification of other qualified signed data.
** i.e. for creation of qualified certs with at least 20 bit entropy in its serial number, not for creation or verification of other qualified signed data.
*** exclusively for verification of qualified certs</caption>
<tr>
<td>Creation of qualified certs*:
suitable til end of <strong>2009</strong></td>
<td>Creation of qualified certs**:
suitable til end of <strong>2010</strong></td>
<td>suitable til end of <strong>2010</strong></td>
<td>suitable til end of <strong>2015</strong></td>
<td>suitable til end of <strong>2016</strong></td>
</tr>
<tr>
<td>SHA-1</td>
<td>SHA-1</td>
<td>RIPEMD-160</td>
<td>SHA-224
(SHA-1, RIPEMD-160)***</td>
<td>SHA-256,
SHA-384,
SHA-512</td>
</tr>
</table>

So I hope there is anybody out there that has started to crack SHA-1 to get finished this year :P

(maybe it's the recounter's turn!?^^)
