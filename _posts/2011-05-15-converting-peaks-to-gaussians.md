---
layout: post
title: 'Converting peaks to Gaussians'
tags:
  - analyzed
  - Bioinformatics
  - MS
  - trick
categories:
  - Bioinformatics
  - Junk
  - Private
  - University

---

Yesterday I updated the <a href="/software/iso2l/">iso2l</a>. One of the improvements is the MS mode, now it's able to display isotopic clusters as expected by MS instruments instead of only theoretical ones.
The task was to estimate a normal distribution of a theoretical isotope peak.



The accuracy of a mass spectrometry (MS) instrument is determined by its resolution. The higher the resolution the easier you can distinguish between two peaks. This is essential especially to identify isotopes. Depending on the charge state of an ion two isotopes may differ in less than 0.1 mass over charge (<em>m/z</em>). To detect the resolution of your MS instrument just select one peak and measure the width of the peak at the half height of it. This expression is called $$FWHM$$ (full width at half maximum). The resolution $$R$$ is calculated by the following equation:

$$R=\frac{m/z}{FWHM}\,$$

So you see the resolution respects the characteristics of MS instruments that peaks at higher <em>m/z</em> are wider.

Now we want to go the other way around. We have an theoretical mass of an peak and want to estimate a mass distribution as measured by an instrument. These distributions look like normal distributions, so it's obvious that we want to estimate a Gaussian $$\mathcal{N}(\mu,\,\sigma^2)$$:

$$\mathcal{N}(\mu,\,\sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{ -\frac{(x-\mu)^2}{2\sigma^2} }\,$$

It's clear that $$\mu = m/z$$ of the Peak, but we have to find sigma to have the distribution half-maximum at $$\mu \pm \frac{1}{2} FWHM$$. Since the normalization term $$\frac{1}{\sqrt{2\pi\sigma^2}}$$ doesn't matter in this case, the formula simplifies to
$$\mathcal{N}(\mu,\,\sigma^2) = e^{ -\frac{(x-\mu)^2}{2\sigma^2} }\,$$
with its maximum of 1 at $$\mu$$.
As you know $$\sigma$$ isn't affected if we move all data points by a distinct value, so let's move them by $$-\mu$$. Now the distribution has its mean at 0. The equation we have to solve is:

$$
e^{ -\frac{x^2}{2\sigma^2} } &= \frac{1}{2}\\
-\frac{x^2}{2\sigma^2}&=\ln\left(\frac{1}{2}\right)\\
x^2 &= 2\sigma^2\ln2\\
x_{1,2} &= \pm\sigma\sqrt{2\ln2}
$$

You see, the half-maximum is at $$\pm\sigma\sqrt{2\ln2}$$, with $$FWHM=2\sigma\sqrt{2\ln2}$$.
Reverse, given the $$FWHM$$ we can calculate $$\sigma$$ of the normal distribution with:

$$\sigma&=\frac{1}{2}FWHM\cdot\left(2\ln2\right)^{-\frac{1}{2}}\\
&\approx 2.35482 \cdot FWHM\,$$

Combining everything, a peak at <em>m/z</em> in an instrument with resolution $$R$$ can be approximated with a normal distribution $$\mathcal{N}(\mu,\,\sigma^2)$$ with parameters:

$$\mu &= m/z\\
\sigma&= \frac{m/z}{R \cdot 2\sqrt{2\ln2}}\,$$

You see, the higher the <em>m/z</em> the bigger is $$\sigma$$.
