---
title: "Jekyll throwing Strange Error at library.rb:112"
layout: post
published: true
date: 2020-02-07 18:25:25 +0100
categories:
  - software
  - web
  - website
  - administration
  - ruby
tags:
  - jekyll
  - bug
  - docker
  - fail
  - trick
  - web
---

Just had a strange error when renbuilding one of the websites I'm in charge of..
Pretty quickly it turned out, that [Jekyll](https://jekyllrb.com/) was broken..!?
[Ruby](https://www.ruby-lang.org/en/) itself was running as usual, but I couldn't even ask Jekyll for its version.

The error was very cryptic and didn't provide any hint on how to fix things.
The internet also didn't help much, that's why I'm logging it here.
I just managed to fix it by chance: A (rather unsimilar) bug report was talking about `sassc`.
As I did not have an idea on how to approach the problem, I just tried (re)installing the tool.
And it did the trick...!? Not sure why, and not sure why it wasn't installed as a dependency with Jekyll, or ...!?

However, running 

{% highlight bash %}
gem install sassc
{% endhighlight %}

did fixed it for me ([patch for the corresponding Docker image](https://github.com/binfalse/docker-jekyll/commit/9904684ea07f383428bc50b1f49c7069fc909371)).

Maybe that can be of help for somebody else?
Here is the full error that was thrown:

{% highlight bash %}
root@cb400a65d394:/jekyll# jekyll -v
/var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:112: [BUG] Illegal instruction at 0x00007f4f75159acd
ruby 2.5.7p206 (2019-10-01 revision 67816) [x86_64-linux-gnu]

-- Control frame information -----------------------------------------------
c:0026 p:---- s:0148 e:000147 CFUNC  :open
c:0025 p:0022 s:0142 e:000141 BLOCK  /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:112 [FINISH]
c:0024 p:---- s:0133 e:000132 CFUNC  :each
c:0023 p:0113 s:0129 e:000128 BLOCK  /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:109 [FINISH]
c:0022 p:---- s:0122 e:000121 CFUNC  :map
c:0021 p:0069 s:0118 e:000117 METHOD /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:99
c:0020 p:0078 s:0111 e:000110 CLASS  /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/native.rb:11
c:0019 p:0007 s:0107 e:000106 CLASS  /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/native.rb:6
c:0018 p:0014 s:0104 e:000103 TOP    /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/native.rb:5 [FINISH]
c:0017 p:---- s:0101 e:000100 CFUNC  :require_relative
c:0016 p:0021 s:0096 e:000095 TOP    /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc.rb:31 [FINISH]
c:0015 p:---- s:0093 e:000092 CFUNC  :require
c:0014 p:0110 s:0088 e:000087 METHOD /usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59
c:0013 p:0006 s:0076 e:000075 TOP    /var/lib/gems/2.5.0/gems/jekyll-sass-converter-2.0.1/lib/jekyll/converters/scss.rb:3 [FINISH]
c:0012 p:---- s:0073 e:000072 CFUNC  :require
c:0011 p:0110 s:0068 e:000067 METHOD /usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59
c:0010 p:0013 s:0056 e:000055 TOP    /var/lib/gems/2.5.0/gems/jekyll-sass-converter-2.0.1/lib/jekyll-sass-converter.rb:4 [FINISH]
c:0009 p:---- s:0053 e:000052 CFUNC  :require
c:0008 p:0110 s:0048 e:000047 METHOD /usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59
c:0007 p:0226 s:0036 e:000035 TOP    /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll.rb:206 [FINISH]
c:0006 p:---- s:0033 e:000032 CFUNC  :require
c:0005 p:0110 s:0028 e:000027 METHOD /usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59
c:0004 p:0041 s:0016 e:000015 TOP    /var/lib/gems/2.5.0/gems/jekyll-4.0.0/exe/jekyll:8 [FINISH]
c:0003 p:---- s:0013 e:000012 CFUNC  :load
c:0002 p:0132 s:0008 E:000860 EVAL   /usr/local/bin/jekyll:23 [FINISH]
c:0001 p:0000 s:0003 E:000c10 (none) [FINISH]

-- Ruby level backtrace information ----------------------------------------
/usr/local/bin/jekyll:23:in `<main>'
/usr/local/bin/jekyll:23:in `load'
/var/lib/gems/2.5.0/gems/jekyll-4.0.0/exe/jekyll:8:in `<top (required)>'
/usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll.rb:206:in `<top (required)>'
/usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/var/lib/gems/2.5.0/gems/jekyll-sass-converter-2.0.1/lib/jekyll-sass-converter.rb:4:in `<top (required)>'
/usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/var/lib/gems/2.5.0/gems/jekyll-sass-converter-2.0.1/lib/jekyll/converters/scss.rb:3:in `<top (required)>'
/usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc.rb:31:in `<top (required)>'
/var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc.rb:31:in `require_relative'
/var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/native.rb:5:in `<top (required)>'
/var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/native.rb:6:in `<module:SassC>'
/var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/native.rb:11:in `<module:Native>'
/var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:99:in `ffi_lib'
/var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:99:in `map'
/var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:109:in `block in ffi_lib'
/var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:109:in `each'
/var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:112:in `block (2 levels) in ffi_lib'
/var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb:112:in `open'

-- Machine register context ------------------------------------------------
 RIP: 0x00007f4f75159acd RBP: 0x00007ffe0bc8a260 RSP: 0x00007ffe0bc898b8
 RAX: 0x3ff0000000000000 RBX: 0x00007ffe0bc898d0 RCX: 0x00000000000003bd
 RDX: 0x00007f4f752923bd RDI: 0x00007ffe0bc898e0 RSI: 0x00007ffe0bc898d0
  R8: 0x0000557270544740  R9: 0x00007f4f75c30170 R10: 0x0000000000000000
 R11: 0x00007f4f75c80ec0 R12: 0x00007f4f752f1500 R13: 0x00007f4f74f93ff0
 R14: 0x00007ffe0bc8a2c0 R15: 0x00007ffe0bc898d0 EFL: 0x0000000000010202

-- C level backtrace information -------------------------------------------
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e7da75) [0x7f4f75e7da75]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e7dca8) [0x7f4f75e7dca8]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d431f9) [0x7f4f75d431f9]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e0b352) [0x7f4f75e0b352]
/lib/x86_64-linux-gnu/libc.so.6(0x7f4f75b2e100) [0x7f4f75b2e100]
/var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/libsass.so(0x7f4f75159acd) [0x7f4f75159acd]
/var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/libsass.so(0x7f4f75158424) [0x7f4f75158424]
/lib64/ld-linux-x86-64.so.2(0x7f4f75f8b5ba) [0x7f4f75f8b5ba]
/lib64/ld-linux-x86-64.so.2(0x7f4f75f8b6b9) [0x7f4f75f8b6b9]
/lib64/ld-linux-x86-64.so.2(0x7f4f75f8f473) [0x7f4f75f8f473]
/lib/x86_64-linux-gnu/libc.so.6(_dl_catch_exception+0x71) [0x7f4f75c28bc1]
/lib64/ld-linux-x86-64.so.2(0x7f4f75f8ed7a) [0x7f4f75f8ed7a]
/lib/x86_64-linux-gnu/libdl.so.2(0x7f4f75a4c258) [0x7f4f75a4c258]
/lib/x86_64-linux-gnu/libc.so.6(_dl_catch_exception+0x71) [0x7f4f75c28bc1]
/lib/x86_64-linux-gnu/libc.so.6(_dl_catch_error+0x2f) [0x7f4f75c28c5f]
/lib/x86_64-linux-gnu/libdl.so.2(0x7f4f75a4c995) [0x7f4f75a4c995]
/lib/x86_64-linux-gnu/libdl.so.2(dlopen+0x46) [0x7f4f75a4c2e6]
/var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi_c.so(library_initialize+0x71) [0x7f4f754b47d1] DynamicLibrary.c:124
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e63de3) [0x7f4f75e63de3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e7105f) [0x7f4f75e7105f]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e71f4b) [0x7f4f75e71f4b]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6a202) [0x7f4f75e6a202]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6eaf4) [0x7f4f75e6eaf4]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(rb_yield+0x369) [0x7f4f75e77599]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(rb_ary_each+0x3c) [0x7f4f75ce44ac]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e63de3) [0x7f4f75e63de3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e7105f) [0x7f4f75e7105f]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e71f4b) [0x7f4f75e71f4b]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e699eb) [0x7f4f75e699eb]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6eaf4) [0x7f4f75e6eaf4]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e75e64) [0x7f4f75e75e64]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75ce83dc) [0x7f4f75ce83dc]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e63de3) [0x7f4f75e63de3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e7105f) [0x7f4f75e7105f]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e71f4b) [0x7f4f75e71f4b]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e699eb) [0x7f4f75e699eb]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6eaf4) [0x7f4f75e6eaf4]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d82ab1) [0x7f4f75d82ab1]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d847d9) [0x7f4f75d847d9]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(rb_require_safe+0x9) [0x7f4f75d84959]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e63de3) [0x7f4f75e63de3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e7105f) [0x7f4f75e7105f]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e71f4b) [0x7f4f75e71f4b]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6a202) [0x7f4f75e6a202]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6eaf4) [0x7f4f75e6eaf4]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d82ab1) [0x7f4f75d82ab1]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d847d9) [0x7f4f75d847d9]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(rb_require_safe+0x9) [0x7f4f75d84959]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e63de3) [0x7f4f75e63de3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6a202) [0x7f4f75e6a202]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6eaf4) [0x7f4f75e6eaf4]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d82ab1) [0x7f4f75d82ab1]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d847d9) [0x7f4f75d847d9]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(rb_require_safe+0x9) [0x7f4f75d84959]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e63de3) [0x7f4f75e63de3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6a202) [0x7f4f75e6a202]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6eaf4) [0x7f4f75e6eaf4]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d82ab1) [0x7f4f75d82ab1]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d847d9) [0x7f4f75d847d9]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(rb_require_safe+0x9) [0x7f4f75d84959]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e63de3) [0x7f4f75e63de3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6a202) [0x7f4f75e6a202]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6eaf4) [0x7f4f75e6eaf4]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d82ab1) [0x7f4f75d82ab1]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d847d9) [0x7f4f75d847d9]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(rb_require_safe+0x9) [0x7f4f75d84959]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e63de3) [0x7f4f75e63de3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6a202) [0x7f4f75e6a202]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6eaf4) [0x7f4f75e6eaf4]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d82ab1) [0x7f4f75d82ab1]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d83078) [0x7f4f75d83078]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d8318c) [0x7f4f75d8318c]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e63de3) [0x7f4f75e63de3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e7105f) [0x7f4f75e7105f]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e71f4b) [0x7f4f75e71f4b]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6a202) [0x7f4f75e6a202]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75e6eaf4) [0x7f4f75e6eaf4]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(0x7f4f75d46ef3) [0x7f4f75d46ef3]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(ruby_exec_node+0x1d) [0x7f4f75d48d8d]
/usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5(ruby_run_node+0x1e) [0x7f4f75d4b24e]
/usr/bin/ruby2.5(0x55726f8f60eb) [0x55726f8f60eb]
/lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0xeb) [0x7f4f75b1abbb]
/usr/bin/ruby2.5(_start+0x2a) [0x55726f8f611a]

-- Other runtime information -----------------------------------------------

* Loaded script: /usr/local/bin/jekyll

* Loaded features:

    0 enumerator.so
    1 thread.rb
    2 rational.so
    3 complex.so
    4 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/encdb.so
    5 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/trans/transdb.so
    6 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/rbconfig.rb
    7 /usr/lib/ruby/2.5.0/rubygems/compatibility.rb
    8 /usr/lib/ruby/2.5.0/rubygems/defaults.rb
    9 /usr/lib/ruby/2.5.0/rubygems/deprecate.rb
   10 /usr/lib/ruby/2.5.0/rubygems/errors.rb
   11 /usr/lib/ruby/2.5.0/rubygems/version.rb
   12 /usr/lib/ruby/2.5.0/rubygems/requirement.rb
   13 /usr/lib/ruby/2.5.0/rubygems/platform.rb
   14 /usr/lib/ruby/2.5.0/rubygems/basic_specification.rb
   15 /usr/lib/ruby/2.5.0/rubygems/stub_specification.rb
   16 /usr/lib/ruby/2.5.0/rubygems/util/list.rb
   17 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/stringio.so
   18 /usr/lib/ruby/2.5.0/uri/rfc2396_parser.rb
   19 /usr/lib/ruby/2.5.0/uri/rfc3986_parser.rb
   20 /usr/lib/ruby/2.5.0/uri/common.rb
   21 /usr/lib/ruby/2.5.0/uri/generic.rb
   22 /usr/lib/ruby/2.5.0/uri/ftp.rb
   23 /usr/lib/ruby/2.5.0/uri/http.rb
   24 /usr/lib/ruby/2.5.0/uri/https.rb
   25 /usr/lib/ruby/2.5.0/uri/ldap.rb
   26 /usr/lib/ruby/2.5.0/uri/ldaps.rb
   27 /usr/lib/ruby/2.5.0/uri/mailto.rb
   28 /usr/lib/ruby/2.5.0/uri.rb
   29 /usr/lib/ruby/2.5.0/rubygems/specification.rb
   30 /usr/lib/ruby/2.5.0/rubygems/exceptions.rb
   31 /usr/lib/ruby/vendor_ruby/rubygems/defaults/operating_system.rb
   32 /usr/lib/ruby/2.5.0/rubygems/dependency.rb
   33 /usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_gem.rb
   34 /usr/lib/ruby/2.5.0/monitor.rb
   35 /usr/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb
   36 /usr/lib/ruby/2.5.0/rubygems.rb
   37 /usr/lib/ruby/2.5.0/rubygems/path_support.rb
   38 /usr/lib/ruby/vendor_ruby/did_you_mean/version.rb
   39 /usr/lib/ruby/vendor_ruby/did_you_mean/core_ext/name_error.rb
   40 /usr/lib/ruby/vendor_ruby/did_you_mean/levenshtein.rb
   41 /usr/lib/ruby/vendor_ruby/did_you_mean/jaro_winkler.rb
   42 /usr/lib/ruby/vendor_ruby/did_you_mean/spell_checker.rb
   43 /usr/lib/ruby/2.5.0/delegate.rb
   44 /usr/lib/ruby/vendor_ruby/did_you_mean/spell_checkers/name_error_checkers/class_name_checker.rb
   45 /usr/lib/ruby/vendor_ruby/did_you_mean/spell_checkers/name_error_checkers/variable_name_checker.rb
   46 /usr/lib/ruby/vendor_ruby/did_you_mean/spell_checkers/name_error_checkers.rb
   47 /usr/lib/ruby/vendor_ruby/did_you_mean/spell_checkers/method_name_checker.rb
   48 /usr/lib/ruby/vendor_ruby/did_you_mean/spell_checkers/key_error_checker.rb
   49 /usr/lib/ruby/vendor_ruby/did_you_mean/spell_checkers/null_checker.rb
   50 /usr/lib/ruby/vendor_ruby/did_you_mean/formatters/plain_formatter.rb
   51 /usr/lib/ruby/vendor_ruby/did_you_mean.rb
   52 /usr/lib/ruby/2.5.0/tsort.rb
   53 /usr/lib/ruby/2.5.0/rubygems/request_set/gem_dependency_api.rb
   54 /usr/lib/ruby/2.5.0/rubygems/request_set/lockfile/parser.rb
   55 /usr/lib/ruby/2.5.0/rubygems/request_set/lockfile/tokenizer.rb
   56 /usr/lib/ruby/2.5.0/rubygems/request_set/lockfile.rb
   57 /usr/lib/ruby/2.5.0/rubygems/request_set.rb
   58 /usr/lib/ruby/2.5.0/rubygems/util.rb
   59 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/gem_metadata.rb
   60 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/errors.rb
   61 /usr/lib/ruby/2.5.0/set.rb
   62 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph/action.rb
   63 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph/add_edge_no_circular.rb
   64 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph/add_vertex.rb
   65 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph/delete_edge.rb
   66 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph/detach_vertex_named.rb
   67 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph/set_payload.rb
   68 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph/tag.rb
   69 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph/log.rb
   70 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph/vertex.rb
   71 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/dependency_graph.rb
   72 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/state.rb
   73 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/modules/specification_provider.rb
   74 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/delegates/resolution_state.rb
   75 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/delegates/specification_provider.rb
   76 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/resolution.rb
   77 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/resolver.rb
   78 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo/modules/ui.rb
   79 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo/lib/molinillo.rb
   80 /usr/lib/ruby/2.5.0/rubygems/resolver/molinillo.rb
   81 /usr/lib/ruby/2.5.0/rubygems/resolver/activation_request.rb
   82 /usr/lib/ruby/2.5.0/rubygems/resolver/conflict.rb
   83 /usr/lib/ruby/2.5.0/rubygems/resolver/dependency_request.rb
   84 /usr/lib/ruby/2.5.0/rubygems/resolver/requirement_list.rb
   85 /usr/lib/ruby/2.5.0/rubygems/resolver/stats.rb
   86 /usr/lib/ruby/2.5.0/rubygems/resolver/set.rb
   87 /usr/lib/ruby/2.5.0/rubygems/resolver/api_set.rb
   88 /usr/lib/ruby/2.5.0/rubygems/resolver/composed_set.rb
   89 /usr/lib/ruby/2.5.0/rubygems/resolver/best_set.rb
   90 /usr/lib/ruby/2.5.0/rubygems/resolver/current_set.rb
   91 /usr/lib/ruby/2.5.0/rubygems/resolver/git_set.rb
   92 /usr/lib/ruby/2.5.0/rubygems/resolver/index_set.rb
   93 /usr/lib/ruby/2.5.0/rubygems/resolver/installer_set.rb
   94 /usr/lib/ruby/2.5.0/rubygems/resolver/lock_set.rb
   95 /usr/lib/ruby/2.5.0/rubygems/resolver/vendor_set.rb
   96 /usr/lib/ruby/2.5.0/rubygems/resolver/source_set.rb
   97 /usr/lib/ruby/2.5.0/rubygems/resolver/specification.rb
   98 /usr/lib/ruby/2.5.0/rubygems/resolver/spec_specification.rb
   99 /usr/lib/ruby/2.5.0/rubygems/resolver/api_specification.rb
  100 /usr/lib/ruby/2.5.0/rubygems/resolver/git_specification.rb
  101 /usr/lib/ruby/2.5.0/rubygems/resolver/index_specification.rb
  102 /usr/lib/ruby/2.5.0/rubygems/resolver/installed_specification.rb
  103 /usr/lib/ruby/2.5.0/rubygems/resolver/local_specification.rb
  104 /usr/lib/ruby/2.5.0/rubygems/resolver/lock_specification.rb
  105 /usr/lib/ruby/2.5.0/rubygems/resolver/vendor_specification.rb
  106 /usr/lib/ruby/2.5.0/rubygems/resolver.rb
  107 /usr/lib/ruby/2.5.0/rubygems/source/git.rb
  108 /usr/lib/ruby/2.5.0/rubygems/source/installed.rb
  109 /usr/lib/ruby/2.5.0/rubygems/source/specific_file.rb
  110 /usr/lib/ruby/2.5.0/rubygems/source/local.rb
  111 /usr/lib/ruby/2.5.0/rubygems/source/lock.rb
  112 /usr/lib/ruby/2.5.0/rubygems/source/vendor.rb
  113 /usr/lib/ruby/2.5.0/rubygems/source.rb
  114 /usr/lib/ruby/2.5.0/forwardable/impl.rb
  115 /usr/lib/ruby/2.5.0/forwardable.rb
  116 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/etc.so
  117 /usr/lib/ruby/2.5.0/fileutils.rb
  118 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/date_core.so
  119 /usr/lib/ruby/2.5.0/date.rb
  120 /usr/lib/ruby/2.5.0/time.rb
  121 /usr/lib/ruby/2.5.0/English.rb
  122 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/pathname.so
  123 /usr/lib/ruby/2.5.0/pathname.rb
  124 /usr/lib/ruby/2.5.0/logger.rb
  125 /usr/lib/ruby/2.5.0/csv.rb
  126 /usr/lib/ruby/2.5.0/json/version.rb
  127 /usr/lib/ruby/2.5.0/ostruct.rb
  128 /usr/lib/ruby/2.5.0/json/generic_object.rb
  129 /usr/lib/ruby/2.5.0/json/common.rb
  130 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/parser.so
  131 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/generator.so
  132 /usr/lib/ruby/2.5.0/json/ext.rb
  133 /usr/lib/ruby/2.5.0/json.rb
  134 /var/lib/gems/2.5.0/gems/pathutil-0.16.2/lib/pathutil/helpers.rb
  135 /var/lib/gems/2.5.0/gems/forwardable-extended-2.6.0/lib/forwardable/extended/version.rb
  136 /var/lib/gems/2.5.0/gems/forwardable-extended-2.6.0/lib/forwardable/extended.rb
  137 /usr/lib/ruby/2.5.0/find.rb
  138 /var/lib/gems/2.5.0/gems/pathutil-0.16.2/lib/pathutil.rb
  139 /var/lib/gems/2.5.0/gems/addressable-2.7.0/lib/addressable/version.rb
  140 /usr/lib/ruby/2.5.0/rubygems/bundler_version_finder.rb
  141 /var/lib/gems/2.5.0/gems/addressable-2.7.0/lib/addressable/idna/pure.rb
  142 /var/lib/gems/2.5.0/gems/addressable-2.7.0/lib/addressable/idna.rb
  143 /var/lib/gems/2.5.0/gems/public_suffix-4.0.3/lib/public_suffix/domain.rb
  144 /var/lib/gems/2.5.0/gems/public_suffix-4.0.3/lib/public_suffix/version.rb
  145 /var/lib/gems/2.5.0/gems/public_suffix-4.0.3/lib/public_suffix/errors.rb
  146 /var/lib/gems/2.5.0/gems/public_suffix-4.0.3/lib/public_suffix/rule.rb
  147 /var/lib/gems/2.5.0/gems/public_suffix-4.0.3/lib/public_suffix/list.rb
  148 /var/lib/gems/2.5.0/gems/public_suffix-4.0.3/lib/public_suffix.rb
  149 /var/lib/gems/2.5.0/gems/addressable-2.7.0/lib/addressable/uri.rb
  150 /usr/lib/ruby/2.5.0/psych/versions.rb
  151 /usr/lib/ruby/2.5.0/psych/exception.rb
  152 /usr/lib/ruby/2.5.0/psych/syntax_error.rb
  153 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/psych.so
  154 /usr/lib/ruby/2.5.0/psych/omap.rb
  155 /usr/lib/ruby/2.5.0/psych/set.rb
  156 /usr/lib/ruby/2.5.0/psych/class_loader.rb
  157 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/strscan.so
  158 /usr/lib/ruby/2.5.0/psych/scalar_scanner.rb
  159 /usr/lib/ruby/2.5.0/psych/nodes/node.rb
  160 /usr/lib/ruby/2.5.0/psych/nodes/stream.rb
  161 /usr/lib/ruby/2.5.0/psych/nodes/document.rb
  162 /usr/lib/ruby/2.5.0/psych/nodes/sequence.rb
  163 /usr/lib/ruby/2.5.0/psych/nodes/scalar.rb
  164 /usr/lib/ruby/2.5.0/psych/nodes/mapping.rb
  165 /usr/lib/ruby/2.5.0/psych/nodes/alias.rb
  166 /usr/lib/ruby/2.5.0/psych/nodes.rb
  167 /usr/lib/ruby/2.5.0/psych/streaming.rb
  168 /usr/lib/ruby/2.5.0/psych/visitors/visitor.rb
  169 /usr/lib/ruby/2.5.0/psych/visitors/to_ruby.rb
  170 /usr/lib/ruby/2.5.0/psych/visitors/emitter.rb
  171 /usr/lib/ruby/2.5.0/psych/handler.rb
  172 /usr/lib/ruby/2.5.0/psych/tree_builder.rb
  173 /usr/lib/ruby/2.5.0/psych/visitors/yaml_tree.rb
  174 /usr/lib/ruby/2.5.0/psych/json/ruby_events.rb
  175 /usr/lib/ruby/2.5.0/psych/visitors/json_tree.rb
  176 /usr/lib/ruby/2.5.0/psych/visitors/depth_first.rb
  177 /usr/lib/ruby/2.5.0/psych/visitors.rb
  178 /usr/lib/ruby/2.5.0/psych/parser.rb
  179 /usr/lib/ruby/2.5.0/psych/coder.rb
  180 /usr/lib/ruby/2.5.0/psych/core_ext.rb
  181 /usr/lib/ruby/2.5.0/psych/stream.rb
  182 /usr/lib/ruby/2.5.0/psych/json/yaml_events.rb
  183 /usr/lib/ruby/2.5.0/psych/json/tree_builder.rb
  184 /usr/lib/ruby/2.5.0/psych/json/stream.rb
  185 /usr/lib/ruby/2.5.0/psych/handlers/document_stream.rb
  186 /usr/lib/ruby/2.5.0/psych.rb
  187 /usr/lib/ruby/2.5.0/yaml.rb
  188 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/libyaml_checker.rb
  189 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/deep.rb
  190 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/parse/hexadecimal.rb
  191 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/parse/sexagesimal.rb
  192 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/parse/date.rb
  193 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/transform/transformation_map.rb
  194 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/transform/to_boolean.rb
  195 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/transform/to_date.rb
  196 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/transform/to_float.rb
  197 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/transform/to_integer.rb
  198 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/transform/to_nil.rb
  199 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/transform/to_symbol.rb
  200 /usr/lib/ruby/2.5.0/base64.rb
  201 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/transform.rb
  202 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/resolver.rb
  203 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/psych_handler.rb
  204 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/psych_resolver.rb
  205 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/safe_to_ruby_visitor.rb
  206 /var/lib/gems/2.5.0/gems/safe_yaml-1.0.5/lib/safe_yaml/load.rb
  207 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/version.rb
  208 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/parse_tree_visitor.rb
  209 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/lexer.rb
  210 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/parser.rb
  211 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/i18n.rb
  212 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/drop.rb
  213 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tablerowloop_drop.rb
  214 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/forloop_drop.rb
  215 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/extensions.rb
  216 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/errors.rb
  217 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/interrupts.rb
  218 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/strainer.rb
  219 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/expression.rb
  220 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/context.rb
  221 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/parser_switching.rb
  222 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tag.rb
  223 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/block.rb
  224 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/block_body.rb
  225 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/document.rb
  226 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/variable.rb
  227 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/variable_lookup.rb
  228 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/range_lookup.rb
  229 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/file_system.rb
  230 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/resource_limits.rb
  231 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/template.rb
  232 /usr/lib/ruby/2.5.0/cgi/core.rb
  233 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/cgi/escape.so
  234 /usr/lib/ruby/2.5.0/cgi/util.rb
  235 /usr/lib/ruby/2.5.0/cgi/cookie.rb
  236 /usr/lib/ruby/2.5.0/cgi.rb
  237 /usr/lib/x86_64-linux-gnu/ruby/2.5.0/bigdecimal.so
  238 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/standardfilters.rb
  239 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/condition.rb
  240 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/utils.rb
  241 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tokenizer.rb
  242 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/parse_context.rb
  243 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/increment.rb
  244 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/ifchanged.rb
  245 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/continue.rb
  246 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/for.rb
  247 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/include.rb
  248 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/raw.rb
  249 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/comment.rb
  250 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/if.rb
  251 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/unless.rb
  252 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/break.rb
  253 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/capture.rb
  254 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/cycle.rb
  255 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/decrement.rb
  256 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/case.rb
  257 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/assign.rb
  258 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid/tags/table_row.rb
  259 /var/lib/gems/2.5.0/gems/liquid-4.0.3/lib/liquid.rb
  260 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/version.rb
  261 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/element.rb
  262 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/error.rb
  263 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser.rb
  264 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/utils.rb
  265 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/utils/configurable.rb
  266 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/converter.rb
  267 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/options.rb
  268 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/document.rb
  269 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown.rb
  270 /var/lib/gems/2.5.0/gems/colorator-1.1.0/lib/colorator/core_ext.rb
  271 /var/lib/gems/2.5.0/gems/colorator-1.1.0/lib/colorator.rb
  272 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/constants.rb
  273 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/utility/engine.rb
  274 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/abstract_object.rb
  275 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/utility/native_extension_loader.rb
  276 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/mri_object.rb
  277 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/jruby_object.rb
  278 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/rbx_object.rb
  279 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/truffleruby_object.rb
  280 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/object.rb
  281 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/volatile.rb
  282 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/abstract_lockable_object.rb
  283 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/mutex_lockable_object.rb
  284 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/jruby_lockable_object.rb
  285 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/rbx_lockable_object.rb
  286 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/lockable_object.rb
  287 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/condition.rb
  288 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization/lock.rb
  289 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/synchronization.rb
  290 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/collection/map/non_concurrent_map_backend.rb
  291 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/collection/map/mri_map_backend.rb
  292 /var/lib/gems/2.5.0/gems/concurrent-ruby-1.1.5/lib/concurrent/map.rb
  293 /var/lib/gems/2.5.0/gems/i18n-1.8.2/lib/i18n/version.rb
  294 /var/lib/gems/2.5.0/gems/i18n-1.8.2/lib/i18n/exceptions.rb
  295 /var/lib/gems/2.5.0/gems/i18n-1.8.2/lib/i18n/interpolate/ruby.rb
  296 /var/lib/gems/2.5.0/gems/i18n-1.8.2/lib/i18n.rb
  297 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/plugin.rb
  298 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/converter.rb
  299 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/generator.rb
  300 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/command.rb
  301 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/liquid_extensions.rb
  302 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/filters/date_filters.rb
  303 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/filters/grouping_filters.rb
  304 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/filters/url_filters.rb
  305 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/filters.rb
  306 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/external.rb
  307 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/log_adapter.rb
  308 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/stevenson.rb
  309 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/drops/drop.rb
  310 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/drops/document_drop.rb
  311 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/commands/build.rb
  312 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/commands/clean.rb
  313 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/commands/doctor.rb
  314 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/commands/help.rb
  315 /usr/lib/ruby/2.5.0/erb.rb
  316 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/commands/new.rb
  317 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/commands/new_theme.rb
  318 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/commands/serve.rb
  319 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/converters/identity.rb
  320 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/converters/markdown.rb
  321 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/base.rb
  322 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/blank_line.rb
  323 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/eob.rb
  324 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/extensions.rb
  325 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/horizontal_rule.rb
  326 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/list.rb
  327 /usr/lib/ruby/2.5.0/rexml/parseexception.rb
  328 /usr/lib/ruby/2.5.0/rexml/undefinednamespaceexception.rb
  329 /usr/lib/ruby/2.5.0/rexml/encoding.rb
  330 /usr/lib/ruby/2.5.0/rexml/source.rb
  331 /usr/lib/ruby/2.5.0/rexml/parsers/baseparser.rb
  332 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/utils/entities.rb
  333 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/html.rb
  334 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/html.rb
  335 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/paragraph.rb
  336 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/block_boundary.rb
  337 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/header.rb
  338 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/blockquote.rb
  339 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/table.rb
  340 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/codeblock.rb
  341 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/escaped_chars.rb
  342 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/link.rb
  343 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/footnote.rb
  344 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/html_entity.rb
  345 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/line_break.rb
  346 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/typographic_symbol.rb
  347 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/autolink.rb
  348 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/codespan.rb
  349 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/emphasis.rb
  350 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/smart_quotes.rb
  351 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/math.rb
  352 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown/abbreviation.rb
  353 /var/lib/gems/2.5.0/gems/kramdown-2.1.0/lib/kramdown/parser/kramdown.rb
  354 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/converters/smartypants.rb
  355 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/converters/markdown/kramdown_parser.rb
  356 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/drops/collection_drop.rb
  357 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/drops/excerpt_drop.rb
  358 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/drops/jekyll_drop.rb
  359 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/drops/site_drop.rb
  360 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/drops/static_file_drop.rb
  361 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/drops/unified_payload_drop.rb
  362 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/drops/url_drop.rb
  363 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/tags/highlight.rb
  364 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/tags/include.rb
  365 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/tags/link.rb
  366 /var/lib/gems/2.5.0/gems/jekyll-4.0.0/lib/jekyll/tags/post_url.rb
  367 /var/lib/gems/2.5.0/gems/jekyll-sass-converter-2.0.1/lib/jekyll-sass-converter/version.rb
  368 /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/version.rb
  369 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi_c.so
  370 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/platform.rb
  371 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/data_converter.rb
  372 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/types.rb
  373 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/library.rb
  374 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/errno.rb
  375 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/pointer.rb
  376 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/memorypointer.rb
  377 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/struct_layout.rb
  378 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/struct_layout_builder.rb
  379 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/struct_by_reference.rb
  380 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/struct.rb
  381 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/union.rb
  382 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/managedstruct.rb
  383 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/callback.rb
  384 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/io.rb
  385 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/autopointer.rb
  386 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/variadic.rb
  387 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/enum.rb
  388 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/version.rb
  389 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi/ffi.rb
  390 /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi.rb

* Process memory map:

55726f8f5000-55726f8f6000 r--p 00000000 08:03 1049144                    /usr/bin/ruby2.5
55726f8f6000-55726f8f7000 r-xp 00001000 08:03 1049144                    /usr/bin/ruby2.5
55726f8f7000-55726f8f8000 r--p 00002000 08:03 1049144                    /usr/bin/ruby2.5
55726f8f8000-55726f8f9000 r--p 00002000 08:03 1049144                    /usr/bin/ruby2.5
55726f8f9000-55726f8fa000 rw-p 00003000 08:03 1049144                    /usr/bin/ruby2.5
55726fef0000-557270e80000 rw-p 00000000 00:00 0                          [heap]
7f4f747d7000-7f4f74801000 r--s 00000000 08:03 978828                     /lib/x86_64-linux-gnu/ld-2.29.so
7f4f74801000-7f4f74a6f000 r--s 00000000 08:03 1312054                    /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/libsass.so
7f4f74a6f000-7f4f74c2c000 r--s 00000000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f74c2c000-7f4f74edd000 r--s 00000000 08:03 1053434                    /usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5.7
7f4f74edd000-7f4f74f73000 r--p 00000000 08:03 979610                     /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
7f4f74f73000-7f4f7505c000 r-xp 00096000 08:03 979610                     /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
7f4f7505c000-7f4f750a6000 r--p 0017f000 08:03 979610                     /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
7f4f750a6000-7f4f750b1000 r--p 001c8000 08:03 979610                     /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
7f4f750b1000-7f4f750b4000 rw-p 001d3000 08:03 979610                     /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
7f4f750b4000-7f4f750b7000 rw-p 00000000 00:00 0 
7f4f750b7000-7f4f75120000 r--p 00000000 08:03 1312054                    /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/libsass.so
7f4f75120000-7f4f7528f000 r-xp 00069000 08:03 1312054                    /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/libsass.so
7f4f7528f000-7f4f752dc000 r--p 001d8000 08:03 1312054                    /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/libsass.so
7f4f752dc000-7f4f752e9000 r--p 00224000 08:03 1312054                    /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/libsass.so
7f4f752e9000-7f4f752eb000 rw-p 00231000 08:03 1312054                    /var/lib/gems/2.5.0/gems/sassc-2.2.1/lib/sassc/libsass.so
7f4f752eb000-7f4f753b6000 rw-p 00000000 00:00 0 
7f4f753b6000-7f4f753b8000 r--p 00000000 08:03 1053451                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/bigdecimal.so
7f4f753b8000-7f4f753c5000 r-xp 00002000 08:03 1053451                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/bigdecimal.so
7f4f753c5000-7f4f753c8000 r--p 0000f000 08:03 1053451                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/bigdecimal.so
7f4f753c8000-7f4f753c9000 ---p 00012000 08:03 1053451                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/bigdecimal.so
7f4f753c9000-7f4f753ca000 r--p 00012000 08:03 1053451                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/bigdecimal.so
7f4f753ca000-7f4f753cb000 rw-p 00013000 08:03 1053451                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/bigdecimal.so
7f4f753cb000-7f4f753cc000 r--p 00000000 08:03 1053453                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/cgi/escape.so
7f4f753cc000-7f4f753ce000 r-xp 00001000 08:03 1053453                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/cgi/escape.so
7f4f753ce000-7f4f753cf000 r--p 00003000 08:03 1053453                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/cgi/escape.so
7f4f753cf000-7f4f753d0000 r--p 00003000 08:03 1053453                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/cgi/escape.so
7f4f753d0000-7f4f753d1000 rw-p 00004000 08:03 1053453                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/cgi/escape.so
7f4f753d1000-7f4f753d3000 r--p 00000000 08:03 1053555                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/strscan.so
7f4f753d3000-7f4f753d6000 r-xp 00002000 08:03 1053555                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/strscan.so
7f4f753d6000-7f4f753d7000 r--p 00005000 08:03 1053555                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/strscan.so
7f4f753d7000-7f4f753d8000 ---p 00006000 08:03 1053555                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/strscan.so
7f4f753d8000-7f4f753d9000 r--p 00006000 08:03 1053555                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/strscan.so
7f4f753d9000-7f4f753da000 rw-p 00007000 08:03 1053555                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/strscan.so
7f4f753da000-7f4f753dc000 r--p 00000000 08:03 1053444                    /usr/lib/x86_64-linux-gnu/libyaml-0.so.2.0.6
7f4f753dc000-7f4f753f6000 r-xp 00002000 08:03 1053444                    /usr/lib/x86_64-linux-gnu/libyaml-0.so.2.0.6
7f4f753f6000-7f4f753fa000 r--p 0001c000 08:03 1053444                    /usr/lib/x86_64-linux-gnu/libyaml-0.so.2.0.6
7f4f753fa000-7f4f753fb000 r--p 0001f000 08:03 1053444                    /usr/lib/x86_64-linux-gnu/libyaml-0.so.2.0.6
7f4f753fb000-7f4f753fc000 rw-p 00020000 08:03 1053444                    /usr/lib/x86_64-linux-gnu/libyaml-0.so.2.0.6
7f4f75401000-7f4f75404000 r--p 00000000 08:03 1053543                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/psych.so
7f4f75404000-7f4f75408000 r-xp 00003000 08:03 1053543                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/psych.so
7f4f75408000-7f4f75409000 r--p 00007000 08:03 1053543                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/psych.so
7f4f75409000-7f4f7540a000 ---p 00008000 08:03 1053543                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/psych.so
7f4f7540a000-7f4f7540b000 r--p 00008000 08:03 1053543                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/psych.so
7f4f7540b000-7f4f7540c000 rw-p 00009000 08:03 1053543                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/psych.so
7f4f7540c000-7f4f7540e000 r--p 00000000 08:03 1053537                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/generator.so
7f4f7540e000-7f4f75413000 r-xp 00002000 08:03 1053537                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/generator.so
7f4f75413000-7f4f75415000 r--p 00007000 08:03 1053537                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/generator.so
7f4f75415000-7f4f75416000 r--p 00008000 08:03 1053537                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/generator.so
7f4f75416000-7f4f75417000 rw-p 00009000 08:03 1053537                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/generator.so
7f4f75417000-7f4f75419000 r--p 00000000 08:03 1053538                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/parser.so
7f4f75419000-7f4f7541c000 r-xp 00002000 08:03 1053538                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/parser.so
7f4f7541c000-7f4f7541d000 r--p 00005000 08:03 1053538                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/parser.so
7f4f7541d000-7f4f7541e000 ---p 00006000 08:03 1053538                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/parser.so
7f4f7541e000-7f4f7541f000 r--p 00006000 08:03 1053538                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/parser.so
7f4f7541f000-7f4f75420000 rw-p 00007000 08:03 1053538                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/json/ext/parser.so
7f4f75420000-7f4f75422000 r--p 00000000 08:03 1053542                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/pathname.so
7f4f75422000-7f4f75426000 r-xp 00002000 08:03 1053542                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/pathname.so
7f4f75426000-7f4f75428000 r--p 00006000 08:03 1053542                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/pathname.so
7f4f75428000-7f4f75429000 r--p 00007000 08:03 1053542                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/pathname.so
7f4f75429000-7f4f7542a000 rw-p 00008000 08:03 1053542                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/pathname.so
7f4f7542a000-7f4f7542d000 r--p 00000000 08:03 1053456                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/date_core.so
7f4f7542d000-7f4f75456000 r-xp 00003000 08:03 1053456                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/date_core.so
7f4f75456000-7f4f7545d000 r--p 0002c000 08:03 1053456                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/date_core.so
7f4f7545d000-7f4f7545e000 ---p 00033000 08:03 1053456                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/date_core.so
7f4f7545e000-7f4f7545f000 r--p 00033000 08:03 1053456                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/date_core.so
7f4f7545f000-7f4f75460000 rw-p 00034000 08:03 1053456                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/date_core.so
7f4f75460000-7f4f75461000 rw-p 00000000 00:00 0 
7f4f75461000-7f4f75463000 r--p 00000000 08:03 1053526                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/etc.so
7f4f75463000-7f4f75466000 r-xp 00002000 08:03 1053526                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/etc.so
7f4f75466000-7f4f75468000 r--p 00005000 08:03 1053526                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/etc.so
7f4f75468000-7f4f75469000 r--p 00006000 08:03 1053526                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/etc.so
7f4f75469000-7f4f7546a000 rw-p 00007000 08:03 1053526                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/etc.so
7f4f75483000-7f4f75487000 r--s 00000000 08:03 978850                     /lib/x86_64-linux-gnu/libdl-2.29.so
7f4f75487000-7f4f7548a000 r--p 00000000 08:03 978858                     /lib/x86_64-linux-gnu/libgcc_s.so.1
7f4f7548a000-7f4f7549b000 r-xp 00003000 08:03 978858                     /lib/x86_64-linux-gnu/libgcc_s.so.1
7f4f7549b000-7f4f7549f000 r--p 00014000 08:03 978858                     /lib/x86_64-linux-gnu/libgcc_s.so.1
7f4f7549f000-7f4f754a0000 r--p 00017000 08:03 978858                     /lib/x86_64-linux-gnu/libgcc_s.so.1
7f4f754a0000-7f4f754a1000 rw-p 00018000 08:03 978858                     /lib/x86_64-linux-gnu/libgcc_s.so.1
7f4f754a2000-7f4f754a6000 r--s 00000000 08:03 1049144                    /usr/bin/ruby2.5
7f4f754a6000-7f4f754ab000 r--p 00000000 08:03 1186360                    /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi_c.so
7f4f754ab000-7f4f754c1000 r-xp 00005000 08:03 1186360                    /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi_c.so
7f4f754c1000-7f4f754c9000 r--p 0001b000 08:03 1186360                    /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi_c.so
7f4f754c9000-7f4f754ca000 r--p 00022000 08:03 1186360                    /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi_c.so
7f4f754ca000-7f4f754cb000 rw-p 00023000 08:03 1186360                    /var/lib/gems/2.5.0/gems/ffi-1.12.2/lib/ffi_c.so
7f4f754cb000-7f4f754cd000 r--p 00000000 08:03 1053554                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/stringio.so
7f4f754cd000-7f4f754d1000 r-xp 00002000 08:03 1053554                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/stringio.so
7f4f754d1000-7f4f754d3000 r--p 00006000 08:03 1053554                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/stringio.so
7f4f754d3000-7f4f754d4000 r--p 00007000 08:03 1053554                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/stringio.so
7f4f754d4000-7f4f754d5000 rw-p 00008000 08:03 1053554                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/stringio.so
7f4f754d5000-7f4f754d6000 r--p 00000000 08:03 1053512                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/trans/transdb.so
7f4f754d6000-7f4f754d8000 r-xp 00001000 08:03 1053512                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/trans/transdb.so
7f4f754d8000-7f4f754d9000 r--p 00003000 08:03 1053512                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/trans/transdb.so
7f4f754d9000-7f4f754da000 r--p 00003000 08:03 1053512                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/trans/transdb.so
7f4f754da000-7f4f754db000 rw-p 00004000 08:03 1053512                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/trans/transdb.so
7f4f754db000-7f4f754dc000 r--p 00000000 08:03 1053469                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/encdb.so
7f4f754dc000-7f4f754dd000 r-xp 00001000 08:03 1053469                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/encdb.so
7f4f754dd000-7f4f754de000 r--p 00002000 08:03 1053469                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/encdb.so
7f4f754de000-7f4f754df000 r--p 00002000 08:03 1053469                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/encdb.so
7f4f754df000-7f4f754e0000 rw-p 00003000 08:03 1053469                    /usr/lib/x86_64-linux-gnu/ruby/2.5.0/enc/encdb.so
7f4f754e0000-7f4f755e1000 rw-p 00000000 00:00 0 
7f4f755e1000-7f4f758c6000 r--p 00000000 08:03 1064470                    /usr/lib/locale/locale-archive
7f4f758c6000-7f4f758c9000 rw-p 00000000 00:00 0 
7f4f758c9000-7f4f758d8000 r--p 00000000 08:03 978865                     /lib/x86_64-linux-gnu/libm-2.29.so
7f4f758d8000-7f4f75973000 r-xp 0000f000 08:03 978865                     /lib/x86_64-linux-gnu/libm-2.29.so
7f4f75973000-7f4f75a0c000 r--p 000aa000 08:03 978865                     /lib/x86_64-linux-gnu/libm-2.29.so
7f4f75a0c000-7f4f75a0d000 r--p 00142000 08:03 978865                     /lib/x86_64-linux-gnu/libm-2.29.so
7f4f75a0d000-7f4f75a0e000 rw-p 00143000 08:03 978865                     /lib/x86_64-linux-gnu/libm-2.29.so
7f4f75a0e000-7f4f75a10000 rw-p 00000000 00:00 0 
7f4f75a10000-7f4f75a12000 r--p 00000000 08:03 979574                     /usr/lib/x86_64-linux-gnu/libcrypt.so.1.1.0
7f4f75a12000-7f4f75a27000 r-xp 00002000 08:03 979574                     /usr/lib/x86_64-linux-gnu/libcrypt.so.1.1.0
7f4f75a27000-7f4f75a41000 r--p 00017000 08:03 979574                     /usr/lib/x86_64-linux-gnu/libcrypt.so.1.1.0
7f4f75a41000-7f4f75a42000 r--p 00030000 08:03 979574                     /usr/lib/x86_64-linux-gnu/libcrypt.so.1.1.0
7f4f75a42000-7f4f75a43000 rw-p 00031000 08:03 979574                     /usr/lib/x86_64-linux-gnu/libcrypt.so.1.1.0
7f4f75a43000-7f4f75a4b000 rw-p 00000000 00:00 0 
7f4f75a4b000-7f4f75a4c000 r--p 00000000 08:03 978850                     /lib/x86_64-linux-gnu/libdl-2.29.so
7f4f75a4c000-7f4f75a4d000 r-xp 00001000 08:03 978850                     /lib/x86_64-linux-gnu/libdl-2.29.so
7f4f75a4d000-7f4f75a4e000 r--p 00002000 08:03 978850                     /lib/x86_64-linux-gnu/libdl-2.29.so
7f4f75a4e000-7f4f75a4f000 r--p 00002000 08:03 978850                     /lib/x86_64-linux-gnu/libdl-2.29.so
7f4f75a4f000-7f4f75a50000 rw-p 00003000 08:03 978850                     /lib/x86_64-linux-gnu/libdl-2.29.so
7f4f75a50000-7f4f75a5b000 r--p 00000000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75a5b000-7f4f75ab9000 r-xp 0000b000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ab9000-7f4f75ad0000 r--p 00069000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ad0000-7f4f75ad1000 ---p 00080000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ad1000-7f4f75ad2000 r--p 00080000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ad2000-7f4f75ad3000 rw-p 00081000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ad3000-7f4f75ada000 r--p 00000000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75ada000-7f4f75ae9000 r-xp 00007000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75ae9000-7f4f75aee000 r--p 00016000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75aee000-7f4f75aef000 r--p 0001a000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75aef000-7f4f75af0000 rw-p 0001b000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75af0000-7f4f75af4000 rw-p 00000000 00:00 0 
7f4f75af4000-7f4f75b19000 r--p 00000000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f75b19000-7f4f75c60000 r-xp 00025000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f75c60000-7f4f75ca9000 r--p 0016c000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f75a50000-7f4f75a5b000 r--p 00000000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75a5b000-7f4f75ab9000 r-xp 0000b000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ab9000-7f4f75ad0000 r--p 00069000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ad0000-7f4f75ad1000 ---p 00080000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ad1000-7f4f75ad2000 r--p 00080000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ad2000-7f4f75ad3000 rw-p 00081000 08:03 979585                     /usr/lib/x86_64-linux-gnu/libgmp.so.10.3.2
7f4f75ad3000-7f4f75ada000 r--p 00000000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75ada000-7f4f75ae9000 r-xp 00007000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75ae9000-7f4f75aee000 r--p 00016000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75aee000-7f4f75aef000 r--p 0001a000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75aef000-7f4f75af0000 rw-p 0001b000 08:03 978899                     /lib/x86_64-linux-gnu/libpthread-2.29.so
7f4f75af0000-7f4f75af4000 rw-p 00000000 00:00 0
7f4f75af4000-7f4f75b19000 r--p 00000000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f75b19000-7f4f75c60000 r-xp 00025000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f75c60000-7f4f75ca9000 r--p 0016c000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f75ca9000-7f4f75caa000 ---p 001b5000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f75caa000-7f4f75cad000 r--p 001b5000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f75cad000-7f4f75cb0000 rw-p 001b8000 08:03 978842                     /lib/x86_64-linux-gnu/libc-2.29.so
7f4f75cb0000-7f4f75cb4000 rw-p 00000000 00:00 0
7f4f75cb4000-7f4f75cdd000 r--p 00000000 08:03 1053434                    /usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5.7
7f4f75cdd000-7f4f75e85000 r-xp 00029000 08:03 1053434                    /usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5.7
7f4f75e85000-7f4f75f5c000 r--p 001d1000 08:03 1053434                    /usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5.7
7f4f75f5c000-7f4f75f64000 r--p 002a7000 08:03 1053434                    /usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5.7
7f4f75f64000-7f4f75f65000 rw-p 002af000 08:03 1053434                    /usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5.7
7f4f75f65000-7f4f75f77000 rw-p 00000000 00:00 0
7f4f75f77000-7f4f75f78000 ---p 00000000 00:00 0
7f4f75f78000-7f4f75f7c000 rw-p 00000000 00:00 0
7f4f75f7c000-7f4f75f7d000 r--p 00000000 08:03 978828                     /lib/x86_64-linux-gnu/ld-2.29.so
7f4f75f7d000-7f4f75f9c000 r-xp 00001000 08:03 978828                     /lib/x86_64-linux-gnu/ld-2.29.so
7f4f75f9c000-7f4f75fa4000 r--p 00020000 08:03 978828                     /lib/x86_64-linux-gnu/ld-2.29.so
7f4f75fa4000-7f4f75fa5000 r--p 00027000 08:03 978828                     /lib/x86_64-linux-gnu/ld-2.29.so
7f4f75fa5000-7f4f75fa6000 rw-p 00028000 08:03 978828                     /lib/x86_64-linux-gnu/ld-2.29.so
7f4f75fa6000-7f4f75fa7000 rw-p 00000000 00:00 0
7ffe0b492000-7ffe0bc91000 rw-p 00000000 00:00 0                          [stack]
7ffe0bd84000-7ffe0bd87000 r--p 00000000 00:00 0                          [vvar]
7ffe0bd87000-7ffe0bd89000 r-xp 00000000 00:00 0                          [vdso]


[NOTE]
You may have encountered a bug in the Ruby interpreter or extension libraries.
Bug reports are welcome.
For details: http://www.ruby-lang.org/bugreport.html

Aborted (core dumped)
{% endhighlight %}
