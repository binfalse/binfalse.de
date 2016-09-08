---
date: '2014-01-01 16:42:11'
link: ''
name: Martin
post_id: /2013/11/05/extended-mytinytodo
---

Gerade versucht deine Version zu installieren. Leider ohne Erfolg, das erste Hindernis war einfach zu Überwinden (db/config.php anstatt config.php.default). Als dann steup.php lief ging es nach der Auswahl der DB nicht weiter (sqlite) und das Apache-ErrorLog zeigte einen Fatal-Error als versucht wird eine Tabelle zu öffnen. Problem: die Datei db/todolist.db wird zwar erstellt, bleibt aber 0 Byte groß. Ich gehe von einem Fehler in der sqlite-Datenbankinitialisierung in der setup.php aus.

Das original MyTinyToDo läuft problemlos mit meiner Konfiguration.

