---
layout: post
title: 'Credentials in Tomcat Servlets'
tags:
  - Java
  - MySQL
  - Network
  - Programming
  - Security
  - Servlet
categories:
  - HowTo
  - Java
  - Security
  - Software
  - Web

---

Storing the credentials, e.g. for a MySQL database, in the servlet code might be a bad idea.

There are some cases when you need to store some credentials, for example to connect to a MySQL database. In most of the tutorials out there you'll find something like that to connect to a database:



{% highlight java %}
Class.forName("com.mysql.jdbc.Driver");
Connection con = DriverManager.getConnection("jdbc:mysql://HOST:3306/DBNAME", "user", "password");
{% endhighlight %}



In general that isn't a security issue, since the visitor of your website are not able to access the source code of your servlet, but if you want to share your developed application with others? You need to fill the credentials with dummies, but that means to deploy a new version of your application you have to substitute the credentials in the code and you need to recompile it. And beware of submitting the correct user name and password to a <a href="http://en.wikipedia.org/wiki/Revision_control"><abbr title="version control systems">VCS<abbr></a>!

So, how to get rid of that problem? First of all, you can eliminate these credentials in the code. Create a file  `context.xml`  in the  `META-INF/`  directory of your application containing something like:



{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<Context>
  <Resource name="jdbc/YOURDB"
            auth="Container"
            type="javax.sql.DataSource"
            username="YourDbUser"
            password="YourDbPass"
            driverClassName="com.mysql.jdbc.Driver"
            url="jdbc:mysql://HOST:3306/DBNAME"
            maxActive="8"
            maxIdle="4"/>
</Context>
{% endhighlight %}



You can get access to that resource from your code with:



{% highlight java %}
Context initCtx = new InitialContext();
Context envCtx = (Context) initCtx.lookup ("java:comp/env");
DataSource ds = (DataSource) envCtx.lookup ("jdbc/YOURDB");
Connection con = ds.getConnection ();
{% endhighlight %}



Of course this doesn't solve the security issue, but you don't have to recompile your application each time you want to deploy a new version. So in the next step we'll have to put this file somewhere independent from future deployments.
Older <a href="http://tomcat.apache.org/tomcat-6.0-doc/config/context.html#Introduction">Tomcat versions</a> will automatically copy this file to  `$CATALINA_BASE/conf/[enginename]/[hostname]/`  and rename it to the context name of your app the first time you deploy the application with that file. Using Tomcat7 you can extend your <a href="http://tomcat.apache.org/tomcat-7.0-doc/config/host.html#Standard_Implementation">host container</a> by an argument  `copyXML="true"`  and <a href="http://tomcat.apache.org/tomcat-7.0-doc/config/context.html#Defining_a_context">Tomcat7</a> will also copy this file.
So you can leave the dummies in the  `context.xml`  of your application and just have to replace them in your individual Tomcat installation.
