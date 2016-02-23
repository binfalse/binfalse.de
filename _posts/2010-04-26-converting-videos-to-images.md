---
layout: post
title: 'Converting videos to images'
tags:
  - media
  - opencv
  - programming
categories:
  - cc
  - media

---

I just wanted to split a video file in each single frame and did not find a program that solves this problem. A colleague recommended <a href="http://sourceforge.net/projects/virtualdub/">videodub</a>, but when I see DLL's or a `.exe` I get insane! I've been working a little bit with <a href="http://opencv.willowgarage.com/wiki/">OpenCV</a> before and coded my own solution, containing only a few lines.

The heart of my solution consists of the following 13 lines:



{% highlight cpp %}
CvCapture *capture = cvCaptureFromAVI(video.c_str());
if (capture)
{
	IplImage* frame;
	while (frame = cvQueryFrame(capture))
	{
		stringstream file;
		file < < prefix << iteration << ".png";
		cvSaveImage(file.str ().c_str (), frame);
		iteration++;
	}
}
cvReleaseCapture( &capture );
{% endhighlight %}

<!--wordpress parser is not able to recognize shifts in c, comment debugs ;) -->

It just queries each frame of the AVI and writes it to an image file. Thus, not a big deal.

The complete code can be <a href='/wp-content/uploads/2010/04/vidsplit.cpp'>downloaded here</a>.
All you need is <a href="http://opencv.willowgarage.com/wiki/">OpenCV</a> and a C++ compiler:



{% highlight bash %}
g++ -I /usr/local/include/opencv -lhighgui -o vidsplit.out vidsplit.cpp
{% endhighlight %}



Just start it with for example:



{% highlight bash %}
./vidsplit.out --input video.avi --prefix myframes_
{% endhighlight %}



If you prefer JPG images (or other types) just change the extension string form  `.png`  to  `.jpg` .

<div class="download"><strong>Download:</strong>
C++: <a href='/wp-content/uploads/pipapo/c-cpp/vidsplit.cpp'>vidsplit.cpp</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
