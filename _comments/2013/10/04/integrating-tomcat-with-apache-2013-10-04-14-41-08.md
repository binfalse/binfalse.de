---
date: '2013-10-04 14:41:08'
link: http://0rpheus.net
name: Michael Rennecke
post_id: /2013/10/04/integrating-tomcat-with-apache
---

I use  `mod_proxy`  for it and configure a reverse proxy. It works fine with Tomcat 6 and Apache, Nginx and HAProxy. If Tomcat talks to Apache via HTTP instead of AJP Connector, then there are some limitations like no domain model clustering and no large packages (&gt;8k)