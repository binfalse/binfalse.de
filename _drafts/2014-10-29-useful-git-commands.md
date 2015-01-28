---
layout: post
title: 'helpful git commands '
categories:
  - Junk

---

aliases stored in ~/.gitconfig

beautify the log
git config --global alias.lg "log --all --pretty=format:'%x09%C(bold blue)%an%Creset%x09%Cred%h%Creset %Cgreen%ad%Creset%x09%s%d' --graph --date=short  --since='14 days ago'"

status
git config --global alias.s "status"

serach
git config --global alias.search "log --all --pretty=format:'%x09%C(bold blue)%an%Creset%x09%Cred%h%Creset %Cgreen%ad%Creset%x09%s%d' --graph --date=short -m -i -G"


git commit
git config --global alias.c "commit -a"   

git pull (d) and git push (d)
git config --global alias.d "pull"
git config --global alias.u "push"


diff two commits:

git config --global alias.meld "difftool -d -t meld"

-> git meld f4e02bd 32c742b
== whole tree meld



<h1>References</h1>
		<dl>
		<dt><a name='SHORT'>[SHORT]</a></dt>
		<dd>WHO
		<em>TITLE</em>
		WHERE
		LINK
		</dd>
		<dt><a name=''>[]</a></dt>
		<dd>
		<em></em>


		</dd>
		</dl>

<div class="download"><strong>Download:</strong>

		<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
		</div>
