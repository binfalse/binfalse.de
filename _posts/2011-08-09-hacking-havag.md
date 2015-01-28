---
layout: post
title: 'Hacking Havag'
tags:
  - analyzed
  - apache
  - crazy
  - debug
  - explained
  - hacked
  - Halle
  - Java
  - Media
  - Network
  - Programming
  - simplification
  - trick
categories:
  - Java
  - Media
  - Network
  - Perl
  - Software
  - Web

---

Ihr kennt vielleicht die <a href="http://www.havag.de/">Havag</a> (Hallesche Verkehrs-AG)? Das ist das Verkehrsunternehmen in Halle, befördert uns zu maximalen Preisen bei dürftiger Qualität. Wie auch immer.



{% include image.html align="alignright" url="/wp-content/uploads/2011/08/havag-widget.png" img="/wp-content/uploads/2011/08/havag-widget-150x150.png" title="" caption="" %}

Das Unternehmen bietet seinen Kunden ein <a href="http://www.havag.com/index.php?page=486">Widget</a> an, mit dem man vom Wohnzimmer das Eintreffen der Bahnen an der nächstgelegenen Haltestelle monitoren kann. Das ganze nennt sich <em>mobile@home</em> (siehe Bild 1) und ist in Java geschrieben. Ist eigentlich eine feine Sache, man muss nicht mehr nach Bauchgefühl das Haus verlassen, wenn ja doch gerade keine Bahn kommt. Das Fenster nervt jedoch tierisch. Ich hab seit langen auf meinem Schedule einen Eintrag, der mich daran erinnert eine bessere Lösung zu finden. Heute Nacht hab ich mich nun endlich an die Arbeit gemacht.

Das Problem ist wie üblich eine geschlossene Software, keine Dokumentation für jemanden wie mich. Ja es ist Java, also wäre es ein Leichtes die Binaries zu dekompilieren, deren Projekt besteht jedoch aus >1000 Klassen (öhm overhead!) und über den rechtlichen Aspekt bin ich mir da auch nicht sicher.
Aber was wird das Tool wohl machen? Es wird einen zentralen Server nach den nächsten Stopps an einer von mir gewählten Haltestelle fragen. Der Server wird dann sicherlich mit den jeweiligen Bahnen antworten.
Soweit Client und Server kein kryptisches Protokoll sprechen kann ich also einfach den Netzwerkverkehr der über meine Interfaces geht mitschneiden und nachbauen. Also fix den Sniffer meines Vertrauens und das tolle Tool gestartet. Schnell wurde klar um welchen Server es sich handelt:  `83.221.237.42`  auf Port  `20010` . Und die Sache war auch schon so gut wie gegessen als ich folgende Pakete an mir vorbei rauschen sah:



{% highlight bash %}
usr@srv % tcpdump -A -n src 83.221.237.42 or dst 83.221.237.42 and tcp port 20010
[...]
03:19:29.177630 IP 192.168.9.55.39453 > 83.221.237.42.20010: Flags [P.], seq 231:443, ack 108, win 35, options [nop,nop,TS val 28628068 ecr 367433884], length 212
E....2@.@.....  7S..*..N*..["..:~...#.......
...d....POST /init/rtpi HTTP/1.1
Content-Type: text/xml
User-Agent: Java/1.6.0_26
Host: 83.221.237.42:20010
Accept: text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2
Connection: keep-alive
Content-Length: 47


03:19:29.177676 IP 192.168.9.55.39453 > 83.221.237.42.20010: Flags [P.], seq 443:490, ack 108, win 35, options [nop,nop,TS val 28628068 ecr 367433884], length 47
E..c.3@.@..z..  7S..*..N*..[...:~...#.=.....
...d....c..m..getDeparturesForStopS..An der Feuerwachez
03:19:29.229795 IP 83.221.237.42.20010 > 192.168.9.55.39453: Flags [.], ack 490, win 65488, options [nop,nop,TS val 367433990 ecr 28628068], length 0
E..4..@.r.}.S..*..      7N*....:~..\\%....s......
.......d
03:19:29.234736 IP 83.221.237.42.20010 > 192.168.9.55.39453: Flags [.], seq 108:1556, ack 490, win 65535, options [nop,nop,TS val 367433992 ecr 28628068], length 1448
E.....@.r.x1S..*..      7N*....:~..\\%....h......
.......dHTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Content-Length: 1869
Date: Tue, 09 Aug 2011 01:19:29 GMT

S..9S..Soltauer Stra..eS..2011.08.09.03:46:00S..2011.08.09.03:46:00S..trueS..38150S..651S..falseS..falseS..38150:12840S..A FeuerwacheS..falseS..falsezVt..[stringl...l...ingl...
[...]
{% endhighlight %}



 `An der Feuerwache`  ist die Haltestelle, für die meine Anfrage raus ging, und ein  `POST` -connect mit den Daten  `...d....c..m..getDeparturesForStopS..An der Feuerwachez`  sieht stark nach dem aus, was ich gesucht habe. Kurz darauf kommt auch gleich die Antwort  `S..9S..Soltauer Stra..eS..2011.08.09.03:46:00S..2011.08.09.03:46:00S..true[..]` , und tatsächlich fährt eine Linie 9 in kürze zur  `Soltauer Straße` . Dedüm!!
Der Rest ist simpel. Nur noch mit 'nem Hexeditor (ich empfehle <a href="http://packages.qa.debian.org/h/hexcurse.html">hexcurse</a>) in die Pakete hinein geschaut um zu sehen was genau übermittelt werden muss (die  `.`  zwischen den Daten stehen für Zeichen, die in meinem Terminal nicht für mich sichtbar dargestellt werden können. Deren Hexadezimal-Code gibt aber Aufschluss über ihren Wert). Mit ein wenig Trial&Error ist die Geschichte vom Tisch.

Natürlich ist meine Alternative zu dem Widget für jedermann <a href="/wp-content/uploads/pipapo/scripts/havag.pl">verfügbar</a>:



{% highlight perl %}
{% endhighlight %}

Als Argument einfach die gewünschte Haltestelle angeben:

{% highlight bash %}
usr@srv % ./havag.pl Straßburger Weg
Frage http://83.221.237.42:20010/init/rtpi nach geplanten Stops für 'Straßburger Weg'...

 Zeit   Linie   Richtung       
15:33       4   Kröllwitz     
15:36       5   Bad Dürrenberg
15:42       5   Kröllwitz     
15:44       S   Sonderfahrt    
15:45       4   Hauptbahnhof   
15:48       4   Kröllwitz     
15:51       5   Ammendorf      
15:57       5   Kröllwitz     
16:00       4   Hauptbahnhof   
16:03       4   Kröllwitz     
16:06       5   Bad Dürrenberg
16:12       5   Kröllwitz     
16:15       4   Hauptbahnhof   
16:18       4   Kröllwitz     
16:21       5   Ammendorf      
16:27       5   Kröllwitz     
16:30       4   Hauptbahnhof
{% endhighlight %}



<h2>Das Protokoll</h2>

Vielleicht hat ja jemand Lust weitere Tools zu schreiben, die die <em>"Serverschnittstelle"</em> der Havag benutzen. Daher hier eine kurze Dokumentation des inoffiziellen Protokolls, das mit dem Server gesprochen werden kann.

Eine Anfrage an den Server muss via <a href="http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol">HTTP</a>-<a href="http://en.wikipedia.org/wiki/POST_%28HTTP%29">POST</a> an  `83.221.237.42:20010/init/rtpi`  geschehen und die folgenden Inhalte liefern:



{% highlight bash %}
[COMMAND]x00[LEN][FUNCTION]x00[LEN][FUNCTIONNAME]x53x00[LEN][ARGUMENT]x7A
{% endhighlight %}



Hierbei ist  `xAB`  das Zeichen für den Hexwert  `AB` ,  `LEN`  ist die Länge der darauf folgenden Zeichenkette. Um den Server nach den nächsten Stopps am Rennbahnkreuz zu fragen sendet man als Kommando ein  `c` , als Funktion ein  `m` , und die Funktion heißt  `getDeparturesForStop` . Als Argument wird dann die Haltestelle erwartet. Die Anfrage in <em>HalbHex</em> sieht also wie folgt aus:



{% highlight bash %}
cx00x01mx00x14getDeparturesForStopx53x00x0dRennbahnkreuzx7a
{% endhighlight %}



und komplett Hexadezimal-kodiert:



{% highlight bash %}
x63x00x01x6dx00x14x67x65x74x44x65x70x61x72x74x75x72x65x73x46x6fx72x53x74x6fx70x53x00x0dx52x65x6ex6ex62x61x68x6ex6bx72x65x75x7ax7a
{% endhighlight %}



Als Antwort bekommt man die Abfahrtszeiten in den nächsten 60 min. Die Antwort beginnt mit einer Zeichenkette die ich nicht verstehe und vorerst nur verwerfe. Ein Eintrag für eine Bahn startet mit den Hexadezimalwerten  `x56x74x00x07x5Cx5Bx73x74x72x69x6Ex67x6Cx00x00x00x0D` . Darauf folgen die einzelnen Informationen zu dieser Bahn. Eine einzelne Information ist wie folgt kodiert:



{% highlight bash %}
x53x00[LEN][INFO]
{% endhighlight %}



 `LEN`  gibt hier wieder die Länge der folgenden Information an, die Information selbst ist ASCII Klartext. Ein Bahneintrag wird abgeschlossen mit einem  `x7a`  (z). Folgende Daten werden übermittelt:



{% highlight bash %}
Linie   Endstation      Ankunft                 ???                     N       ???     ???     ???     ???     ???             Angefragte Haltestelle  ???     ???  z
91      Am Steintor     2011.08.09.02:42:35     2011.08.09.01:13:00     false   18824   0       false   false   18824:90120     An der Feuerwache       false   falsez
{% endhighlight %}



Das boolsche  `N`  gibt an, ob es sich um eine Niederflur-Straßenbahn handelt. Die mit  `???`  gekennzeichneten Felder verstehe ich (noch) nicht. Vielleicht etwas wie Wagennummer/Typ, ob es eine Verspätung gibt etc. Kann man sicher auch herausbekommen, da sie aber für mich vorerst nicht wichtig sind habe ich mich nicht weiter darum gekümmert.

Meine Beschreibungen sind natürlich alles andere als komplett, für die Korrektheit kann ich auch nicht garantieren. Vielleicht gehört das x00 vor der Längen-Kodierung auch mit zur Längenangabe und ist bei den kurzen Zeichenketten nur immer 0? Wer weiß, in der Praxis funktioniert mein Gehacktes aber (mindestens für mich) ;-)

<div class="note"><strong>Update:</strong>
Wird  `getDeparturesForStop`  ohne Argumente gesendet, bekommt man eine Antwort mit allen Verfügbaren Stopps. (via <a href="https://twitter.com/#!/michas/status/101554674859130880">@michas</a>)</div>

Damit ist also der Weg für coole neue Apps geebnet. Vielleicht hat ja jemand von euch eines dieser Smartphones (oder es findet sich ein Sponsor der mir eines zur Verfügung stellt)?

Übrigens flogen auch hin und wieder Pakete mit Inhalten wie diesem vorbei:  `Apache Tomcat/5.5.17 - Error report` . Spricht nicht gerade für das Widget. :-P


<div class="download"><strong>Download:</strong>
Perl: <a href="/wp-content/uploads/pipapo/scripts/havag.pl">havag.pl</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
