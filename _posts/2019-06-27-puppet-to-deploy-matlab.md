---
title: "Puppet to deploy Matlab"
layout: post
published: true
date: 2019-06-27 15:30:10 +0200
categories:
  - network
  - software
  - university
  - administration
  - windows
  - config
  - howto
  - ruby
tags:
  - matlab
  - puppet
  - config
  - network
  - ruby
  - remote
  - science
  - university
---

{% include image.html align='alignright' url='/assets/media/commons/Matlab_Logo-Puppet_Logo.svg' img='/assets/media/commons/Matlab_Logo-Puppet_Logo.png' title='Merge of Puppet Logo [Puppet_Logo.svg, Public domain] and MathWorks, Inc. [Matlab_Logo.svg, CC0], via Wikimedia Commons' caption='Merge of Puppet Logo [Puppet_Logo.svg, Public domain] and MathWorks, Inc. [Matlab_Logo.svg, CC0], via Wikimedia Commons' maxwidth='300px' %}

If you're coming from a scientific environment you've almost certainly heard of [Matlab,](https://en.wikipedia.org/wiki/MATLAB) haven't you?
This brutally large software blob that can do basically all the math magic for people with minimal programming skills ;-)

However, in a scientic environment you may need to deploy that software to a large number [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows) PCs.
And lazy admins being lazy... We have tools for that! For example [Puppet](https://puppet.com/).


## Deployment

Here I assume that you have a network license server somewhere in your local infrastructure.
And I further assume that you already know how to install Matlab manually by answering all the questions in the installer [GUI](https://en.wikipedia.org/wiki/Graphical_user_interface) - so that you'll end up with a working Matlab installation.


### 0. What we need

To deploy Matlab we need to have a few things ready:

* the Matlab binaries. They typically come in form of two [DVD](https://en.wikipedia.org/wiki/DVD) images in [ISO](https://en.wikipedia.org/wiki/ISO_image) format.
* a license key, which typically looks like a large number of integers seperated by dashes `12345-67890-12343-....`
* a license file, that contains information on the license server etc
* a puppet manifest - I'll assume it's called `MODULE/manifests/matlab.pp`
* a directory that is shared through Puppet - I will assume it's the `/share/` directory. Configure that for example in `/etc/puppetlabs/puppet/fileserver.conf` using:

{% highlight ini %}
[share]
    path /share/
    allow *
{% endhighlight %}


### 1. Unpack the Matlab files

We need to extract the Matlab binaries from both ISO images.
There are many ways to access the files, eg. 

* open the files with a archive manager

{% highlight bash %}
xarchiver /path/to/matlab.iso
{% endhighlight %}

* mount them using loop devices

{% highlight bash %}
mount -o loop /path/to/matlab.iso /mnt
{% endhighlight %}

* or "uncompress" them using 7zip

{% highlight bash %}
7z x /path/to/matlab.iso
{% endhighlight %}

Whatever you're using, you need to merge all the files of both images into a single directory, including the two hidden files `.dvd1` and `.dvd2`!
The target directory should be shared through Puppet.
So move all files to `/share/matlab/`. If there is now a file called `/share/matlab/.dvd1` and another file `/share/matlab/.dvd2` on your system chances are good that you're all set up :)

**Afterwards, also put the license file into that directory** (it's typically called `license.dat`, save it as `/share/matlab/license.dat`).


### 2. Prepare an input file for the installer

Ever installed Matlab?
It will ask a lot of questions..
But we can avoid those, by giving the answers in a file called `installer_input.txt`!
You will find a skeleton in `/share/matlab/installer_input.txt`.
Just copy that file to your module's template directory and postfix it with `.erb` -> this will make it a template for our module.
Go through that `MODULE/templates/installer_input.txt.erb` file and replace static settings with static strings, and variable settings with [ERB syntax.](https://puppet.com/docs/puppet/5.3/lang_template_erb.html) You should have at least the following lines in that file:


{% highlight bash %}
## SPECIFY INSTALLATION FOLDER
destinationFolder=<%= @matlab_destination %>

## SPECIFY FILE INSTALLATION KEY 
fileInstallationKey=<%= @matlab_licensekey %>

## ACCEPT LICENSE AGREEMENT  
agreeToLicense=yes

## SPECIFY INSTALLER MODE 
mode=silent

## SPECIFY PATH TO LICENSE FILE (Required for network license types only)
licensePath=<%= @matlab_licensepath %>
{% endhighlight %}

We'll fill the variables in the module's manifest.



### 3. Prepare the installation

Go ahead and open `MODULE/manifests/matlab.pp` in your preferred editor.

First, we need to define a few variables (a) for the `installer_input.txt.erb` template and (b) for the rest of the manifest:


{% highlight ruby %}
$matlabid = "2018b"
$matlab_installpath = "C:\\tmp\\install\\matlab${matlabid}"
$matlab_installer = "${matlab_installpath}\\setup.exe"
$matlab_licensepath = "${matlab_installpath}\\license.dat"
$matlab_licensekey = "12345-67890-12343-...."
$matlab_input = "C:\\tmp\\install\\matlab-installer_input.txt"
$matlab_destination = "C:\\Program Files\\MATLAB\\R${matlabid}"
{% endhighlight %}

I guess that is all self-explanatory?
Here, we're installing a Matlab version `2018b`.
We'll download the shared Matlab files to `C:\\tmp\\install\\matlab2018b`.
And we'll expect the installed Matlab tool in `C:\\Program Files\\MATLAB\\R${matlabid}`

So let's go and copy all the files from Puppet's share:


{% highlight ruby %}
file { "install files for matlab":
    ensure => present,
    path => $matlab_installpath,
    source => "puppet:///share/matlab",
    recurse      => true,
    notify => Package["MATLAB R${matlabid}"],
    require => File["C:\\tmp\\install"],
}
{% endhighlight %}

So we're downloading `puppet:///share/matlab` to `$matlab_installpath` (=`C:\\tmp\\install\\matlab${matlabid}`).
This requires the directory `C:\\tmp\\install` to be created beforehand. So make sure you created it, eg using:

{% highlight ruby %}
file { "C:\\tmp":
    ensure => directory,
}
file { "C:\\tmp\\install":
    ensure => directory,
    require => File["c:\\tmp"]
}
{% endhighlight %}


Next we'll create the installer input file based on our template:


{% highlight ruby %}
file { $matlab_input:
    content => template('MODULE/installer_input.txt.erb'),
    ensure => present,
    require => File["install files for matlab"],
    notify => Package["MATLAB R${matlabid}"],
}
{% endhighlight %}

This will basically read our `installer_input.txt.erb`, replace the variables with our settings above, and write it to `$matlab_input` (=`C:\\tmp\\install\\matlab-installer_input.txt`).

That's it. We're now ready to tell Puppet how to install Matlab!


### 4. Launch the installer

The installation instructions can be encoded by a final [*package* block](https://puppet.com/docs/puppet/5.3/types/package.html) in the manifest:


{% highlight ruby %}
package { "MATLAB R${matlabid}":
    ensure => installed,
    source => "$matlab_installer",
    require => [
        File[$matlab_input],
        File["install files for matlab"]
    ],
    install_options => ['-inputFile', $matlab_input],
}
{% endhighlight %}

Thus, if `MATLAB R${matlabid}` is not yet installed on the client machine, Puppet will run

{% highlight bash %}
$matlab_installer -inputFile $matlab_input
{% endhighlight %}

which will expand with our variable-setup above to

{% highlight powershell %}
C:\tmp\install\matlab2018b\setup.exe -inputFile C:\tmp\install\matlab-installer_input.txt
{% endhighlight %}

All right, that's it.
Just assign this module to your clients and they will start installing Matlab automagically :)

