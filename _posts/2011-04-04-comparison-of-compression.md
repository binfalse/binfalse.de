---
layout: post
title: 'Comparison of compression'
tags:
  - analyzed
  - backup
  - explained
  - grml
  - media
  - network
categories:
  - mail
  - media
  - network
  - r
  - software
  - web

---

I recently wrote an email with an attached LZMA archive. It was immediately answered with something like:

<blockquote>What are you doing? I had to boot linux to open the file!</blockquote>

First of all I don't care whether user of proprietary systems are able to read open formats, but this answer made me curious to know about the differences between some compression mechanisms regarding compression ratio and time. So I had to test it!



This is nothing scientific! I just took standard parameters, you might optimize each method on its own to save more space or time. Just have a look at the parameter -1..-9 of zip. But all in all this might give you a feeling for the methods.


<h1>Candidates</h1>

I've chosen some usual compression methods, here is a short digest (more or less copy&paste from the man pages):


* **gzip:** uses Lempel-Ziv coding (LZ77), cmd:  `tar czf $1.pack.tar.gz $1` 
* **bzip2:** uses the Burrows-Wheeler block sorting text compression algorithm and Huffman coding, cmd:  `tar cjf $1.pack.tar.bz2 $1` 
* **zip:** analogous to a combination of the Unix commands tar(1) and compress(1) and is compatible with PKZIP (Phil Katz's ZIP for MSDOS systems), cmd:  `zip -r $1.pack.zip $1` 
* **rar:** proprietary archive file format, cmd:  `rar a  $1.pack.rar $1` 
* **lha:** based on Lempel-Ziv-Storer-Szymanski-Algorithm (LZSS) and Huffman coding, cmd:  `lha a $1.pack.lha $1` 
* **lzma:** Lempel-Ziv-Markov chain algorithm, cmd:  `tar --lzma -cf $1.pack.tar.lzma $1` 
* **lzop:** imilar to gzip but favors speed over compression ratio, cmd:  `tar --lzop -cf $1.pack.tar.lzop $1` 


All times are user times, measured by the unix time command. To visualize the results I plotted them using R, compression efficiency at X vs. time at Y. The best results are of course located near to the origin.



<h1>Data</h1>

To test the different algorithms I collected different types of data, so one might choose a method depending on the file types.

<h2>Binaries</h2>

The first category is called binaries. A collection of files in human-not-readable format. I copied all files from  `/bin`  and  `/usr/bin` , created a gpg encrypted file of a big document and added a copy of <a href="http://grml.org/download/">grml64-small_2010.12.iso</a>. All in all 176.753.125 Bytes.

<table><tr><th>Method</th><th>Compressed Size</th><th>% of original</th><th>Time in s</th></tr>
<tr><td>gzip</td><td class="tab-right">161.999.804</td><td class="tab-right">91.65</td><td class="tab-right">10.18</td></tr>
<tr><td>bzip2</td><td class="tab-right">161.634.685</td><td class="tab-right">91.45</td><td class="tab-right">71.76</td></tr>
<tr><td>zip</td><td class="tab-right">179.273.428</td><td class="tab-right">101.43</td><td class="tab-right">13.51</td></tr>
<tr><td>rar</td><td class="tab-right">175.085.411</td><td class="tab-right">99.06</td><td class="tab-right">156.46</td></tr>
<tr><td>lha</td><td class="tab-right">180.357.628</td><td class="tab-right">102.04</td><td class="tab-right">35.82</td></tr>
<tr><td>lzma</td><td class="tab-right">157.031.052</td><td class="tab-right">88.84</td><td class="tab-right">129.22</td></tr>
<tr><td>lzop</td><td class="tab-right">165.533.609</td><td class="tab-right">93.65</td><td class="tab-right">4.16</td></tr>
</table>

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/04/Binary.png" img="/wp-content/uploads/2011/04/Binary.png" title="" caption="" %}

<h2>Media</h2>

This is a bunch of media files. Some audio data like the <a href="http://www.americanrhetoric.com/speeches/mlkihaveadream.htm">I have a dream</a>-speech of Martin-Luther King and some music. Also video files like the <a href="http://www.gnu.org/music/free-software-song.html">The Free Software Song</a> and Clinton's <a href="http://www.youtube.com/watch?v=KiIP_KDQmXs">I did not have sexual relations with that woman</a> are integrated. I attached importance to different formats, so here are audio files of the type ogg, mp3 mid, ram, smil and wav, and video files like avi, ogv and mp4. Altogether 95.393.277 Bytes.

<table><tr><th>Method</th><th>Compressed Size</th><th>% of original</th><th>Time in s</th></tr>
<tr><td>gzip</td><td class="tab-right">88.454.002</td><td class="tab-right">92.73</td><td class="tab-right">6.04</td></tr>
<tr><td>bzip2</td><td class="tab-right">87.855.906</td><td class="tab-right">92.10</td><td class="tab-right">37.82</td></tr>
<tr><td>zip</td><td class="tab-right">88.453.926</td><td class="tab-right">92.73</td><td class="tab-right">6.17</td></tr>
<tr><td>rar</td><td class="tab-right">87.917.406</td><td class="tab-right">92.16</td><td class="tab-right">70.69</td></tr>
<tr><td>lha</td><td class="tab-right">88.885.325</td><td class="tab-right">93.18</td><td class="tab-right">14.22</td></tr>
<tr><td>lzma</td><td class="tab-right">87.564.032</td><td class="tab-right">91.79</td><td class="tab-right">74.76</td></tr>
<tr><td>lzop</td><td class="tab-right">90.691.764</td><td class="tab-right">95.07</td><td class="tab-right">2.28</td></tr>
</table>

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/04/Media.png" img="/wp-content/uploads/2011/04/Media.png" title="" caption="" %}

<h2>Office</h2>

The next category is office. Here are some PDF from different <a href="http://phylogenomics.blogspot.com/2011/03/please-help-keep-pressure-on-nature.html">journals </a> and office files from <a href="http://www.freiesmagazin.de/20110403-aprilausgabe-erschienen">LibreOffice</a> and Microsoft's Office (special thanks to <a href="http://twitter.com/chschmelzer">@chschmelzer</a> for providing MS files). The complete size of these files is 10.168.755 Bytes.

<table><tr><th>Method</th><th>Compressed Size</th><th>% of original</th><th>Time in s</th></tr>
<tr><td>gzip</td><td class="tab-right">8.091.876</td><td class="tab-right">79.58</td><td class="tab-right">0.55</td></tr>
<tr><td>bzip2</td><td class="tab-right">8.175.629</td><td class="tab-right">80.40</td><td class="tab-right">8.58</td></tr>
<tr><td>zip</td><td class="tab-right">8.092.682</td><td class="tab-right">79.58</td><td class="tab-right">0.54</td></tr>
<tr><td>rar</td><td class="tab-right">7.880.715</td><td class="tab-right">77.50</td><td class="tab-right">3.72</td></tr>
<tr><td>lha</td><td class="tab-right">8.236.422</td><td class="tab-right">81.00</td><td class="tab-right">3.29</td></tr>
<tr><td>lzma</td><td class="tab-right">7.802.416</td><td class="tab-right">76.73</td><td class="tab-right">5.62</td></tr>
<tr><td>lzop</td><td class="tab-right">8.358.343</td><td class="tab-right">82.20</td><td class="tab-right">0.21</td></tr>
</table>

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/04/Office.png" img="/wp-content/uploads/2011/04/Office.png" title="" caption="" %}

<h2>Pictures</h2>

To test the compression of pictures I downloaded 10 files of each format bmp, eps, gif,  jpg,  png,  svg and tif. That are the first ones I found with google's image search engine. In total 29'417'414 Bytes.

<table><tr><th>Method</th><th>Compressed Size</th><th>% of original</th><th>Time in s</th></tr>
<tr><td>gzip</td><td class="tab-right">20.685.809</td><td class="tab-right">70.32</td><td class="tab-right">1.65</td></tr>
<tr><td>bzip2</td><td class="tab-right">18.523.091</td><td class="tab-right">62.97</td><td class="tab-right">10.71</td></tr>
<tr><td>zip</td><td class="tab-right">20.668.602</td><td class="tab-right">70.26</td><td class="tab-right">1.72</td></tr>
<tr><td>rar</td><td class="tab-right">18.052.688</td><td class="tab-right">61.37</td><td class="tab-right">8.58</td></tr>
<tr><td>lha</td><td class="tab-right">20.927.949</td><td class="tab-right">71.14</td><td class="tab-right">5.97</td></tr>
<tr><td>lzma</td><td class="tab-right">18.310.032</td><td class="tab-right">62.24</td><td class="tab-right">21.09</td></tr>
<tr><td>lzop</td><td class="tab-right">23.489.611</td><td class="tab-right">79.85</td><td class="tab-right">0.57</td></tr>
</table>

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/04/Pictures.png" img="/wp-content/uploads/2011/04/Pictures.png" title="" caption="" %}

<h2>Plain</h2>

This is the main category. As you know, ASCII content is not saved really space efficient. Here the tools can riot! I downloaded some books from <a href="http://www.gutenberg.org/">Project Gutenberg</a>, for example Jules Verne's <a href="http://www.gutenberg.org/ebooks/103">Around the World in 80 Days</a> and Homer's <a href="http://www.gutenberg.org/ebooks/3160">The Odyssey</a>, source code of <a href="http://seehuhn.de/pages/moon-buggy">moon-buggy</a> and <a href="http://www.openldap.org/">OpenLDAP</a>, and copied all text files from  `/var/log` . Altogether 40.040.854 Bytes.

<table><tr><th>Method</th><th>Compressed Size</th><th>% of original</th><th>Time in s</th></tr>
<tr><td>gzip</td><td class="tab-right">11.363.931</td><td class="tab-right">28.38</td><td class="tab-right">1.88</td></tr>
<tr><td>bzip2</td><td class="tab-right">9.615.929</td><td class="tab-right">24.02</td><td class="tab-right">13.63</td></tr>
<tr><td>zip</td><td class="tab-right">12.986.153</td><td class="tab-right">32.43</td><td class="tab-right">1.6</td></tr>
<tr><td>rar</td><td class="tab-right">11.942.201</td><td class="tab-right">29.83</td><td class="tab-right">8.68</td></tr>
<tr><td>lha</td><td class="tab-right">13.067.746</td><td class="tab-right">32.64</td><td class="tab-right">8.86</td></tr>
<tr><td>lzma</td><td class="tab-right">8.562.968</td><td class="tab-right">21.39</td><td class="tab-right">30.21</td></tr>
<tr><td>lzop</td><td class="tab-right">15.384.624</td><td class="tab-right">38.42</td><td class="tab-right">0.38</td></tr>
</table>

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/04/Plain.png" img="/wp-content/uploads/2011/04/Plain.png" title="" caption="" %}

<h2>Rand</h2>

This category is just to test random generators. Compressing random content shouldn't decrease the size of the files. Here I used two files from <a href="http://www.random.org/files/">random.org</a> and dumped some bytes from /dev/urandom. 4.198.400 Bytes.

<table><tr><th>Method</th><th>Compressed Size</th><th>% of original</th><th>Time in s</th></tr>
<tr><td>gzip</td><td class="tab-right">4.195.646</td><td class="tab-right">99.93</td><td class="tab-right">0.23</td></tr>
<tr><td>bzip2</td><td class="tab-right">4.213.356</td><td class="tab-right">100.36</td><td class="tab-right">1.83</td></tr>
<tr><td>zip</td><td class="tab-right">4.195.758</td><td class="tab-right">99.94</td><td class="tab-right">0.2</td></tr>
<tr><td>rar</td><td class="tab-right">4.205.389</td><td class="tab-right">100.17</td><td class="tab-right">1.65</td></tr>
<tr><td>lha</td><td class="tab-right">4.194.566</td><td class="tab-right">99.91</td><td class="tab-right">2.04</td></tr>
<tr><td>lzma</td><td class="tab-right">4.197.256</td><td class="tab-right">99.97</td><td class="tab-right">1.98</td></tr>
<tr><td>lzop</td><td class="tab-right">4.197.134</td><td class="tab-right">99.97</td><td class="tab-right">0.1</td></tr>
</table>

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/04/Rand.png" img="/wp-content/uploads/2011/04/Rand.png" title="" caption="" %}

<h2>Everything</h2>

All files of the previous catergories compressed together. Since the categories aren't of same size it is of course not really fair. Nevertheless it might be interesting. All files together require 355.971.825 Bytes.

<table><tr><th>Method</th><th>Compressed Size</th><th>% of original</th><th>Time in s</th></tr>
<tr><td>gzip</td><td class="tab-right">294.793.255</td><td class="tab-right">82.81</td><td class="tab-right">20.43</td></tr>
<tr><td>bzip2</td><td class="tab-right">290.093.007</td><td class="tab-right">81.49</td><td class="tab-right">141.89</td></tr>
<tr><td>zip</td><td class="tab-right">313.670.439</td><td class="tab-right">88.12</td><td class="tab-right">23.78</td></tr>
<tr><td>rar</td><td class="tab-right">305.083.648</td><td class="tab-right">85.70</td><td class="tab-right">246.63</td></tr>
<tr><td>lha</td><td class="tab-right">315.669.631</td><td class="tab-right">88.68</td><td class="tab-right">64.81</td></tr>
<tr><td>lzma</td><td class="tab-right">283.475.568</td><td class="tab-right">79.63</td><td class="tab-right">258.05</td></tr>
<tr><td>lzop</td><td class="tab-right">307.644.076</td><td class="tab-right">86.42</td><td class="tab-right">7.89</td></tr>
</table>

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/04/Complete.png" img="/wp-content/uploads/2011/04/Complete.png" title="" caption="" %}

<h1>Conclusion</h1>

As you can see, the violet lzma-dot is always located at the left side, meaning very good compression. But unfortunately it's also always at the top, so it's very slow. But if you want to compress files to send it via mail you won't bother about longer compression times, the file size might be the crucial factor.
At the other hand black, green and grey (gzip, zip and lzop) are often found at the bottom of the plots, so they are faster but don't decrease the size that effectively.

All in all you have to choose the method on your own. Also think about compatibility, not everybody is able to unpack lzma or lzop..
My upshot is to use lzma if I want to transfer data through networks  and for attachments to advanced people, and to use gzip for everything else like backups of configs or mails to windows user.

