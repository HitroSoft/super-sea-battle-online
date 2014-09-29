__author__ = 'yrafalsky'
"""
sudo su - root
cd /home/ubuntu/
copy this script there
run it "nohup python create_environment.py &"

script will install git, GitPython
after that it will clone project to BASE_DIR/super-sea-battle-online
after that it will checkout deploy_to_server branch
after that it will run manage.py

each 30 seconds script checks for changes in git in deploy_to_server branch.
If there are changes - kill server - fetch origin - reset branch to new origin - start server

Script depends on nginx.
"""


import os
import time
import subprocess

def exec_command_and_get_result(the_command):
    print("=================")
    aaz= subprocess.Popen(args=(the_command).split(" "),stdout=subprocess.PIPE)
    output, err = aaz.communicate()
    print ("Executed=" + str(the_command))
    if output.endswith("\n"):
        output = output[:output.__len__()-1]
    print ("Result=" + str(output))
    print("Errors = " + str(err))
    return output

def fetch_from_remote_github(pre_checkout=True):
    if pre_checkout:
        print exec_command_and_get_result("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git checkout --force -b deploy_to_server origin/deploy_to_server")
    exec_command_and_get_result("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git fetch origin")
    exec_command_and_get_result("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git reset --hard origin/deploy_to_server")

def get_server_process_id():
    bb=subprocess.Popen(['pgrep','-f',"/usr/bin/python manage.py"],stdout=subprocess.PIPE)
    output, err = bb.communicate()
    if output.endswith("\n"):
        output = output[:output.__len__()-1]
    print "grep_result = " + str(output)
    print "grep_errors = " + str(err)
    return output


def kill_server():
    server_id = get_server_process_id()
    if not server_id:
        print "Server not detected!!!"
        return None
    print "process_id="+server_id
    subprocess.Popen(['sudo','kill','-9',server_id])
    print "server killed"
    return server_id

def update_packages_by_requirements_pip():
    exec_command_and_get_result("pip install -r requirements.pip")


# prepare everything for this script work
exec_command_and_get_result("apt-get install git -y")
exec_command_and_get_result("pip install GitPython")

import git

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
target_folder= os.path.join(BASE_DIR,"super-sea-battle-online")
if not os.path.exists(target_folder):
    os.mkdir(target_folder)
    git.Git().clone("https://github.com/HitroSoft/super-sea-battle-online.git",target_folder)
os.chdir(target_folder)

fetch_from_remote_github(pre_checkout=True)

update_packages_by_requirements_pip()

os.system("python manage.py runserver 0.0.0.0:8000 > serveroutput.txt &")

print "server started"
while True:
    time.sleep(30)
    output = exec_command_and_get_result("git ls-remote git://github.com/HitroSoft/super-sea-battle-online")
    lines = output.split("\n")
    results = dict()
    for line in lines:
        if line:
            results[line.split("\t")[1]]=line.split("\t")[0]
    if 'refs/heads/deploy_to_server' not in results:
        print "Branch not detected on remote side !!! Check ethernet"
        continue
    print results['refs/heads/deploy_to_server']
    output = exec_command_and_get_result("git --work-tree="+target_folder+" --git-dir="+target_folder+"/.git rev-parse deploy_to_server")
    if output!=results['refs/heads/deploy_to_server']:
        print "changes detected"
        kill_server()
        fetch_from_remote_github(pre_checkout=False)
        update_packages_by_requirements_pip()
        print "server starting"
        os.system("python manage.py runserver 0.0.0.0:8000 > serveroutput.txt &")
        print "server started"
    else:
        server_id = get_server_process_id()
        if not server_id:
            print "Server not detected!!! Staring server !!!"
            print "server starting"
            os.system("python manage.py runserver 0.0.0.0:8000 > serveroutput.txt &")
            print "server started"



