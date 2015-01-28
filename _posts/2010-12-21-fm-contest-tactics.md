---
layout: post
title: 'FM-Contest: Tactics'
tags:
  - contest
  - explained
  - journals
  - Programming
  - trick
categories:
  - Programming
  - Software

---

As I announced in my <a href="/2010/12/created-an-ai-for-a-contest/">last</a> <a href="/2010/12/yeah-top-ten/">articles</a> I've submitted a programmed bot for the contest organized by <a href="http://www.freiesmagazin.de/">freiesMagazin</a>. Here I present my bots tactics.


The submitted bots are grouped to teams. On one hand the <span style="color:#1e7aed">BLUE</span> team, or preys, they have to run and hide. On the other hand the <span style="color:#ed1e1e">RED</span> team, or predators, their task is to catch a bot of the <span style="color:#1e7aed">BLUE</span> team. If anyone of the <span style="color:#1e7aed">BLUE</span> team got captured by a <span style="color:#ed1e1e">RED</span> team member he changes the team from <span style="color:#1e7aed">BLUE</span> to <span style="color:#ed1e1e">RED</span>. If there was no teamchange for a longer time, one of the <span style="color:#1e7aed">BLUE</span> team is forced to change. That are the simplified tasks, for more details visit their website.
All in all if you are <span style="color:#1e7aed">BLUE</span> run and hide, otherwise hunt the <span style="color:#1e7aed">BLUE</span>'s.

The map is very simple organized, there are wall-fields and floor-fields. You are neither able to access wall-fields nor to see through such fields. Floor-fields are acessible, but toxic. So they decrease your health status.
You can look in each of eight directions: NORTH, NORTH_WEST, WEST, SOUTH_WEST, SOUTH, SOUTH_EAST, EAST, NORTH_EAST. You'll only see enemies that are standing in the direction you are looking to (180&deg;) and don't hide behind a wall. Positions of your team members are told by communicators, so you'll know where your team is hanging around.
In each round you're able to walk exactly one field in one of eight directions, and you can choose where to look for the next turn.

That are the basics. How does my bot handle each situation? In general with every turn my bot tries to look in the opposite direction. To see at least every second round all see-able enemies (those that are not behind a wall).

Suppose to be a <span style="color:#1e7aed">BLUE</span> team member, my bot first checks whether it has seen a <span style="color:#ed1e1e">RED</span> one within the last rounds. If there was an enemy the bot of course has to run! That is, my bot holds a so called distance map for every opponent. This map tells my bot how many turns each opponent needs to reach a single point on the map. These distance maps are created via an adaption of Dijkstra's algorithm <a href="#Dij59">[Dij59]</a>. So in principle the bot could search for a position on the map, that it reaches before any of the enemies can reach it.
But there is a problem. Consider a room you're hiding in, that has two doors, and an enemy is entering this room through one of these doors. Finding the best field concerning these distance maps means in too many times running in the opposite direction of the enemies door. Hence, you'll reach a blind alley and drop a brick. So it might be more promising to first check the doors whether you are faster as your enemy or not and decide afterward where to go.
Unfortunately there are no doors defined on the map, but I'll explain in a next article how to parse the map.

If my bot is <span style="color:#1e7aed">BLUE</span> and no <span style="color:#ed1e1e">RED</span> bot is in sight he calls one random room out of a multinomial distribution of rooms. Here each rooms gets a score resulting from its position. The score is bigger the shorter the distance to the room and the higher the distance from this room to the center of the map (try to remain on the sidelines). These scores are normalized, you can understand them as a multinomial distribution. So the bot is searching for a room that is near and in a corner of the map. Of course random, cause enemies might search for it in optimal rooms ;-)
If that room is reached the bot will hang around there (as far away as possible from doors and at positions with minimal toxicity) until a teammate has change the team (this bot still knows where we are) or at least every 20 rounds to raise the entropy in the motion profile.
While these room changes the bot is very vulnerable to loitering enemies, but nevertheless it might be a weaker victim if it stays in one and the same room all the time...


On the other side of life, when the bot is <span style="color:#ed1e1e">RED</span>, there is no time for chilling out in a room far away from all happenings. It should be inside, not only near by.
If it's seeing a <span style="color:#1e7aed">BLUE</span> bot he's of course following and tries to catch it. Here would be space to predict flee-possibilities of our victims to cut their way. But due to a lack of time this bot is simply following it's victims.
Nobody visible? Go hunting! The bot tries to find the prey that was last seen on it's position where we've seen it. That's the next place for advantages. I'm tracking motion profiles of any opponent, here one could use these information to predict a better position for the opponents (for example using neural networks or something like this)...
If no enemy can be found my bot is canvassing all rooms of the map, trying to find anyone to catch. Within this exploration of the map it is always interested in going long ways through the map. The more rooms it's visiting the higher the probability to find someone..

Each turn is limited to a maximum of five seconds to decide what to do. In my first attempt I tried to process these tactics by threading. The idea was to hold the main tool in a loop, testing whether 5 secs are over or the AI has finished searching for a next turn. So the AI could decide for different proceedings within this time, based on scores, and this algorithm would be something like anytime. That means anytime you'll stop it there is a decision for a next step, the later you stop it the better the decision.
Due to the simplicity of my AI I decided against this procedure. So the possible actions are processed without threads. But if you take a look at the code, you'll find a lot of rudiments remaining, didn't had the leisure to clean up...


<h1>References</h1>
<dl>
 <dt><a name='Dij59'>[Dij59]</a></dt>
 	<dd>Edsger W. Dijkstra
		<em>A note on two problems in connexion with graphs</em>
		Numerische Mathematik, 1(1):269–271–271, December 1959.
		<a href="http://www-m3.ma.tum.de/twiki/pub/MN0506/WebHome/dijkstra.pdf">http://www-m3.ma.tum.de/twiki/pub/MN0506/WebHome/dijkstra.pdf</a>
 	</dd>
</dl>
