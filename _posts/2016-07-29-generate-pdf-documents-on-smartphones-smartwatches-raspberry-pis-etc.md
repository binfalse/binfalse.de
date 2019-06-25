---
title: "Generate PDF documents from smartphones, smartwatches, Raspberry Pis, and everywhere.."
layout: post
published: true
date: 2016-07-29 22:56:49 +0200
categories:
  - network
  - software
  - web
  - php
  - publication
  - linuxunix
tags:
  - LaTeX
  - docker
  - latex
  - media
  - network
  - pdf
  - remote
  - smartwhatever
  - curl
---


{% include image.html align='alignright' url='/assets/media/pics/2016/TEXPILE.svg' img='/assets/media/pics/2016/TEXPILE.jpg' title='TEXPILE  &#8211; compiling LaTeX projects online' caption='TEXPILE  &#8211; compiling LaTeX projects online' maxwidth='300px' %}

I recently wanted to create a PDF file with a table of data on a device that did neither have much computational power nor disk space or any other available resources. So what are the options? Installing Word plus various add-ons? Or some Adobe-bloat? Pah.. that's not even running on big machines...  
The best option is of course LaTeX. Generating a tex document is neither storage nor time intensive. But to get proper LaTeX support you need some gigabytes of disk space available and compiling a tex document requires quite some computational time... So basically also no option for *all* devices..

If there wouldn't be ...

## The Network Way

So we could just install the LaTeX dependencies on another, more powerful machine on the network and send our documents there to get it compiled.
On that server we would have a web server running that has some scripts to

* accept the tex file,
* store it somewhere temporary,
* execute the `pdflatex` call,
* and send back the resulting PDF file.

And that's exactly what [TEXPILE](https://github.com/binfalse/TEXPILE) does! It comPILEs laTEX documents on a webserver.

To compile a LaTeX project you just need to throw it as a form-encoded HTTP POST request against the TEXPILE server and the server will reply with the resulting PDF document.
If your document project consists of multiple files, for example if you want to embed an image etc, you can create a ZIP file of all files that are necessary to compile the project and send this ZIP via HTTP POST to the TEXPILE server. In that case, however, you also need to tell TEXPILE which of the files in the ZIP container is suppossed to be the root document...

Sounds a bit scary, doesn't it? PHP? Doing an exec to cal a binary? With user-uploaded data?

If there wouldn't be ...

## The Docker Way

This approach wouldn't be cool if it doesn't follow the Docker-Hype!

We can put all of that in a Docker image and **run a TEXPILE container on whatever machine we have at hand.** I already provide a [TEXPILE Docker container over there at the Docker Hub.](https://hub.docker.com/r/binfalse/texpile/) That is, you may run a container where ever you want, you will always get the same result (#reproducibility) and you do not need to worry about attacks (#safe). Even if there is an attacke able to cheat the PHP and pdflatex tools, he will still be jailed in the Docker container that you can easily throw away every once in a while and start a new clean one...

And running a fresh container is really super easy! With docker installed you just need to call the following command:

{% highlight bash %}
docker run -it --rm -p 1234:80 binfalse/texpile
{% endhighlight %}

It will download the latest version of TEXPILE from the Docker hub (if you do not have it, yet) and run a container of it on your machine. It will also bind port `1234` of your machine to the web server of TEXPILE, so you will be able to talk to TEXPILE at `http://your.machine:1234`.

Give it a try. Just accessing it with a web browser will show you some help message.


## For Example

### Single-Document Project

Let's try an example using `curl`. Let's assume your TEXPILE container is running on a machine with the DNS name `localhost`, and let's say you forward port `1234` to the HTTP server inside the container. Then you can just send your LaTeX document `example.tex` as `project` field of a form-encoded HTTP POST request to TEXPILE:

{% highlight bash %}
curl -F project=@example.tex http://localhost:1234 > /tmp/exmaple.pdf
{% endhighlight %}

Have a look into `/tmp/exmaple.pdf` to find the PDF version of `example.tex`.



### Multi-Document Project

If you have a project that consists of multiple documents, for example tex files, images, header files, bibliography etc, then you need to ZIP the whole project before you can throw it against TEXPILE. Let's assume your ZIP container can be found in `/tmp/zipfile.zip` and the root tex-document in the container is called `example.tex`. Then you can send the ZIP container as the `project` field and the root document name as the `filename` field, as demonstrated in the following call:

{% highlight bash %}
curl -F project=@/tmp/zipfile.zip -F filename=example.tex http://localhost:1234 > /tmp/pdffile.pdf
{% endhighlight %}

If the root document is not on the top level of the archive, but for example in the `somedir` directory you need to add the directory name to the `filename` field. Just to update the `filename` parameter of the previous call to:

{% highlight bash %}
curl -F project=@/tmp/zipfile.zip -F filename=somedir/example.tex http://localhost:1234 > /tmp/pdffile.pdf
{% endhighlight %}

The resulting PDF document can then be found in `/tmp/pdffile.pdf`.


### More Examples

The GIT project over at [GitHub contains some more examples for different programming languages.](https://github.com/binfalse/TEXPILE/tree/master/example) It also comes with some sample projects, so you can give it a try without much hassle...


## Error Control

Obviously, the compilation may fail. Everyone who's every been working with LaTeX knows that. You may have an error in your tex code, or the file-upload failed, or TEXPILE's disk ran out of space, or...

Good news is that **TEXPILE was developed with these problems in mind.** TEXPILE will give you a hint on what happened in its HTTP status code. Only if everything was fine and the compilation was succesfull you'll get a [2XX status code.](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success) In this case you can expect to find a proper PDF document in TEXPILE's response  
If there was an error at any point you'll either get a [4xx status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_Error) or a [5xx status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_Error) in return. In case of an error TEXPILE of course cannot return a PDF document, but it will return an HTML document with the detailed error.
Depending on how far it has come with it's job, you'll find some error messages on the upload, or on missing parameters, and if the LaTeX compilation faile you'll even get the whole output from the pdflatex command! A lot of information that will help you debug the actual problem.



## Summary

Using TEXPILE it is super easy to generate PDF document from every device with network access.
You can for example export some sensor data as a nice table from your smartwatch, or some medic information as graphs and formulas from you fitbit, or create [tikz](http://mirrors.ctan.org/graphics/pgf/base/doc/pgfmanual.pdf)-images on a raspberry pi, you can even instantly generate new versions of an [EULA](https://en.wikipedia.org/wiki/End-user_license_agreement) on your google glasses...

TEXPILE is free software and I am always super-happy when people contribute to open tools! Thus, go ahead and

* Send comments, issues, and feature requests by creating a new ticket
* Spread the tool: Tell your friends, share your thoughts in your blog, etc.
* Propose new modifications: fork the repo -- add your changes -- send a pull request
* Contribute more example code for other languages

No matter if it's actual code extensions, more examples, bug fixes, typo corrections, artwork/icons: Everything is welcome!!
