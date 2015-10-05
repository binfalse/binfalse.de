---
layout: post
title: 'FM-Contest: Mappings'
tags:
  - contest
  - explained
  - journals
  - programming
  - trick
categories:
  - programming
  - software

---

<a href="/2010/12/created-an-ai-for-a-contest/">As you know</a>, I took part in the programming contest organized by <a href="http://www.freiesmagazin.de/">freiesMagazin</a>. I still presented the <a href="/2010/12/fm-contest-tactics/">tactics</a> of my bot, here is how I parse the maps.


The maps are very simple, there are just two types of fields: wall and floor. Walls aren't accessible and block views. Bots can just move through floor-fields, but these fields are toxic, so they'll decrease the health of a bot. This toxicity should be kept in mind while programming an AI, but shouldn't play any role in this article.
Here is an example how a map is presented to the bot (sample map provided by the organizers):



{% highlight bash %}
######################################################################
#               #                                                 #  #
#               #                                                    #
#               #      ################### #                      ####
#               #      #                 # #                         #
#               #      #                 # #                         #
#######   #######      #                 # #                         #
#                      # ################# ###### ####               #
#                      # #               # #          ###########    #
#######   ####         #                 # #                     #   #
#            #         # #               # #######################   #
#            #         # #################                       ##  #
#            #                                                       #
#            #                                                       #
## ##############   ################   #############      ######   ###
#              #            #                     #       #          #
#              #            #                    #        #          #
#  #### ####   #                         #      #         #          #
#  #       #   #                         #     #          #          #
#  #       #   #                         ######                      #
#  #       #   #            #                #            ######   ###
#  #       #   #            #               #                        #
#  #########   ####################################      #############
## #       #         #             #                     #           #
#          #                       #                     #           #
#          ########  #             #                     #           #
#                    #                                               #
#                    #             #                     #           #
#          #         #             #                     #           #
######################################################################
{% endhighlight %}



The number sign (#) identifies walls, spaces are floor fields.
The task is to get the bot understanding the maps topology. It's a big goal if you can split the map to areas or rooms to know whether you're in the same room as an opponent and what's the best possibility to change the room. I'll explain my statements on a very simple example:



{% highlight bash %}
#######################
#                     #
#                     #
#                     #
#                     #
#                     #
#            ##########
#            #        #
#                     #
#            #        #
#            #        #
#######################
{% endhighlight %}



You'll immediately see there are two rooms, one major one and a small lumber room at the bottom right corner of the map. But how should the bot see it!?

My first attempt was to build rooms based on horizontal and vertical histograms of wall-fields. Something like image processing.. This attempt was fast rejected, inefficient and not rely good working.

The second idea was to sample way-points to the map and building rooms based on visibility between these points. I've read that autonomous vacuum cleaners are working based on this technique ;-)

One night later I found a much better solution, it's based on divisive clustering. Starting with the whole map repeat the following steps recursively:

<ul>
	<li>Is this part of the map intersected by a wall-field?
<ul>
	<li>YES: If this part is larger than a threshold split this part of the map in four parts with ideally same size and repeat this algorithm with each part, otherwise stop</li>
	<li>NO:  We found a room! Label all its fields and try to connect it to the left, right, bottom and top if there are no walls intersecting</li>
</ul>
</li>
</ul>

If this is done, we've found the main parts of each room. After wards I try to expand each room to neighbor fields that are unlabeled and doesn't have neighbors with different labels. Fields that are connected to more than one room are doors.

To explain the idea of the algorithm I'll present the procedure on my small example. At the beginning there are of course intersecting wall-fields, so it is split into four parts. Three of them aren't intersected anymore, so they are labeled:



{% highlight bash %}
#######################
#111111111222222222222#
#111111111222222222222#
#111111111222222222222#
#111111111222222222222#
#111111111222222222222#
#333333333   ##########
#333333333   #        #
#333333333            #
#333333333   #        #
#333333333   #        #
#######################
{% endhighlight %}



Since the rooms with label 1, 2 and 3 are connected and not intersected by a wall-field, they are merged together:



{% highlight bash %}
#######################
#333333333333333333333#
#333333333333333333333#
#333333333333333333333#
#333333333333333333333#
#333333333333333333333#
#333333333   ##########
#333333333   #        #
#333333333            #
#333333333   #        #
#333333333   #        #
#######################
{% endhighlight %}



But the fourth part contains wall fields, so it is split into four more parts. Three of them are still intersected, but one gets labeled:



{% highlight bash %}
#######################
#333333333333333333333#
#333333333333333333333#
#333333333333333333333#
#333333333333333333333#
#333333333333333333333#
#333333333   ##########
#333333333   #        #
#333333333       44444#
#333333333   #   44444#
#333333333   #   44444#
#######################
{% endhighlight %}



Splitting the remaining parts give to small rooms, so they are rejected by the size-threshold.
So we try to expand the found rooms and end in the following situation:



{% highlight bash %}
#######################
#333333333333333333333#
#333333333333333333333#
#333333333333333333333#
#333333333333333333333#
#333333333333333333333#
#333333333333##########
#333333333333#44444444#
#333333333333D44444444#
#333333333333#44444444#
#333333333333#44444444#
#######################
{% endhighlight %}



Here  `D`  represents a door. Doors are saved separately to remember how rooms are connected and know the possibilities of fleeing out of a room if a predator comes in to catch you...

All this parsing is done in a separate thread, so the bot is able to do it's work even if the maps are large and take a long time to parse...
Of course here is a lot of space for improvements, but for this contest it is enough I think.

Unfortunately I cant recommend further readings, I don't know any previous work like this.
