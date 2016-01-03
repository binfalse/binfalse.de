---
layout: post
title: 'Talking R through Java'
tags:
  - debian
  - gnu
  - java
  - programming
  - trick
  - ubuntu
categories:
  - debian
  - java
  - r
  - software

---

Today I played a bit with <a href="http://rosuda.org/JRI/">JRI</a> as part of <a href="http://www.rforge.net/rJava/">rJava</a>, a Java-R-interface. Here you can learn how to setup for <a href="http://www.debian.org/">Debian</a>/<a href="http://www.ubuntu.com/">Ubuntu</a>/<a href="http://www.aptosid.com/">akins</a>.


<h2>Installation</h2>
Assuming you have a running version of <a href="http://java.com/">Java</a> and <a href="http://www.r-project.org/">GNU's R</a>, you have to install  `r-cran-rjava` :



{% highlight bash %}
aptitude install r-cran-rjava
{% endhighlight %}



<h2>Shell environment</h2>
To talk to R through Java you have to specify three more environmental variables. First of all you need to<strong> publish you R installation path</strong>, my R is found in  `/usr/lib64/R` :



{% highlight bash %}
export R_HOME=/usr/lib64/R
{% endhighlight %}



If you didn't or the path is wrong you'll fall into trouble:



{% highlight bash %}
R_HOME is not set. Please set all required environment variables before running this program.
{% endhighlight %}



Second the  `$CLASSPATH`  needs to get an update. Precisely you have to <strong>add the archives</strong>  `JRIEngine.jar` ,  `JRI.jar`  and  `REngine.jar` . In my case all of them can be found in  `/usr/lib/R/site-library/rJava/jri/` , so the  `$CLASSPATH`  should be set like that:



{% highlight bash %}
export CLASSPATH=.:/usr/lib/R/site-library/rJava/jri/
{% endhighlight %}



If the  `$CLASSPATH`  isn't defined correctly you won't be able to compile your Java code.

Last but not least you have to <strong>add the native JRI-library</strong> to your  `$LD_LIBRARY_PATH` , by default this lib is located in the same directory like the jar's:



{% highlight bash %}
export LD_LIBRARY_PATH=/usr/lib/R/site-library/rJava/jri/
{% endhighlight %}



If the  `$LD_LIBRARY_PATH`  isn't proper you'll experience errors like this:



{% highlight java %}
Cannot find JRI native library!
Please make sure that the JRI native library is in a directory listed in java.library.path.

java.lang.UnsatisfiedLinkError: no jri in java.library.path
        at java.lang.ClassLoader.loadLibrary(ClassLoader.java:1734)
        at java.lang.Runtime.loadLibrary0(Runtime.java:823)
        at java.lang.System.loadLibrary(System.java:1028)
        at org.rosuda.JRI.Rengine.<clinit>(Rengine.java:19)
{% endhighlight %}



To not always do the same you might write these export stuff to your  `.bashrc`  or  `.zshrc`  respectively.

<h2>Eclipse setup</h2>
Of course in <a href="http://www.eclipse.org/">Eclipse</a> you'll also have to define these three things.
Where are the jar's located? Add them to your libraries in <em>Project > Properties > Java Build Path > Libraries</em>.
Instead of the  `$LD_LIBRARY_PATH`  you can set the  `java.library.path`  in <em>Run > Run Configurations > Arguments</em>. Add  `-Djava.library.path=.:/usr/lib/R/site-library/rJava/jri/`  to the <em>VM arguments</em> (modify the path to match your criteria).
The  `R_HOME`  can be published in <em>Run > Run Configurations > Environment</em>. Create a new variable with the name  `R_HOME`  and the value  `/usr/lib64/R`  (or an equivalent path).
That's it, see the section above to identify what went wrong if something fails.

<h2>Netbeans setup</h2>
Two of these three parts are also straight forward in <a href="http://netbeans.org/">Netbeans</a>.
First publish the location of the jar's. Right-click on your project and choose <em>Properties > Libraries</em>. In the <em>Compile</em>-tab click <em>Add JAR/Folder</em> and search for the jar files.
Next task is to adjust the library-path. Right-click on your project and choose <em>Properties > Run</em>. Add  `-Djava.library.path=.:/usr/lib/R/site-library/rJava/jri/`  to the <em>VM Options</em> (modify the path to match your criteria).
The third step is a little tricky. As far as I know there is no way to change the environment from within Netbeans, so you can't create the variable  `R_HOME`  after Netbeans is started. In my opinion you have two options:

1. Export the variable before starting Netbeans:
   {% highlight bash %}
   usr@srv $ export R_HOME=/usr/lib64/R
   usr@srv $ netbeans
   {% endhighlight %}
   you might want to write a wrapper script that does this step for you, or include the export in any of the resource files that are called before Netbeans starts (e.g. your  `.bashrc` ).

2. Change the environment from within your project. At <a href="http://stackoverflow.com/questions/318239/how-do-i-set-environment-variables-from-java">stackoverflow</a> you can find a workaround, but I think this is a very lousy solution..

If you have further suggestions please let me know!
Meanwhile <a href="http://sharpstatistics.co.uk/">George Bull</a> published a <a href="http://sharpstatistics.co.uk/r/using-jri-to-connect-java-to-r/">setup guide for Netbeans on Windows</a> hosts. Seems to be worthy to take a look at it ;-)

<h2>Testcase</h2>
If you defined your environment properly, you should be able to utilize the <a href="http://www.rforge.net/org/docs/org/rosuda/JRI/Rengine.html">REngine</a>. I have a small script for you to test whether all things are fine:

{% highlight java %}
package de.binfalse.martin;

import org.rosuda.JRI.Rengine;

public class JRItest
{
  public static void main (String[] args)
  {
    // new R-engine
    Rengine re=new Rengine (new String [] {"--vanilla"}, false, null);
    if (!re.waitForR())
    {
      System.out.println ("Cannot load R");
      return;
    }

    // print a random number from uniform distribution
    System.out.println (re.eval ("runif(1)").asDouble ());

    // done...
    re.end();
  }

}
{% endhighlight %}

You should be able to compile and run it, afterwards you'll see a random number from an uniform distribution. Congratulations, well done :-P

For more information see the <a href="http://www.rforge.net/JRI/">JRI</a> and <a href="http://www.rforge.net/rJava/">rJava</a> sites at <a href="http://www.rforge.net/">RForge.net</a>.

<div class="download"><strong>Download:</strong>
Java: <a href='/wp-content/uploads/pipapo/java/JRItest.java'>JRItest.java</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
