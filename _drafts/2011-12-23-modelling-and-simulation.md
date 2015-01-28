---
layout: post
title: 'Modeling and simulation'
categories:
  - Junk

---

Some days ago I spent 2 weeks in <a href="http://en.wikipedia.org/wiki/Reims">Reims</a> in <strong><span style="color:#fff;background-color:#002395">Fr</span><span style="background-color:#fff">an</span><span style="color:#fff;background-color:#ed2939">ce</span></strong> to learn something about molecular dynamics. The group of <a href="http://www.linkedin.com/pub/manuel-dauchez/10/720/57b">Manuel Dauchez</a> kindly included me, and <a href="http://www.pomeslab.com/StephanieBaud.html">Stéphanie Baud</a> was my very responsible supervisor.

Reims is a very nice place. It's like a large village. The city is about 46.9 km<sup>2</sup> in size, but the population density is only about 4k people per km<sup>2</sup> (that's small in comparison with e.g. Paris with 21k people per km<sup>2</sup>). Since I previously visited Paris for some nights I was glad that there isn't that much trouble and traffic in Reims ;-)

The reason why I went to Reims was of course a scientific one. While analyzing our MS data we found a peptide with a proline that is sometimes hydroxylated. The ratio of hydroxylation versus non-hydroxylation changes between different samples from 1 to 20 and we were not able to explain it nor could we see any associations with the age or something like that. So we decided to try to <strong>model it and have a look at its molecular dynamics</strong>, together with some specialists in this topic. My supervisor <a href="https://twitter.com/#!/elastin2ms">Dr. Christian Schmelzer</a> fortunately organized some money to realize the trip abroad. (profoundly grateful!)

Arriving at Reims the problem I wanted to solved turned out to be more than complex! Innocent as I am I thought about just telling the amino acid sequence to a program and asking it for some dynamics. But of course it wasn't that easy ;-)
First of all I had to learn lots of stuff about forcefields, energies, models and something like that. To keep some things I'll try to collect a few short notes and scripts about <em>how to create a molecule</em>, <em>how to define a force field for it</em> or <em>how to simulate dynamics</em>... Maybe it's also interesting for you...



<h2>Creating a peptide</h2>
Ok, of course before you can simulate something you have to create it! Later on we'll work with GROMACS, so the easiest way is to create peptides in  `.pdb`  (<a href="http://en.wikipedia.org/wiki/Protein_Data_Bank_%28file_format%29">Protein Data Bank</a>) file format. There are different tools you can use, eg. <a href="http://roselab.jhu.edu/~raj/Manuals/ribosome.html">Ribosome</a> or <a href="http://www.pymol.org/">PyMol</a>. PyMol is a graphical front end to view and build molecules. You can create amino acids and peptides easily with drag & drop and by clicking some buttons. Ribosome doesn't come with a <a href="http://en.wikipedia.org/wiki/Graphical_user_interface">GUI</a>, and is less powerful, but creating peptides is also very simple. If you are working remotely you might don't want to tunnel a GUI, so here is a short explanation of how to create a protein using Ribosome:
<ol>
	<li><strong>Create a  `.rib`  file.</strong> That's the input for Ribosome, here you define the primary structure of your peptide. It's simply the series of residues:


{% highlight bash %}
TITLE MY_PEPTIDE
# Here we build AGIPGVGPF
default extended

res ace
res ala
res gly
res ile
res hyp
res gly
res val
res gly
res pro
res phe
res nh2
{% endhighlight %}


You see we added some termini (<em>ace</em> and <em>nh2</em>) to the start/end to inhibit unmeant interactions.
</li>
	<li><strong>Build the  `.pdb`  file.</strong> You just need to run Ribosome like that:



{% highlight bash %}
ribosome P.rib P.pdb res.zmat
{% endhighlight %}



 `P.rib`  is the previous created file with residues and  `P.pdb`  the desired output file name.</li>
</ol>

In  `res.zmat`  the residues are defined (at least the common amino acids). You'll find this file somewhere in the ribosome installation (for me it was in  `src/res.zmat` ). If you need further residues for your peptide you have to define them on your own. For example I also needed <strong>4-hydroxyproline</strong>, so I added another residue to this  `zmat`  file:



{% highlight bash %}
#
# 4-hydroxyproline
#
name hyp numatm 15
n      1.343  117.800  180.000   -3   -2   -4 + none
ca     1.454  123.500  180.000    1   -3   -2 + omega
c      1.531  111.800  -79.100    2    1   -3 + phi
o      1.230  120.500  137.000    3    2    1 + psi
cb     1.532  104.900 -120.400    2    1    3 + chi0
cg     1.529  103.600   29.200    5    2    1 + chi1
cd2    1.529  103.100  -33.700    6    5    2 + chi2
ha     1.092  110.800 -117.500    2    1    5 - none
1hb    1.091  112.900  121.900    5    2    6 - none
2hb    1.091  109.000  122.400    5    2    9 - none
1hg    1.091  112.100  118.900    6    5    7 - none
1hd    1.091  110.300  147.400    7    6    5 - none
2hd    1.091  109.300  121.200    7    6   13 - none
od1    1.430  275.000  -30.000    6    5    2 + none
hd1    1.366  119.871  180.000   15    6    5 - none
{% endhighlight %}



The syntax is very simple, the first row defines the name and the number of atoms of amino acid. Each following row represents an atom of your residue and has nine columns. In the first column you define the <strong>id</strong> of this atom, shouldn't be too curious, needed later. The second column gives the <strong>distance to the neighbor</strong> atom defined in column 5. Third column is the <strong>angle in degrees</strong> between this atom, the neighbor of column 5 and the atom from column 6. And column 4 finally defines the <strong>dihedrals</strong> of this atom and the atoms from column 5, 6 and 7. Column 8 tells Ribosome whether this atom should be printed or not, hydrogens are commonly left out. The line is finished with column 9, something special we are currently not interested in.
Here for example is my Ribosome definition of the additional $$O$$ in hydrpxyproline:



{% highlight bash %}
od1     1.430  275.000  -30.000    6    5    2 + none
{% endhighlight %}



That means this $$O$$ has a distance of 1.43 Å to atom number 6 &#8801; $$C_\\gamma$$, The angle between $$O$$, $$C_\\gamma$$ and 5 &#8801; $$C_\\beta$$ is 275° and the dihedrals are defined between $$O$$, $$C_\\gamma$$, $$C_\\beta$$ and 2 &#8801; $$C_\\alpha$$ with -30°.
Here is a small image of my little hydroxy proline after it was converted to a  `.pdb`  file (graphics created with PyMol):

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/10/hydroxyproline-org-pymol.png" img="/wp-content/uploads/2011/10/hydroxyproline-org-pymol.png" title="" caption="" %}

and my whole protein looks like this (can you locate the proline and the hydroxyproline?):

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/10/hyp-org-ppymol.png" img="/wp-content/uploads/2011/10/hyp-org-ppymol.png" title="" caption="" %}

So we have a  `.pdb`  representation of our peptide and can continue with GROMACS.


<h2>Creating a force field</h2>
Now we start using <a href="http://www.gromacs.org/">GROMACS</a> (<strong>GRO</strong>ningen <strong>MA</strong>chine for <strong>C</strong>hemical <strong>S</strong>imulations). GROMACS is a molecular dynamics simulation package initially build at the University of Groningen. You can install it from binaries or sources found on its <a href="http://www.gromacs.org/Downloads">website</a>, or if you're sitting in front of a Debian/Ubuntu/alike you can also install it as usual from your <a href="http://packages.debian.org/search?keywords=gromacs">repository</a>.

Your peptide is build more or less stupid, by just stringing together some amino acids. Of course the energy in this representation is nothing but ideal, some atoms are yet too near so they will reject each other, other ones are just to far away... The first thing we need to do is to minimize the energy of this molecule.
To minimize the energy you have to define a force field. GROMACS already knows some popular force fields, you might have heard about <a href="http://en.wikipedia.org/wiki/AMBER">AMBER</a> (<strong>A</strong>ssisted <strong>M</strong>odel <strong>B</strong>uilding with <strong>E</strong>nergy <strong>R</strong>efinement) <a href="#AMB">[AMB]</a> or <a href="http://en.wikipedia.org/wiki/CHARMM">CHARMM</a> (<strong>C</strong>hemistry at <strong>HAR</strong>vard <strong>M</strong>acromolecular <strong>M</strong>echanics) <a href="#CHA">[CHA]</a>? These force fields are ready to use for the most common molecules.
But since I want to model a peptide containing hydroxyproline with <a href="http://en.wikipedia.org/wiki/OPLS">OPLS</a> (<strong>O</strong>ptimized <strong>P</strong>otential for <strong>L</strong>iquid <strong>S</strong>imulations) <a href="#OPL">[OPL]</a> I have to define the forcefield for this <em>unknown</em> residue. Creating a forcefield is a very complex and crucial act. You have to consider a lot of things like charges, angles, dihedrals, bonds and something like this. I recommend to check how other amino acids are defined and try to copy some things.
My challenge was more or less easy because proline is still well defined and hydroxyproline just comes with one more $$O$$. But of course I had to go the whole way and will describe all steps during the definition of a new residue. (Of course all definitions are without guarantee of correctness!)

I recommend to copy the whole  `oplsaa.ff`  folder (found in your GROMACS installation) to your working directory. GROMACS will find and use it, and if you break something there is still the working original. For this article I copied the original OPLS-AA force field to  `./oplsaamod.ff/` , so the force field I need to specify is  `oplsaamod` .

<h4>Define the new residue</h4>
First you need to name your new residue in the  `residuetypes.dat`  of your GROMACS installation (e.g.  `/usr/share/gromacs/top/residuetypes.dat`  if you installed it from repository). Simply create a new line and add something like that:



{% highlight bash %}
HYP	Protein
{% endhighlight %}



Of course  `HYP`  is the identifier and  `Protein`  tells GROMACS that it is a protein ;-)
Other types may be  `DNA`  or  `RNA`  or simply  `SOL`  for water.

Ok, lets go on describing our new  `HYP` !

<h4>Creating the topology</h4>
The next thing you have to do is the characterization of the charges of this residue. That's a crucial step, because you define the forcefield. Thus, everything you'll see afterwards depends on the properness of your definition here. One way may be to analyze similar molecules to derive your one from it. A better solution would be some <a href="http://en.wikipedia.org/wiki/Ab_initio">ab initio</a> calculations. But since we only had a few days these calculation would blow up our schedule.
 We first thought of taking phenol as a template, but its ring is unfortunately unsaturated. This would cause some unforeseeable inaccuracies.
Since the addition of  `OH`  is comparable with alcohols we decided to model the hydroxyproline as an alcohol. So we had to create another residue in the  `oplsaa.ff/aminoacids.rtp` :



{% highlight bash %}
[ HYP ]
 [ atoms ]
     N    opls_239   -0.140     1    
    CA    opls_246    0.010     1    
    HA    opls_140    0.060     1    
    CB    opls_136   -0.120     2    
   HB1    opls_140    0.060     2    
   HB2    opls_140    0.060     2    
    CG    opls_158    0.205     3    
   HG1    opls_140    0.060     3    
   OD1    opls_154   -0.683     3    
   HD1    opls_155    0.418     3    
   CD2    opls_245   -0.050     4    
  HD21    opls_140    0.060     4    
  HD22    opls_140    0.060     4    
     C    opls_235    0.500     5    
     O    opls_236   -0.500     5    
 [ bonds ]
     N    CA   
    CA    HA   
    CA    CB   
    CA     C    
    CB   HB1  
    CB   HB2  
    CB    CG   
    CG   HG1  
    CG   OD1  
   OD1   HD1  
    CG   CD2  
   CD2  HD21 
   CD2  HD22 
   CD2     N    
     C     O    
    -C     N    
 [ impropers ]
    -C    CA     N   CD2    improper_Z_N_X_Y-
    CA    +N     C     O    improper_O_C_X_Y-
{% endhighlight %}



As you see, the definition starts with the description of the atoms. Each row contains an identifier of the atom (should be the same as you used for your previous definition in Ribosome), a description of the atom (the  `opls_XYZ`  stuff), some charges you calculated for this atom and its charge group.
In the next section you need to define <em>all</em> bonds! If you forget one of it your molecule will break at this position. Also take care to use the right identifiers!
Last but not least in  `[ impropers ]`  you indicate where the peptide bond would take place.
In some cases it might be useful to also define the dihedrals, so you can create another section. But please have a look at the other still defined residues, I won't describe it here.

<h4>Optional H-Bonds</h4>
In the  `oplsaa.ff/aminoacids.hdb`  you also have to define H-atoms that might not be defined in the  `.pdb`  file (in common obviously hydrogen atoms are left out in  `.pdb`  files). The syntax is very easy, the first line contains the residue and the number of hydrogens that might be added. This line is followed by each Hydrogen to add. For a more exactly explanation you are referred to the GROMACS manual <a href="#GRO">[GRO]</a>. Here is how it looks like for hydroxyproline (again take care for the correct notation of the identifiers!):



{% highlight bash %}
HYP     5       
1   5   HA  CA  N   C   CB
2   6   HB  CB  CG  CA
1   5   HG1 CG  CD2 CB  CA
2   6   HD2 CD2 N   CG
1   2   HD1 OD1 CG  CD2
{% endhighlight %}




<h4>Bonds, Angles and Dihedrals</h4>
Next thing on our todo-list is the construction of angles between the atoms. All this is done in  `oplsaa.ff/ffbonded.itp` . Most of the bonds and angles are still defined, but if your new residue uses some extraordinary one you need to look at this file. If you forgot to define one of them GROMACS will tell you your fault with some errors about angles or Ryckaert-Belleman ;-)



<h2>Converting to GROMACS</h2>
GROMACS itself unfortunately cannot read  `.pdb`  files. But fortunately it comes with a converter! To convert a  `.pdb`  file to a GROMACS-readable file you could use  `pdb2gmx` :



{% highlight bash %}
pdb2gmx -f P.pdb -o pep.start.gro -p peptide.top -water tip3 -ter -ff oplsaamod
{% endhighlight %}



This will create the representation of the molecule in GROMACS compatible format in  `pep.start.gro` , a topology of your molecule in  `peptide.top` . The water model we will use is  `tip3`  (optimized for OPLS-AA, available for in the <a href="#apa">appendix</a> section) and everything will be done using the  `oplsaamod`  forcefield.  `-ter`  tells the script that we want to choose the termini on our own, here we'll choose  `3`  (none), because we still added the termini with Ribosome.


<h2>Energy minimization</h2>
Now we have everything to start using GROMACS and to minimize the energy of our molecule. Each calculation of GROMACS is split into two steps. First you create a job with certain parameters and afterwards you can run it. That has the advantage that you can think about the details on your machine, copy the job to a compute node and run it there. So thinking and creating will be done locally using the  `grompp`  tool, but running is for more powerful remote systems with the  `mdrun`  tool ;-)

To create a new energy minimization job you can do something like that:



{% highlight bash %}
grompp -f emin.mdp -c pep.start.gro -p peptide.top -o job.minenergy.tpr
{% endhighlight %}



That is the common call for  `grompp` . You pass a parameter file ( `-f emin.pdb` ), a molecule ( `-c $gro` ), the topology file for this molecule ( `-p $top` ) and a file to write the job to ( `-o job.minenergy.tpr` ). All parameter files I'm using in this article can be found in <a href="#apa">appendix A</a>.

To run this job you start a  `mdrun`  using the  `job.minenergy.tpr`  file:



{% highlight bash %}
mdrun -s job.minenergy.tpr -deffnm pep.minenergy
{% endhighlight %}



 `mdrun`  is also able to parallelize its work, so you might want to run it through  `mpirun` :



{% highlight bash %}
mpirun mdrun -s job.minenergy.tpr -deffnm pep.minenergy
{% endhighlight %}



You see, all you need is the run-file ( `-s job.minenergy.tpr` ) and all results are written to  `pep.minenergy.*` . That means the the new molecule with less energy will be found in  `pep.minenergy.gro` , its trajectory will be stored in  `pep.minenergy.trr`  and so on.
If you want to see what happened so far just open the  `.gro`  file with e.g. VMD. You'll see the result of the minimization. During the process at some points the intermediate steps are stored to the  `.xtc`  file, VMD is able to visualize them. Open the  `.gro`  file, select it in the main-window and choose <em>File &gt; Load Data Into Molecule</em>. Here you can load the  `.xtc`  file and for each stored state one frame will be created. Pressing play you'll see an animation of the energy minimization. This also works for all subsequent calculations.
That is really smart, isn't it? Ok, lets go on.






<h2>Adding water</h2>
To simulate the dynamics in solid medium you need to add some water. But before you can add water you have to create a box around your molecule, otherwise your water will flow away... ;-)
So first of all we need to center the peptide in the space (here 5 nm = 50 Å in each dimension, with  `-princ`  we can decide how to center the peptide, e.g. the backbone). This can be done with  `editconv` :



{% highlight bash %}
editconf -f pep.minenergy.gro -o pep.space.gro -bt cubic -box 5 -princ
{% endhighlight %}



Now you can create a box around the molecule and fill it with water molecules. There are different types of water, defining its structure. Some of them just describe it as one big sphere while other also consider the dipoles. To explain all that in detail will go beyond this article, but I think you'll find out on yourself..
I still chose the water model  `tip3`  when I converted th peptide from the  `.pdb`  file, so GROMACS already know what kind of water we want to see. These water models are just small cubics containing some water molecules. Filling a box with water simply means copy as many water-cubes as possible without intersection into your box. To create the box and to simultaneously fill it with water do the following:



{% highlight bash %}
genbox -cp pep.space.gro -cs tip3 -o pep.box.gro -p peptide.top
{% endhighlight %}



If you now have a look at the  `pep.box.gro`  file (e.g. with VMD) you'll find a cube of water, and your peptide somewhere in between the water. Here you can see my one (created with VMD):

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/10/hyp-w-water-vmd1.png" img="/wp-content/uploads/2011/10/hyp-w-water-vmd1.png" title="" caption="" %}











<h2>Optimization</h2>
When the box is filled with water the energy of the whole system is very high. Since the water was added more or less randomly its interaction with the peptide and with other water molecules is of course not optimal at all! So we have to minimize the energy again. First with some rough mechanisms and afterwards some more fine tuning.
The rough attempt is using the <em>steepest descent</em> ( `steep` ) the latter uses <em>conjugate gradients</em> ( `cg` ) for integration. If you are interested in their differnece you'll find some answeres around the net or in <a href="#GROM">[GROM]</a> ;-)
Both methods have to calculate a lot and so they run for a long time. We again create a parameter file using  `grompp` , and use file as input for the real run. The runfile for the rough energy minimization can be created like that:



{% highlight bash %}
grompp -f steep.mdp -p peptide.top -c pep.box.gro -o job.minsteep.tpr
{% endhighlight %}



and you can run the real job with the  `mdrun`  tool:



{% highlight bash %}
mdrun -deffnm pep.minwatersteep -s job.minsteep.tpr
{% endhighlight %}



 `mdrun`  will write its output to the files with the prefix  `pep.minwatersteep` . That is,  `pep.minwatersteep.gro`  can afterwards be used for the fine tuning. Like the rough tuning we use  `grompp`  to create the job for the minimization with  `cg`  and  `mdrun`  to execute it. The one and only difference is the integration method. The parameter file is available in the <a href="#apa">appendix</a>:



{% highlight bash %}
grompp -f cg.mdp -p peptide.top -c pep.minwatersteep.gro -o job.mincg.tpr
mpirun mdrun -s job.mincg.tpr -deffnm pep.minwatercg
{% endhighlight %}



The whole system is currently in  `pep.minwatercg.*`  stored. All molecules (water & peptide) are at the same position located as we added them, but atomic <em>bond-distances</em>, <em>angles</em>, <em>dihedrals</em> and something like that are optimized. Now we can go on with the equilibration.






<h2>Equilibration</h2>
Before we can start to compute some dynamics we need to equilibrate the whole system. Within the equilibration the protein will be fixed and only the dynamics of the water will be modelled. Since the water was more or less randomly added we'll find interactions that would break our simulation later on. The equilibration will eliminate such unreal states of the system and the water will move to hydrophilic locations of your molecule and miss hydrophobic ones.
The first thing we have to do is creating a restriction for the peptide to get it fixed. This can be done with  `genrestr` .  `genrestr`  will create some huge energy walls for the atoms of the peptide, so that any moving of the atoms will be that expensive that it hopefully won't ever happen:



{% highlight bash %}
genrestr -f pep.minwatercg.gro -o pep.fixed.itp
{% endhighlight %}



The question for what to restrict should be answered with  `1`  (the protein).  `pep.fixed.itp`  is now our restriction file, we need to include it to our systems topology. Open  `peptide.top`  and add  `#include "pep.fixed.itp"`  above the line that adds the water:



{% highlight bash %}
[...]
#include "pep.fixed.itp"
; Include water topology
#include "./oplsaamod.ff/itp3.itp"
[...]
{% endhighlight %}



The water topology might of course be another one in your case, but the line that includes  `pep.fixed.itp`  is the important one.
With this restriction we can again create a parameterfile with  `grompp`  and run the job with  `mdrun` :




{% highlight bash %}
grompp -f equi.mdp -p peptide.top -c pep.minwatercg.gro -o job.equi.tpr -maxwarn 5
mpirun mdrun -s job.equi.tpr -deffnm pep.equi -cpo
{% endhighlight %}



I had to increase the maxwarn level, because there were some annoying warnings for me. This job will have a very long runtime, so I used the  `-cpo`  option to write <strong>regularly checkpoints</strong>. Thus, the job can easily be restarted and we don't have to run everything again...
When the job is finished <strong>don't forget to erase the line in the topology file that includes the restriction</strong>! Oherwise you will hardly see any dynamics later on ;-)




<h2>Molecular dynamics</h2>
Ok, lets start with the <em>main matter</em>! We want to have a look at the molecules dynamic in the box of water. As usual we create the job with  `grompp`  and execute it with  `mdrun`  (through  `mpirun` ):



{% highlight bash %}
grompp -f md.mdp -c pep.equi.gro -p peptide.top -o job.md.tpr -t pep.equi.cpt
mpirun mdrun -s job.md.tpr -deffnm pep.md -cpo
{% endhighlight %}



Like all the other parameter files you'll also find the  `md.mdp`  <a href="#apa">attached</a>. With these settings you'll sample 500.000 steps, with 2 pico seconds to calculate per step. That will correspond to 1 nano second (one billionth of a second; 10<sup>-9</sup> seconds). Might be enough for some tests, but to get statistical relevant results you should simulate at least 50 to 100 ns. The calculation of 500k steps using 12 cores took about 10 hours for me, so you can imagine how much time you'll have to wait to simulate a longer period of time. By the way we're talking about nano seconds! Far far away from modelling in real-time ;-)
If everything went well you can take a look at the result and you'll see something like this:




Here are all simulations for one of our peptides:

<ul>
<li>Proline simulated using AMBER force field</li>
<li>Hydroxyproline simulated using AMBER fore field</li>
<li>Proline simulated using OPLS-AA force field</li>
<li>Hydroxyproline simulated using OPLS-AA force field</li>
</ul>

To train your brain I won't give you any analyzation, but feel free to comment or to ping me if you want to discuss some things ;-)





<h2>Analytics</h2>
Wow, these movies are impressive, aren't they!? But what can we learn from them? Nearly nothing, all we get is just some subjective feelings. We need numbers and plots! ;-)
The first thing we could measure is its stretching, the distance between the first and the last $$C_\\alpha$$. This will give you an idea about the elasticity of the molecule. To get these distances during the simulations you can export them from the  `.xtc`  file. First of all you need to create an index file, that collects indices:



{% highlight bash %}
make_ndx -f pep.md.gro -o caindices.ndx
{% endhighlight %}



 `make_ndx`  is interactive, you can see all existing indices and of course add further ones. To add for example another index for the $$C_\\alpha$$ you could pass the following letters to the interactive cmd line:



{% highlight bash %}
> a Ca
{% endhighlight %}



To give this index a descriptive name you might do the following:



{% highlight bash %}
> name INDEXNUMBER firstCas
{% endhighlight %}



Add another index over the $$C_\\alpha$$ and name it  `lastCas` :



{% highlight bash %}
> a Ca
> name INDEXNUMBER lastCas
{% endhighlight %}



With  `q`  you can quit the interactive command line and the index file will be written. Open it with an editor, at the end of the file you'll find something like that:



{% highlight bash %}
[ firstCas ]
   9   19   26   44   59   66   82   88  103
[ lastCas ]
   9   19   26   44   59   66   82   88  103
{% endhighlight %}



So you see, all $$C_\\alpha$$ are listed here. But we want only the first respectively last $$C_\\alpha$$, delete the other ones. These lines should look like:



{% highlight bash %}
[ firstCas ]
   9
[ lastCas ]
   103
{% endhighlight %}



Great! Lets extract the distances. GROMACS contains a tool called  `g_dist`  calculating such distances:



{% highlight bash %}
g_dist -f pep.md.xtc -n caindices.ndx -s job.analdist.tpr -o eed.xvg
{% endhighlight %}



 `g_dist`  is also interactively, you need to choose two indices to calculate the distance between them (of course the ones we just created). The distances will be stored in  `eed.xvg` . You need to <strong>take care that the distances are correct!</strong> In my case something bad happened. You might already know the coordinates are all modulo box dimension, so if $$x_n$$ is the last x-coordinate, than $$x_n+1$$ equals the start of the box. That has the effect that a water molecule that wants to leave the box is immediatelly added to the opponent side of the box again, and so we don't loose substance and don't have to care for new one (the same with our molecule, we don't loose it if it will move beyond the borders of our box). But the direct distance between $$C_{\\alpha 1}$$ and $$C_{\\alpha N}$$ might be longer than the distance wrapping around the box, so the calculated distances are incorrect (ok, of course they are correct, but don't match our expectations). In this case you have to enlarge the box. In <a href="apb">appendix B</a> I describe how to do that.

Having the distances we can plot them. For example using <a href="http://www.gnuplot.info/">gnuplot</a>:



{% highlight gnuplot %}
set terminal postscript enhanced color
set output "HyP2.dist.ps"
plot "eed.xvg" u 1:2 w l title "{/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N}"
{% endhighlight %}



Here you can see such a plot for my simulation:



Ok, as I said, the simulated 1 ns is just too short to analyze anything significant. But try to interprete it on yourself.


Another measurement is the surface!?








echo -n "15\\n16\\n" | g_dist -f HyP2.pdb.simulation.gro.xtc -n HyP2.index.ndx -s HyP2.pdb.tmp.tpr -o HyP2.index.ndx.eed.xvg  

gnuplot>
gnuplot> set terminal postscript enhanced color
Terminal type set to 'postscript'
Options are 'landscape enhanced defaultplex \\
   leveldefault color colortext \\
   dashed dashlength 1.0 linewidth 1.0 butt noclip \\
   palfuncparam 2000,0.003 \\
   "Helvetica" 14 '
gnuplot>
gnuplot> set output "HyP2.dist.ps"
gnuplot> plot "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot> set output "HyP.dist.ps"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot> set output "P2.dist.ps"
gnuplot> plot "P2.index.ndx.eed.xvg" u 1:2 w l title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot> set output "P.dist.ps"
gnuplot> plot "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot>
gnuplot> set output "P190.dist.ps"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot>
gnuplot>
gnuplot> set output "P683.dist.ps"
gnuplot> plot "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 w l title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot>
gnuplot> set output "all.dist.ps"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 w l title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot>
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 w lt 3 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
                                                                                                                                                                                                                                                                                                                                                                           ^
         expecting 'lines', 'points', 'linespoints', 'dots', 'impulses',
        'yerrorbars', 'xerrorbars', 'xyerrorbars', 'steps', 'fs

gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 lt 3 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 lt 1 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 l title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"

gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 l title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
                                                                                                                                                                                                                                                                                                                                                                      ^
         ';' expected

gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 lt 4 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 lt 4 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" w l
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" lt 1 lw 3 pt 3 linecolor rgb "red"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" l 1 linecolor rgb "red"

gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" l 1 linecolor rgb "red"
                                                                                                                                                                                                                                                                                                                                                                                                                                           ^
         ';' expected

gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" w l 1 linecolor rgb "red"

gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" w l 1 linecolor rgb "red"
                                                                                                                                                                                                                                                                                                                                                                                                                                               ^
         ';' expected

gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" w l linecolor rgb "red"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" w l lt 1 linecolor rgb "red"
gnuplot>
gnuplot>
gnuplot>
gnuplot>
gnuplot>
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l lt 1 linecolor rgb "orange" title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l lt 1 linecolor rgb "blue" title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" w l lt 1 linecolor rgb "purple"
gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l linecolor rgb "purple" title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l lt 1 linecolor rgb "orange" title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l lt 1 linecolor rgb "blue" title "HyP 683 {/Symbol D} C_{{/
gnuplot> set output "all.dist.ps"                                                                                                                                                   gnuplot> plot "HyP.index.ndx.eed.xvg" u 1:2 w l linecolor rgb "purple" title "HyP 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P.index.ndx.eed.xvg" u 1:2 w l lt 1 linecolor rgb "orange" title "P 190 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "HyP2.index.ndx.eed.xvg" u 1:2 w l lt 1 linecolor rgb "blue" title "HyP 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)", "P2.index.ndx.eed.xvg" u 1:2 title "P 683 {/Symbol D} C_{{/Symbol a}_1}C_{{/Symbol a}_N} (AMBER)" w l lt 1 linecolor rgb "red"
gnuplot> quit


echo -n "a Ca\\naCa\\nq\\n" | make_ndx -f HyP2.pdb.simulation.gro -o HyP2.index.ndx && vim HyP2.index.ndx 
echo -n "15\\n16\\n" | g_dist -f HyP2.pdb.simulation.gro.xtc -n HyP2.index.ndx -s HyP2.pdb.tmp.tpr -o HyP2.index.ndx.eed.xvg          



measurment fo distances






All in all these were nice weeks, I learned a lot. And we of course also found some time to visit some champagner producers and to join some tastings ;-)
Thanks to the whole university staff in Reims!






<h2><a name="apa">Appendix A</a>: Files</h2>
All these configuration files are initially not created by me, I just made some modification. I publish them here to give you a chance to retrace my experiences.

<h4>Water model tip3</h4>
Here you find the water model I used for my calculations: <a href='/wp-content/uploads/2011/10/tip3.gro'>tip3.gro</a>.

<h4>Parameter for energy minimization of the peptide</h4>
I used these parameters for energy minimization: <a href='/wp-content/uploads/2011/10/emin.mdp'>emin.mdp</a>. It will run 500 steps to minimize the energy using  `lincs`  as  `constraint_algorithm` 

<h4>Parameter for energy minimization using steep</h4>
To minimize the energy in water I used this parameter file for the rough minimization: <a href='/wp-content/uploads/2011/10/steep.mdp'>steep.mdp</a>. It's running 5000 steps using <em>steepest descent</em> algorithm.

<h4>Parameter for energy minimization using cg</h4>
These parameter file was used to do the fine tuning in water: <a href='/wp-content/uploads/2011/10/cg.mdp'>cg.mdp</a>. It's also running 5000 steps but uses <em>conjugate gradients</em> for integration.

<h4>Parameter for equilibration</h4>
The equilibration was done with these parameters: <a href='/wp-content/uploads/2011/10/equi.mdp'>equi.mdp</a>. It runs 250.000 steps with 2ps each step. 

<h4>Parameter for md simulation</h4>
Molecular dynamics were simulated using these parameters: <a href='/wp-content/uploads/2011/10/md.mdp'>md.mdp</a>. I simulated 500.000 steps, each 2ps. 












<h2><a name="apb">Appendix B</a>: Increase the box size</h2>
There are some situations when you might want to increase your box surrounding your molecule. This can easily be done with  `trjconv` :



{% highlight bash %}
trjconv -f file.xtc -s file.tpr -box 10 10 10 -o newfile.xtc
{% endhighlight %}



Choose e.g. 1, this will increase the size of the box in  `file.xtc`  to 10x10x10 nm and write the new box to  `newfile.xtc` .
The resulting file is of course not ready for calculation, because you just created something like a vaccum around your old box. But analyzing this state is allowed ;-)




<h2><a name="apc">Appendix C</a>: script</h2>
to run all at once...





<h1>References</h1>
		<dl>
		<dt><a name='SHORT'>[SHORT]</a></dt>
		<dd>WHO
		<em>TITLE</em>
		WHERE
		LINK
		</dd>
		<dt><a name='AMB'>[AMB]</a></dt>
		<dd>Cornell WD, Cieplak P, Bayly CI, Gould IR, Merz KM Jr, Ferguson DM, Spellmeyer DC, Fox T, Caldwell JW, Kollman PA
		<em>A Second Generation Force Field for the Simulation of Proteins, Nucleic Acids, and Organic Molecules</em> (1995)
		J. Am. Chem. Soc. 117: 5179–5197.
		<a href="http://dx.doi.org/10.1021%2Fja00124a002">http://dx.doi.org/10.1021%2Fja00124a002</a>
		</dd>
		<dt><a name='CHA'>[CHA]</a></dt>
		<dd>Brooks BR, Bruccoleri RE, Olafson BD, States DJ, Swaminathan S, Karplus M
		<em>CHARMM: A program for macromolecular energy, minimization, and dynamics calculations</em> (1983)
		J Comp Chem 4 (2): 187–217.
		<a href="http://dx.doi.org/10.1002%2Fjcc.540040211">http://dx.doi.org/10.1002%2Fjcc.540040211</a>
		</dd>
		<dt><a name='GRO'>[GRO]</a></dt>
		<dd>D. van der Spoel, E. Lindahl, B. Hess, A. R. van Buuren, E. Apol, P. J. Meulenhoff, D. P. Tieleman, A. L. T. M. Sijbers, K. A. Feenstra, R. van Drunen and H. J. C. Berendsen
		<em>Gromacs User Manual version 4.5.4</em>
		<a href="http://www.gromacs.org/@api/deki/files/152/=manual-4.5.4.pdf">http://www.gromacs.org/@api/deki/files/152/=manual-4.5.4.pdf</a>
		</dd>
		<dt><a name='OPL'>[OPL]</a></dt>
		<dd>Jorgensen WL, Tirado-Rives J
		<em>The OPLS Force Field for Proteins. Energy Minimizations for Crystals of Cyclic Peptides and Crambin</em> (1988)
		J. Am. Chem. Soc. 110: 1657–1666.
		<a href="http://pubs.acs.org/cgi-bin/sample.cgi/jacsat/1988/110/i06/pdf/ja00214a001.pdf">http://pubs.acs.org/cgi-bin/sample.cgi/jacsat/1988/110/i06/pdf/ja00214a001.pdf</a>
		</dd>
		<dt><a name=''>[]</a></dt>
		<dd>
		<em></em>


		</dd>
		</dl>

<div class="download"><strong>Download:</strong>
GROMACS-topology: <a href='/wp-content/uploads/2011/10/tip3.gro'>tip3.gro</a>
GROMACS-parameter: <a href='/wp-content/uploads/2011/10/emin.mdp'>emin.mdp</a>
GROMACS-parameter: <a href='/wp-content/uploads/2011/10/steep.mdp'>steep.mdp</a>
GROMACS-parameter: <a href='/wp-content/uploads/2011/10/cg.mdp'>cg.mdp</a>
GROMACS-parameter: <a href='/wp-content/uploads/2011/10/equi.mdp'>equi.mdp</a>
GROMACS-parameter: <a href='/wp-content/uploads/2011/10/md.mdp'>md.mdp</a>
		<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
		</div>
