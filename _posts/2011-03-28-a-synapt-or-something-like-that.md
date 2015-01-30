---
layout: post
title: 'A Synapt - or something like that...'
tags:
  - Bioinformatics
  - explained
  - fail
  - MS
  - ugly
  - University
  - Waters
categories:
  - Bioinformatics
  - Hardware
  - Software
  - University

---

As I <a href="/2011/02/very-first-time-with-a-synapt/">mentioned</a>, our university bought a <a href="http://www.waters.com/waters/promotionDetail.htm?id=10012626">Synapt G2 HDMS</a> with an upstream <a href="http://www.waters.com/waters/nav.htm?cid=514207">2D-UPLC</a>. And what should I say, we are not amused.. But let's start with the good things.


<h1>The innovative</h1>

{% include image.html align="alignright" url="/wp-content/uploads/2011/03/installed-ims.jpg" img="/wp-content/uploads/2011/03/installed-ims-150x150.jpg" title="" caption="" %}

As far as I know Waters is the first manufacturer who joined the IMS- and QTOF-technologies to combine all well known benefits from the QTOF instruments plus the advantages of separating ions by their shape and size. They developed a Triwave technology, consisting of a trap cell, the new <abbr title="ion mobility separation">IMS</abbr> cell and a transfer cell. Trap and transfer cell are able to fragment the ions, so you can produce fragment ions before and/or after separation by ion mobility. Producing fragments is nothing new, most of the MS instruments out there are able to do so. The innovation is located at the IMS. In front of this cell you can find a Helium chamber, working as a gate. During an IMS cycle no further ions are able to pass this gate. The IMS cell itself is flooded with nitrogen. Ions that want to pass this cell interact with those nitrogen molecules, so they will slow down. The bigger the ionshape the higher the braking force of nitrogen.

{% include image.html align="alignright" url="/wp-content/uploads/2011/03/debugging-ims.jpg" img="/wp-content/uploads/2011/03/debugging-ims-150x150.jpg" title="" caption="" %}

The energy inside isn't that high that ions decay to further fragments. The energy beam transporting the ions through the IMS cell can be understood as a wave. You can define the wave height and the velocity to effectively separate your present ions. Don't ask me why the call it height and velocity, and not amplitude and frequency, but what ever ;-)
Waters provides some <a href="http://www.waters.com/waters/nav.htm?cid=10110057">videos</a> to visualize this technology, and here you can find some smart pictures of the <a href="http://www.waters.com/webassets/cms/library/docs/720002156en.pdf">Triwave system in a Synapt</a>.

If you now think about an 4m IMS cell take a look at figures 2 and 3, it's a bit more than half of a keyboard length.


{% include image.html align="alignright" url="/wp-content/uploads/2011/03/broken-ims.jpg" img="/wp-content/uploads/2011/03/broken-ims-150x150.jpg" title="" caption="" %}

The other very cool thing is their UPLC. Never seen a two-dimensional LC! In one dimension you'll find one C18 column to separate your complex sample. With this UPLC you can also trap species in columns with different pH values, so they are also separated by their different pH-column-interactions. This is really great if you want to analyze incredible complex samples.

Looking at these very cute technologies, what are we arguing about!?

<h1>The annoying</h1>
First of all, the sales process did not run as smoothly as one might expect and took a very long time. But since I wasn't involved I can't tell you anymore.

The first thing we recognized when the machine arrived was a 4kDa <abbr title="radio frequency">RF</abbr> generator. But we ordered a 8kDa generator! How could this happen? Waters guarantees that each instrument will be tested before it leaves their plant..
The next thing followed immediately. All configurations of the EPC were lost.. While delivering! Seems that the postman is a pickpocket..

And, to carry it too far, within the first tests the IMS cell crashed unrecoverably, have a look at figures 2 and 3. So we had to wait for a new one from Manchester. To also name the positives, the shipment took less then one day.

Even if some <a href="http://blogs.howstuffworks.com/2011/03/23/i-think-i-can-operate-a-mass-spectrometer-really/">innocent people</a> think they can operate a MS (who told them!? hope they got paid), it took  the technicians <strong>about six weeks to get the Synapt operating</strong>... Always arguing about <strong>nano</strong>-<abbr title="electrospray ionization">ESI</abbr>...
They had big problems to install the 2D-LC, the <strong>peaks still look freaky tailing</strong>...
(I don't want to run down the technicians, they were always very committed and tried to help us as far as possible!)

{% include image.html align="alignright" url="/wp-content/uploads/2011/03/synapt-acquire.png" img="/wp-content/uploads/2011/03/synapt-acquire-150x150.png" title="" caption="" %}

Ok, so far, all is not lost if we can operate now! But can we?

For calibration you need exact masses. Calculating masses of molecules isn't a problem for waters, but adding a proton (H<sup>+</sup>) is! Instead of a proton they add a hydrogen (H<sup>+</sup> + e<sup>-</sup>)!? Assume you want to calibrate with Leucine Enkephaline (Leu-Enk). Leu-Enk is a peptide whose sequence is Tyr-Gly-Gly-Phe-Leu (C<sub>28</sub>H<sub>37</sub>N<sub>5</sub>O<sub>7</sub>) with a mass of $$555.269297\text{u}$$.
Adding a proton results in a single charged ion with a mass of (Adam Ries told us!):
$$555.269297\text{u} + 1.007276\text{u} = 556.276573\text{u}$$
When they add a hydrogen their mass becomes:
$$555.269297\text{u} + 1.007825\text{u} = 556.277122\text{u}$$,
that's a diff of $$0.000549\text{u}$$ (it's the mass of an electron). Seems to be small, but think in <abbr title="parts per million">ppm</abbr>:
$$\frac{0.000549\text{u} \cdot 10^6 }{555.269297\text{u}} \approx 0.9887\text{ppm}$$.
<strong>A systematic discrepancy of almost 1 ppm for an instrument specified for 1 ppm precision.</strong> Just because of a calculation error! And things become even worse at higher charge states, compare to the green part of figure 4. Do we (stupid scientists) really have to help them (MS specialists) summing up?

Playing a bit with the machine we figured out, that it is not constructed for static measurements. We had to be creative to get some backpreasure. You also have to unmount the whole static source block to load the needle with sample. Yes, they have these fluidics, but we have samples of few &#956;l.
Ok, prepared the system with some more handwork for static measurments, the results were disgusting. The acquired spectra had errors of more than 50 ppm (read box in figure 4)!? Calling Waters we found out that this is a known bug... Even if the <em>acquisition-window</em> leads to believe that the machine is calibrated and provides a button to start an acquisition, <strong>acquisitions have to be started from the MassLynx sample list</strong>. Not enough hands for face palms!
It's very complicated to create a sample for each static measurement, since you have to create a new method for each sample! Also the technicians weren't able to tell us a lot about the working principle with IMS. But we, of course, want to try some things before running 9h experiments through LC just to see that the actual parameters for the IMS are crap...

Last but not least, they are not very cooperative when we call to tell them their faults...

If the policy of their company doesn't change I don't believe that we buy further instruments from Waters...
Looking at the price for the machine I think buying some big cars to impress the girls would have been a much better investment ;-)
