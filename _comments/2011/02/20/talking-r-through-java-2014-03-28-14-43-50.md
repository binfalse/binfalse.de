---
date: '2014-03-28 14:43:50'
link: ''
name: palex
post_id: /2011/02/20/talking-r-through-java
---

hello

i m using this configuration but when i m launching R its stop immediatly with exit code 2

i have set up  `-Djava.library.path`  correctly because before setup this, i have the error that  `jri.dll`  coulnd'nt be found.

now  have done this:



{% highlight java %}
Rengine.DEBUG = 5;

System.out.println("Starting Rengine..");
System.out.println("R_HOME =" + System.getenv("R_HOME"));
System.out.println("java.library.path =" + System.getProperty("java.library.path"));
Rengine re = new Rengine(new String[] { "--vanilla" }, false, null);
if (!re.waitForR()) {
     System.out.println("Cannot load R");
     return;
}
{% endhighlight %}



and when i m running the programm, on line  `Rengine re = new Rengine(new String[] { "--vanilla" }, false, null);` 
 it stop with exit code 2, in the console outpu i have :



{% highlight java %}
Starting Rengine..
R_HOME =D:\Users\pmancaux\Desktop\Dev\R\GNU_R\R-3.0.2\bin
java.library.path =D:\Users\pmancaux\Desktop\Dev\R\GNU_R\R-3.0.2\library\rJava\jri
Starting R...
{% endhighlight %}



i don t find any solution on internet! please help me! thanks a lot

Palex