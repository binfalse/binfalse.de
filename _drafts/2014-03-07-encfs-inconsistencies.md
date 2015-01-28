---
layout: post
title: 'Encfs inconsistencies'
categories:
  - Junk

---

Every once in a while you need to fight encfs.


Some years ago I developed some simple cloud-like infrastructure to keep some stuff in sync.
This cloud uses unison to keep the files in sync.
Even though all nodes are administrated by myself the data is encrypted using encfs (see <a href="/2013/01/encfs-transparent-crypto-overlay/#encfscloud" title="encfs: transparent crypto overlay">encfs for the cloud</a>).
Unfortunately, in certain situations unison fails to synchronize correctly.
Usually this is not an issue, the following round almost always syncs correctly, but sometimes unison backups the file with an extension ".unison.tmp-bad" or just -bad (see the red entry in Fig. 1).

<a href="/wp-content/uploads/2014/03/encfs-inconsistency.png"><img src="/wp-content/uploads/2014/03/encfs-inconsistency-270x109.png" alt="encfs-inconsistency" width="270" height="109" class="alignright size-medium wp-image-5120" /></a>

In that case the crypto layer gets confused, because there is a file that cannot be mapped.
Thus, it cannot display the file but the higher level directory is not empty.
In the example shown in Fig. 1 the red file  `./xH,9../XQEN.../fQeir...-bad`  was created in the crypt layer and encfs is not able to display the file in the decrypt layer.
Therefore, even if you delete all files in ./dir/subdir2 you won't be able to delete ./dir/subdir2 because the corresponding folder in the crypt layer isn't empty.

Ok, fine, that's a nice problem. But ... since that probably only affects one guy with his buggy cloud:

<h2>Who Cares?</h2>
You're right, the above mentioned just effects me.
But as I've learned in the past there are plenty of scenarios with similar symptoms which might be challenging for some people.
And all the nerds out there might need a template for copy&paste.
That is why I'll collect some workarounds in this article.







Even if storage is administrated by myself I use encfs to encrypt the data.
Among others, I use this infrastructure to synchronize the code I am developing.
Moreover, even if I <del datetime="2014-03-06T11:02:28+00:00">hate</del> do not like maven I use it in certain projects and it turns out that maven loves to do things on file system level that results in inconsistencies on the encfs layer.
This, however, seems to have a similar effect as a <a href="https://bugs.launchpad.net/ubuntu/+source/encfs/+bug/160214">fixed bug</a> in encfs, but so far i haven't debugged it, yet.
However, I'm not able to reproduce the error, but sometimes, when trying to clean a project, maven fails with the following error:



{% highlight bash %}
usr@srv $ mvn clean
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Building $PROJECT
[INFO]    task-segment: [clean]
[INFO] ------------------------------------------------------------------------
[INFO] [clean:clean {execution: default-clean}]
[INFO] Deleting $PROJECT_DIR/target
[INFO] ------------------------------------------------------------------------
[ERROR] BUILD ERROR
[INFO] ------------------------------------------------------------------------
[INFO] Failed to clean project: Failed to delete $PROJECT_DIR/target/maven-archiver

[INFO] ------------------------------------------------------------------------
[INFO] For more information, run Maven with the -e switch
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 1 second
[INFO] Finished at: Thu Mar 06 16:42:16 CET 2014
[INFO] Final Memory: 8M/119M
[INFO] ------------------------------------------------------------------------
{% endhighlight %}



I am also not able to delete the target w/o maven:



{% highlight bash %}
usr@srv $ rm -rf target
rm: cannot remove ‘target/maven-archiver’: Directory not empty
{% endhighlight %}



Apparently, there are still files in the directory target/maven-archiver, even if encfs does not show them and pretends the directory is empty:



{% highlight bash %}
usr@srv $ ls -al target/maven-archiver
total 8
drwxr-xr-x 2 martin martin 4096 Mar  6 16:42 ./
drwxr-xr-x 3 martin martin 4096 Mar  6 16:44 ../
usr@srv $ find target
target
target/maven-archiver
{% endhighlight %}



Ok, so how can we nevertheless delete these files?
First we need to find the corresponding directory in the file system beyond the encfs layer.
Fortunately, both directories need to have the same inode number, which can be .. using  `stat`  for example:

usr@srv $ stat target
  File: ‘target’
  Size: 4096            Blocks: 8          IO Block: 4096   directory
Device: 17h/23d Inode: 18094773    Links: 3
Access: (0755/drwxr-xr-x)  Uid: ( 1000/  martin)   Gid: ( 1000/  martin)
Access: 2014-03-06 16:46:10.352008325 +0100
Modify: 2014-03-06 16:44:54.108008288 +0100
Change: 2014-03-06 16:44:54.108008288 +0100
 Birth: -


There you see, the  `inode`  of the directory  `target`  is branded with  `18094773` .
Next: Change to the directory rooting the encrypted files and find the directory having the same inode:

cd private/files
find . -inum 18094773
./XQENIYUt6AfPBnnuPlbQ0jLR/thcda-18ndd4B1Eho5zfxATc/GCIEbRmglt82A9VORBEOcYuw/0-tOqWk9i1OAtAMivzASgBjG

Thada, it looks like XQENIYU...ATc/GCI...Yuw/0-t...BjG is the encrypted version of the target directory in our maven project.
You can easily verify that both are the same node by touching the target directory and comparing its time stamp to the time stamp of XQENIYU...ATc/GCI...Yuw/0-t...BjG.
Well, let's see how the directory tree in XQENIYU...ATc/GCI...Yuw/0-t...BjG looks like:



<h1>References</h1>
		<dl>
		<dt><a name='SHORT'>[SHORT]</a></dt>
		<dd>WHO
		<em>TITLE</em>
		WHERE
		LINK
		</dd>
		<dt><a name=''>[]</a></dt>
		<dd>
		<em></em>


		</dd>
		</dl>

<div class="download"><strong>Download:</strong>

		<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
		</div>
