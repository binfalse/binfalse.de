---
title: "Say »Hello« to Staticman"
layout: post
published: true
date: 2020-02-20 14:17:59 +0100
comments: on
categories:
  - config
  - publication
  - software
  - web
  - website
tags:
  - blog
  - staticman
  - explained
  - jekyll
  - yaml
  - comment
  - private
  - remote
  - git
  - social
  - trick
  - userinteraction
  - web
---


Recently, I stumbled upon [Staticman](https://staticman.net/), which seems like a nice solution for comments on static sites (such as this).
Today I implemented Staticman into [binfalse.de](https://binfalse.de/) :)


The idea is, that you have your static site version controlled at GitHub.
Then you can add the [Staticman App](https://github.com/apps/staticman-net) to your repository and add some [configuration file](https://staticman.net/docs/configuration), so Staticman knows where and how to save the comments.
Also [add a form](https://github.com/binfalse/binfalse.de/blob/40b25231f66e3838953e026f85979c6d69d4e375/_includes/comments.html#L58) to your static site, that sends the commenting user with the form values to an API page of Staticman.

Staticman will then create the necessary [YAML](https://en.wikipedia.org/wiki/YAML) files and send you a pull request to the corresponding repository.
Thus, you only need to accept the PR and your site will rebuild with the new comment.
Pretty smart I think :)


Integrating Staticman is pretty easy.
Just follow the step-by-step guide at [staticman.net/docs/index.html](https://staticman.net/docs/index.html).


In contrast to many other approaches you still own the comment and don't need to load it from some third party.
The only privacy concern is, that users need to contact the Staticman API for sending the form values.
However, that seems to be rather harmless compared to what is the default out there...
As it's still a concern, you can always use any of the other options to send comments.
I'll keep listing them above the comment form.
Thus, it's up to the user what's more convenient/important :)

If you're curious, I'd be happy if you give it a try!




