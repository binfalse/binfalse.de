---
layout: post
title: 'Useful git stuff'
categories:
  - Software
  - Programming
tags:
  - simplification
  - log
  - git
  - Programming
---

## Aliases

Global aliases are stored in `~/.gitconfig`.
I'm using the following aliases:

~~~~~~~ bash
# beautify the log: list actions of last 14 days in a tree like view
git config --global alias.lg "log --all --pretty=format:'%x09%C(bold blue)%an%Creset%x09%Cred%h%Creset %Cgreen%ad%Creset%x09%s%d' --graph --date=short  --since='14 days ago'"

# serach for a particular thing in the history
git config --global alias.search "log --all --pretty=format:'%x09%C(bold blue)%an%Creset%x09%Cred%h%Creset %Cgreen%ad%Creset%x09%s%d' --graph --date=short -m -i -G"

# shortcut for the status
git config --global alias.s "status"

# shortcut for commiting
git config --global alias.c "commit -a"

# shortcut for pulling and pushing
git config --global alias.d "pull"
git config --global alias.u "push origin master"


# diff two commits using meld
git config --global alias.meld "difftool -d -t meld"
~~~~~~~~



## Further Resources

Learn about branching/merging/rebasing/detaching/etc in an interactive tutorial from (pcottle)[https://pcottle.github.io/learnGitBranching/].

Learn about [undoing things](http://www.git-scm.com/book/en/v2/Git-Basics-Undoing-Things) in git, including redoing a commit, resetting a `git add` and unmodifying a file.


