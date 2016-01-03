---
layout: post
title: 'gem installation fails? update gcc!'
tags:
  - fail
categories:
  - cc
  - debian
  - ruby
  - software

---

Just wanted to install a <a href="https://en.wikipedia.org/wiki/Ruby_%28programming_language%29">ruby</a> package using <a href="https://en.wikipedia.org/wiki/RubyGems">gem</a>. However, I'm not a ruby dev and it took me a while to work around a certain problem with gem..



I wanted to install the <a href="https://github.com/jordansissel/fpm">Effing Package Management</a>:



{% highlight bash %}
% gem install fpm
Building native extensions.  This could take a while...
ERROR:  Error installing fpm:
        ERROR: Failed to build gem native extension.

    /usr/bin/ruby2.1 extconf.rb
*** extconf.rb failed ***
Could not create Makefile due to some reason, probably lack of necessary
libraries and/or headers.  Check the mkmf.log file for more details.  You may
need configuration options.

Provided configuration options:
        --with-opt-dir
        --without-opt-dir
        --with-opt-include
        --without-opt-include=${opt-dir}/include
        --with-opt-lib
        --without-opt-lib=${opt-dir}/lib
        --with-make-prog
        --without-make-prog
        --srcdir=.
        --curdir
        --ruby=/usr/bin/ruby2.1
        --with-ffi_c-dir
        --without-ffi_c-dir
        --with-ffi_c-include
        --without-ffi_c-include=${ffi_c-dir}/include
        --with-ffi_c-lib
        --without-ffi_c-lib=${ffi_c-dir}/lib
        --with-libffi-config
        --without-libffi-config
        --with-pkg-config
        --without-pkg-config
/usr/lib/ruby/2.1.0/mkmf.rb:456:in `try_do': The compiler failed to generate an executable file. (RuntimeError)
You have to install development tools first.
        from /usr/lib/ruby/2.1.0/mkmf.rb:541:in `try_link0'
        from /usr/lib/ruby/2.1.0/mkmf.rb:556:in `try_link'
        from /usr/lib/ruby/2.1.0/mkmf.rb:642:in `block in try_ldflags'
        from /usr/lib/ruby/2.1.0/mkmf.rb:635:in `with_ldflags'
        from /usr/lib/ruby/2.1.0/mkmf.rb:641:in `try_ldflags'
        from /usr/lib/ruby/2.1.0/mkmf.rb:1762:in `pkg_config'
        from extconf.rb:15:in `<main>'

extconf failed, exit code 1

Gem files will remain installed in /var/lib/gems/2.1.0/gems/ffi-1.9.6 for inspection.
Results logged to /var/lib/gems/2.1.0/extensions/x86_64-linux/2.1.0/ffi-1.9.6/gem_make.out
{% endhighlight %}



Especially line 35 drove me insane: <em>You have to install development tools first.</em> That made me think I need to install more <em>*-dev</em> stuff.
Took me some time to <a href="https://stackoverflow.com/a/26870276/723540">find out</a> that there was a problem with gcc! Turns out that  `gcc version 4.8.3 (Debian 4.8.3-13)`  (gcc -v) wasn't able to build the package for me. <strong>So I installed  `gcc version 4.9.1 (Debian 4.9.1-19)`  and everything worked like a charm. :)</strong>
