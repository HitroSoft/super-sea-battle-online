__author__ = 'yrafalsky'
import git
# git log -n 1 origin/creating_retranslator
dd = git.Git().execute("git ls-remote git://github.com/HitroSoft/super-sea-battle-online")
zz = dd.split("\n")
results = dict()
for s in zz:
    results[s.split("\t")[1]]=s.split("\t")[0]


aaa = git.Git().clone("https://github.com/HitroSoft/super-sea-battle-online.git","zzz")
git.Git()

repo = git.Repo("https://github.com/HitroSoft/super-sea-battle-online.git")
print repo

