__author__ = 'yrafalsky'
import git
import os
import time
import subprocess

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
target_folder= os.path.join(BASE_DIR,"super-sea-battle-online")
if not os.path.exists(target_folder):
    os.mkdir(target_folder)
    git.Git().clone("https://github.com/HitroSoft/super-sea-battle-online.git",target_folder)
os.chdir(target_folder)

aaz= subprocess.Popen(("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git checkout --force -b deploy_to_server origin/deploy_to_server").split(" "),stdout=subprocess.PIPE)
output, err = aaz.communicate()
print output
subprocess.call(("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git fetch origin").split(" "))
subprocess.call(("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git reset --hard origin/deploy_to_server").split(" "))


subprocess.Popen("python manage.py runserver 0.0.0.0:8000".split(" "),stdout=subprocess.PIPE)
print "server started"
while True:

    dd = subprocess.Popen("git ls-remote git://github.com/HitroSoft/super-sea-battle-online".split(" "),stdout=subprocess.PIPE)
    output, err = dd.communicate()
    print output
    zz = output.split("\n")
    results = dict()
    for s in zz:
        if s:
            results[s.split("\t")[1]]=s.split("\t")[0]
    print results['refs/heads/deploy_to_server']

    aa = subprocess.Popen(("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git rev-parse deploy_to_server").split(" "),stdout=subprocess.PIPE)
    output, err = aa.communicate()
    print output
    if output.split('\n')[0]!=results['refs/heads/deploy_to_server']:
        print "changes detected"
        bb=subprocess.Popen(['pgrep','-f',"/usr/bin/python manage.py"],stdout=subprocess.PIPE)
        output, err = bb.communicate()
        print "process_id="+output.split("\n")[0]
        subprocess.Popen(['sudo','kill','-9',output.split("\n")[0]])
        print "server killed"
        subprocess.call(("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git fetch origin").split(" "))
        subprocess.call(("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git reset --hard origin/deploy_to_server").split(" "))
        subprocess.Popen("python manage.py runserver 0.0.0.0:8000".split(" "),stdout=subprocess.PIPE)

        print "server started"
    time.sleep(30)
