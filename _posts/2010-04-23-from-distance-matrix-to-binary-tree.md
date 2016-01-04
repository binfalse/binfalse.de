---
layout: post
title: 'From distance matrix to binary tree'
tags:
  - bioinformatics
  - clustering
  - explained
  - tree
  - university
categories:
  - bioinformatics
  - university

---

In one of our current exercises we have to prove different properties belonging to distance matrices as base of binary trees. Additionally I tried to develop an algorithm for creating such a tree, given a distance matrix.

A distance matrix $$D \in \mathbb{R}^{N,N}$$ represents the dissimilarity of $$N$$ samples (for example genes), so that the number in the i-th row j-th column is the distance between element i and j. To generate a tree of it, it is necessary to determine some attributes of the distance $$d(x,y):\mathbb{R}^n \times \mathbb{R}^n \rightarrow \mathbb{R}$$ between two elements so that it is a metric:

1. $$d(x, y) \ge 0$$ (distances are positive)
1. $$d(x, y) = 0 \Leftrightarrow x = y$$ (elements with distance 0 are identical, dissimilar elements have distances greater than 0)
1. $$d(x, y) = d(y, x)$$ (symmetry)
1. $$d(x, z) \le d(x, y) + d(y, z)$$ (triangle inequality)

Examples for valid metrics are the <a href="http://en.wikipedia.org/wiki/Euclidean_distance">euclidean distance</a> $$\sqrt{\sum_{i=1}^n (x_i-y_i)^2}$$, or the <a href="http://en.wikipedia.org/wiki/Manhattan_distance">manhattan distance</a> $$\sum_{i=1}^n \|x_i-y_i\|$$.

The following procedure is called hierarchical clustering, we try to combine single objects to cluster. At the beginning we start with $$N$$ cluster, each of them containing only one element, the intersection of this set is empty and the union contains all elements that should be clustered.

The algorithm now searches for the smallest distance in $$D$$ that is not 0 and merges the associated clusters to a new one containing all elements of both. After that step the distance matrix should be adjusted, because two elements are removed and a new one is added. The distances of the new cluster to all others can be computed with the following formula:

$$d(R, [X+Y]) = \alpha \cdot d(R,X) + \beta \cdot d(R,Y) + \gamma \cdot d(X,Y) + \delta \cdot |d(R,X)-d(R,Y)|$$

$$X, Y$$ are two clusters that should be merged, $$R$$ represents another cluster. The constants $$\alpha, \beta, \gamma, \delta$$ depend on the cluster method to use, shown in table 1.

<table>
<caption>Table 1: Different cluster methods</caption>
<tbody>
<tr>
<th>Method</th>
<th class="cen">$$\alpha$$</th>
<th class="cen">$$\beta$$</th>
<th class="cen">$$\gamma$$</th>
<th class="cen">$$\delta$$</th>
</tr>
<tr>
<td>Single linkage</td>
<td class="cen">0.5</td>
<td class="cen">0.5</td>
<td class="cen">0</td>
<td class="cen">-0.5</td>
</tr>
<tr>
<td>Complete linkage</td>
<td class="cen">0.5</td>
<td class="cen">0.5</td>
<td class="cen">0</td>
<td class="cen">0.5</td>
</tr>
<tr>
<td>Average linkage</td>
<td class="cen">0.5</td>
<td class="cen">0.5</td>
<td class="cen">0</td>
<td class="cen">0</td>
</tr>
<tr>
<td>Average linkage (weighted)</td>
<td class="cen">$$\frac{|X|}{|X| + |Y|}$$</td>
<td class="cen">$$\frac{|Y|}{|X| + |Y|}$$</td>
<td class="cen">0</td>
<td class="cen">0</td>
</tr>
<tr>
<td>Centroid</td>
<td class="cen">$$\frac{|X|}{|X| + |Y|}$$</td>
<td class="cen">$$\frac{|Y|}{|X| + |Y|}$$</td>
<td class="cen">$$-\frac{|X|\cdot|Y|}{(|X| + |Y|)^2}$$</td>
<td class="cen">0</td>
</tr>
<tr>
<td>Median</td>
<td class="cen">0.5</td>
<td class="cen">0.5</td>
<td class="cen">-0.25</td>
<td class="cen">0</td>
</tr>
</tbody>
</table>

Here $$\|X\|$$ denotes the number of elements in cluster $$X$$.

The algorithm continues with searching for the smallest distance in the new distance matrix and will merge the next two similar elements until just one element is remaining.  
Merging of two clusters in tree-view means the construction of a parent node with both clusters as children. The first clusters containing just one element are leafs, the last node is the root of the tree.

<h2>Small example</h2>
Let's create a small example from the distance matrix containing 5 clusters, see table 2.

<table>
<caption>Table 2: Start distances</caption>
<tbody>
<tr>
<th> </th>
<th>A</th>
<th>B</th>
<th>C</th>
<th>D</th>
<th>E</th>
</tr>
<tr>
<th>A</th>
<td>0</td>
<td>5</td>
<td>2</td>
<td><strong>1</strong></td>
<td>6</td>
</tr>
<tr>
<th>B</th>
<td>5</td>
<td>0</td>
<td>3</td>
<td>4</td>
<td>1.5</td>
</tr>
<tr>
<th>C</th>
<td>2</td>
<td>3</td>
<td>0</td>
<td>1.5</td>
<td>4</td>
</tr>
<tr>
<th>D</th>
<td><strong>1</strong></td>
<td>4</td>
<td>1.5</td>
<td>0</td>
<td>5</td>
</tr>
<tr>
<th>E</th>
<td>6</td>
<td>1.5</td>
<td>4</td>
<td>5</td>
<td>0</td>
</tr>
</tbody>
</table>

A and D are obviously the most similar elements in this matrix, so we merge them. To make the calculation easier we take the average linkage method to compute the new distances to other clusters:

$$d(B,[A+D]) = \frac{d(B, A) + d(B, D)}{2} = \frac{5 + 4}{2} = 4.5$$  
$$d(C,[A+D]) = \frac{d(C, A) + d(C, D)}{2} = \frac{2 + 1.5}{2} = 1.75$$  
$$d(E,[A+D]) = \frac{d(E, A) + d(E, D)}{2} = \frac{6 + 5}{2} = 5.5$$

With these values we are able to construct the new distance matrix of 4 remaining clusters, shown in table 3.

<table>
<caption>Table 3: Cluster after 1st iter.</caption>
<tbody>
<tr>
<th> </th>
<th>A,D</th>
<th>B</th>
<th>C</th>
<th>E</th>
</tr>
<tr>
<th>A,D</th>
<td>0</td>
<td>4.5</td>
<td>1.75</td>
<td>5.5</td>
</tr>
<tr>
<th>B</th>
<td>4.5</td>
<td>0</td>
<td>3</td>
<td><strong>1.5</strong></td>
</tr>
<tr>
<th>C</th>
<td>1.75</td>
<td>3</td>
<td>0</td>
<td>4</td>
</tr>
<tr>
<th>E</th>
<td>5.5</td>
<td><strong>1.5</strong></td>
<td>4</td>
<td>0</td>
</tr>
</tbody>
</table>

This matrix gives us the next candidates for clustring, B and E with a distance of 1.5.

$$d([A+D], [B+E]) = \frac{d([A+D], B) + d([A+D], E)}{2} = \frac{4.5 + 5.5}{2} = 5$$  
$$d(C,[B+E]) = \frac{d(C, B) + d(C, E)}{2} = \frac{3 + 4}{2} = 3.5$$

With the appropriate distance matrix of table 4.

<table>
<caption>Table 4: After 2nd iter.</caption>
<tbody>
<tr>
<th> </th>
<th>A,D</th>
<th>B,E</th>
<th>C</th>
</tr>
<tr>
<th>A,D</th>
<td>0</td>
<td>5</td>
<td><strong>1.75</strong></td>
</tr>
<tr>
<th>B,E</th>
<td>5</td>
<td>0</td>
<td>3.5</td>
</tr>
<tr>
<th>C</th>
<td><strong>1.75</strong></td>
<td>3.5</td>
<td>0</td>
</tr>
</tbody>
</table>

Easy to see, now we cluster [A+D] with C:

$$d([B+E], [A+C+D]) = \frac{d([B+E],C) + d([B+E],[A+D])}{2} = \frac{3.5+5}{2} = 4.25$$

and obtain a last distance matrix with table 5.

<table>
<caption>Table 4: Final matrix</caption>
<tbody>
<tr>
<th> </th>
<th>A,C,D</th>
<th>B,E</th>
</tr>
<tr>
<th>A,C,D</th>
<td>0</td>
<td><strong>4.25</strong></td>
</tr>
<tr>
<th>B,E</th>
<td><strong>4.25</strong></td>
<td>0</td>
</tr>
</tbody>
</table>

{% include image.html align="alignright" url="/wp-content/uploads/2010/04/tree.png" img="/wp-content/uploads/2010/04/tree-150x150.png" title="" caption="" %}


Needless to say, further calculations are trivial. There are only to clusters left and the combination of them gives us the final cluster containing all elements and the root of the desired tree.  
The final tree is shown in figure 1. You see, it is not that difficult as expected and ends in a beautiful image!

<h2>Remarks</h2>
If $$D$$ is defined as above there is no guarantee that edge weights reflect correct distances! When you calculate the weights in my little example you'll see what I mean. If this property is desired the distance function $$d(x,y)$$ has to comply with the condition of ultrametric inequality: $$d(x, z) \le \max {d(x, y),d(y, z)}$$.

The method described above is formally known as  <strong>agglomerative clustering</strong>, merging smaller clusters to a bigger one. There is another procedure that splits bigger clusters into smaller ones, starting with a cluster that contains all samples. This method is called <strong>divisive clustering</strong>.
