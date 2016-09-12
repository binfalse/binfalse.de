---
layout: post
title: 'Useful git stuff'
categories:
  - software
  - programming
tags:
  - simplification
  - log
  - git
  - programming
---

## Setup

Configure some stuff before you can get started:

~~~~~~~ bash
# which name do you want to see in your commits?
git config --global user.name "Martin Scharm"

# which email do you want to use
git config --global user.email martin@dev

# tell git which gpg key to use by default
git config --global user.signingkey E81BC3078D2DD9BD

# always push all branches and all tags
git config --global --add remote.origin.push '+refs/heads/*:refs/heads/*'
git config --global --add remote.origin.push '+refs/tags/*:refs/tags/*'
~~~~~~~~



## Aliases

Global aliases are stored in `~/.gitconfig`.
I'm using the following aliases:

~~~~~~~ bash
# beautify the log: list actions of last 14 days in a tree like view
git config --global alias.lg "log --all --pretty=format:'%x09%C(bold blue)%an%Creset%x09%Cred%h%Creset %Cgreen%ad%Creset%x09%s%d' --graph --date=short  --since='14 days ago'"

# serach for a particular thing in the history
git config --global alias.search "log --all --pretty=format:'%x09%C(bold blue)%an%Creset%x09%Cred%h%Creset %Cgreen%ad%Creset%x09%s%d' --graph --date=short -m -i -G"

# shortcut for the status
git config --global alias.s "status -s"

# shortcut for commiting
git config --global alias.c "commit -a"

# shortcut for checkout
git config --global alias.co "checkout"

# shortcut for checkout
git config --global alias.co "checkout"

# shortcut for pulling and pushing
git config --global alias.d "pull origin --all --tags"
git config --global alias.u "push origin --all --tags"

# diff two commits using meld
git config --global alias.meld "difftool -d -t meld"

# show ignored files
git config --global alias.i "clean -ndX"
~~~~~~~~




## Jump around the git tree

* `HEAD` always points to you current position in the tree.
* You can always checkout old commits or branches using `git checkout XXX`, with `XXX` being a commit hash or a branch name
* Branch names are pointers to commits. If you've checked out a branch and do a commit the branch pointer will move on to your new commit.
* You can address commits relatively using `^` (go one up in tree) and `~X` (go `X` up in tree), eg.
  * `git checkout master~2 Makefile` checkout the file `Makefile` from the second last commit before `master`
  * `git checkout master^^` get the third last commit on branch master



## Move a branch

If you want the branch `mybranch` to point to `target` you just need to call the following command:

~~~~~~~ bash
git branch -f mybranch target
~~~~~~~~

You *forced* `mybranch` to point to `target`. `target` may be a commit hash or a branch name (any ref git can resolve into a commit).






## Track down a bug using cherry-pick

Let's assume you have a history such as

~~~~~~~ bash
master: init -> c1 -> ... -> c6
~~~~~~~~

and you discovered a bug in commit `c6`, you would probably intruduce a lot of `echo`s/`prinln`s/etc to detect the bug. Afterwars you need to get rid of all these debugging things and commit just the fix.

But it's ways easier using cherry-pick. Just create a `bugfix` branch. Do all your debugging stuff in there, find the bug and do another commit (commits `db1` to `db3`). Finally, fix the bug and commit it with `db4`:


~~~~~~~ bash
master: init -> c1 -> ... -> c6
                              \
                               \
bugfix*:                       db1 -> db2 -> db3 -> db4
                                ^add echo/println    ^bug fixed
~~~~~~~~

You can then simply checkout the master and use `cherry-pick` to append the commit `db4` to it, which fixes the bug in the master branch without all the debugging stuff.
Git's `cherry-pick` will apply commits from anywhere in the tree onto `HEAD` (as long as that commit isn't an ancestor of `HEAD`).
Here are the git commands:


~~~~~~~ bash
git checkout master
git cherry-pick db4
~~~~~~~~

And your final graph would look like:

~~~~~~~ bash
master*: init -> c1 -> ... -> c6 ------------------------> db4'
                               \                        /
                                \                      /
bugfix:                         db1 -> db2 -> db3 -> db4
                                 ^add echo/println    ^bug fixed
~~~~~~~~

Of course, your commit hashes are a bit more complex than `c6` and `db4`, but I hope you got the idea :)



## Modifying an old commit


Let's assume you have a history such as

~~~~~~~ bash
master: c4 -> c5 -> c6
~~~~~~~~

and you forgot to do something in `c5`. Then you can reorder the last two commits using `git rebase -i HEAD^^ --aboveAll` to receive the following:

~~~~~~~ bash
master: c4 -> c6 -> c5
~~~~~~~~

now change the last commit using `git commit --amend` and you'll end up with:

~~~~~~~ bash
master: c4 -> c6 -> c5'
               \
                \
                 c5
~~~~~~~~

Finally, just reorder the last two commits using `git rebase -i HEAD^^ --aboveAll`:

~~~~~~~ bash
master: c4 -> c5' -> c6
~~~~~~~~


You can achieve the same with less reordering using git's `cherry-pick`. Just checkout the commit `c` to modify and modify it to `c'` (using `--amend`). Afterwards, you can `cherry-pick` all commits that came after `c`.







## Further Resources

* Learn about branching/merging/rebasing/detaching/etc in an interactive tutorial from [pcottle](https://pcottle.github.io/learnGitBranching/).
* Learn about [undoing things](http://www.git-scm.com/book/en/v2/Git-Basics-Undoing-Things) in git, including redoing a commit, resetting a `git add` and unmodifying a file.


