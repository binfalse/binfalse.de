---
date: '2013-09-12 14:59:12'
link: ''
name: Swarga Bera
post_id: /2011/02/20/talking-r-through-java
---

This is not working in my windows machine. It throws exception 

Cannot find JRI native library!
Please make sure that the JRI native library is in a directory listed in java.library.path.

java.lang.UnsatisfiedLinkError: no jri in java.library.path
	at java.lang.ClassLoader.loadLibrary(ClassLoader.java:1709)
	at java.lang.Runtime.loadLibrary0(Runtime.java:823)
	at java.lang.System.loadLibrary(System.java:1030)
	at org.rosuda.JRI.Rengine.(Rengine.java:9)
	at com.test.maintest.main(maintest.java:9)

How can i solve it.My R global path is also right.