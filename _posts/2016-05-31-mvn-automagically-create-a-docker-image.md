---
title: "mvn: Automagically create a Docker image"
layout: post
published: true
date: 2016-05-31 19:59:12 +0200
categories:
  - software
  - web
  - programming
  - snippet
tags:
  - docker
  - maven
  - ant
  - tomcat
  - java
  - bives
---

{% include image.html align='alignright' url='/assets/media/pics/2016/mvn-docker.svg' img='/assets/media/pics/2016/mvn-docker.jpg' title='Maven conjures Docker images' caption='Maven conjures Docker images' maxwidth='300px' %}
Having a Docker image of your software projects may make things easier for you, but will for sure lower the barrier for users to use your tools &mdash; at least in many cases ;-)



I am developing many tools in Java using Maven to manage dependencies. Thus, I've been looking for means to generate corresponding Docker files using the very same build management. There are already a few approaches to build Docker images through Maven, e.g. [alexec's docker-maven-plugin](https://github.com/alexec/docker-maven-plugin), and [fabric8io's docker-maven-plugin](https://github.com/fabric8io/docker-maven-plugin) ... [and so on](https://github.com/search?q=docker-maven-plugin) &mdash; just to name a few.
However, all theses solutions seem super-heavy and they require learning new syntax and stuff, while it is so easy and doesn't require any third party plugins.


## Build Docker images using maven-antrun
Maven's antrun plugin allows for execution of external commands. That means, you just need to maintain a proper Dockerfile along with your sources and after building the tool with maven you can call the docker-build command to create a Docker image of the current version of your tool.

I did that for a Java web application. The [Dockerfile](https://github.com/binfalse/BiVeS-WebApp/blob/master/src/main/docker/Dockerfile) is stored as a resource in `src/main/docker/Dockerfile` is actually very simple:

{% highlight Dockerfile %}
FROM tomcat:8-jre8
MAINTAINER martin scharm

# remove the default tomcat application
RUN rm -rf /usr/local/tomcat/webapps/ROOT /usr/local/tomcat/webapps/ROOT.war

# add the BiVeS-WebApp as the new default web app
COPY BiVeS-WS-${project.version}.war /usr/local/tomcat/webapps/ROOT.war
{% endhighlight %}

Using Maven we can make sure (i) that the Dockerfile is copied next to the compiled and packaged tool in the `target` directory, (ii) that the placeholder `${project.version}` in the Dockerfile is replaced with the current version of your tool, and (iii) that the docker-build command is invoked.


### Copy the Dockerfile to the right place
Maven's resources-plugin is ideally suited to deal with resources. To copy all Docker related resources to the `target` directory you can use the [following snippet](https://github.com/binfalse/BiVeS-WebApp/blob/0549da72eac292261207c2aaf5205b47d42d1eab/pom.xml#L126):

{% highlight xml %}
<plugin>
    <artifactId>maven-resources-plugin</artifactId>
    <executions>
        <execution>
            <id>copy-resources</id>
            <phase>validate</phase>
            <goals>
                <goal>copy-resources</goal>
            </goals>
            <configuration>
                <outputDirectory>${basedir}/target</outputDirectory>
                <resources>
                    <resource>
                        <directory>src/main/docker</directory>
                        <filtering>true</filtering>
                    </resource>
                </resources>
            </configuration>
        </execution>
    </executions>
</plugin>
{% endhighlight %}

In addition, the `<filtering>true</filtering>` part also makes sure to replace all Maven-related placeholders, just like the `${project.version}` that we've been using. Thus, this solves (i) and (ii) and after the *validate* phase we'll have a proper `target/Dockerfile`.

### Build a Docker image
Using Maven's antrun-plugin we can [call the docker tool](https://github.com/binfalse/BiVeS-WebApp/blob/0549da72eac292261207c2aaf5205b47d42d1eab/pom.xml#L148):


{% highlight xml %}
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-antrun-plugin</artifactId>
<version>1.6</version>
<executions>
  <execution>
      <phase>deploy</phase>
      <configuration>
          <target>
              <exec executable="docker">
                  <arg value="build"/>
                  <arg value="-t"/>
                  <arg value="binfalse/bives-webapp:${project.version}"/>
                  <arg value="target"/>
              </exec>
          </target>
      </configuration>
      <goals>
          <goal>run</goal>
      </goals>
  </execution>
</executions>
</plugin>
{% endhighlight %}

This executes a command like

{% highlight bash %}
docker build -t binfalse/bives-webapp:1.6.2 target
{% endhighlight %}

after the *deploy* phase.
Thus, it builds a docker image tagged with the current version of your tool. The build's context is `target`, so it will use the `target/Dockerfile` which `COPY`s the new version of your tool into the image.


### Automatically build images using a Maven profile
I created a [`docker` profile in Maven's configuration file](https://github.com/binfalse/BiVeS-WebApp/blob/0549da72eac292261207c2aaf5205b47d42d1eab/pom.xml#L116) that is active per default if there is a `src/main/docker/Dockerfile` in your repository:

{% highlight xml %}
<profile>
    <id>docker</id>
    <activation>
        <file>
            <exists>src/main/docker/Dockerfile</exists>
        </file>
    </activation>
    <build>
        <plugins>
            <plugin>
                <artifactId>maven-resources-plugin</artifactId>
                <!-- ... see above ... -->
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-antrun-plugin</artifactId>
                <!-- ... see above ... -->
            </plugin>
        </plugins>
    </build>
</profile>
{% endhighlight %}

### Bonus: Also push the new image to the Docker Hub
To also push the image you need to execute the push command:

{% highlight bash %}
docker push binfalse/bives-webapp:1.6.2
{% endhighlight %}

And due to [the `latest`-confusion of Docker](http://container-solutions.com/docker-latest-confusion/) you also should create the *latest*-alias and also push that:

{% highlight bash %}
docker tag -f binfalse/bives-webapp:1.6.2 binfalse/bives-webapp:latest
docker push binfalse/bives-webapp:latest
{% endhighlight %}

However, both is easy. Just append a few more `exec` calls in the antrun-plugin!
The [final `pom.xml` snippet can be found on GitHub.](https://github.com/binfalse/BiVeS-WebApp/blob/0549da72eac292261207c2aaf5205b47d42d1eab/pom.xml#L116)



## Supplement
The image for this article was derived from [Wikipedia's Apache Logo](https://en.wikipedia.org/wiki/File:Apache_Software_Foundation_Logo_%282016%29.svg) and [Wikipedia's Docker logo](https://en.wikipedia.org/wiki/File:Docker_%28container_engine%29_logo.png), licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
