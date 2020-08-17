# Moodle Developer Environment Setup Guide
Moodle is normally run on a server setup, however, for plugin developers, it is probably easier to run Moodle standalone on their personal computer. This guide assumes you will be using a Windows machine.

1.	__To install Moodle for desktop, go to https://download.moodle.org/windows/ and download the version of Moodle you would like to use (probably the latest version)__
![](.\imgs\1\1-1.png)


2.	__Click the “Download Zip” for the version you would like to use.__

3.	__Unzip the downloaded Files to any folder location you would like to use, in this example we are going to put the downloaded files into “Moodle4.0” in our Downloads folder.__

4.	__After unzipping and moving the moodle files, run “Start Moodle.exe” to set up the initial installation.__

    a.	Once “Start Moodle.exe” is running, do not close it to stop moodle, instead use the “stop Moodle.exe” 

5.	__Now that Moodle is running, open a web browser and navigate to “localhost” or http://127.0.0.1__

6.	__The first page will ask you to select your language of choice:__
![](.\imgs\1\1-6.png)

7.	__The next page will ask you to set up moodle installation locations: (for development on your own machine, just select the default, if you want it to be accessable via lan or Web address you will do that here as well:__
![](.\imgs\1\1-7.png)

8.	__Next you will set up your database settings. You should probably set a password ( don’t forget it) but if this is just a local dev machine it probably doesn’t matter that much.__  
![](.\imgs\1\1-8.png)

9.	__On the next page, moodle will run through a bunch of server checks(they should all be “OK”), wait till these are complete and press continue__  
![](.\imgs\1\1-9.png)

10.	__If you selected any additional language packs other than english, moodle will now check if it is available (if not it will just install using english):__  
![](.\imgs\1\1-19.png)

11.	__If everything completed successfully, a message confirming successful configuration will be displayed:__  
![](.\imgs\1\1-11.png)

12.	__The next two screens will be copywrite/license notification and current release and unattended option, on the second screen, select the “unattended operation” checkbox to automatically advance through several installation screens__   
![](.\imgs\1\1-12.png)

13.	__Wait for the next several screens to be finished installing, then you should see a “Setup administrator account” screen, create your administrator account and select “save” to continue:__  
![](.\imgs\1\1-13.png)

14.	__Next you will be asked to setup your full site name and a short name for the navigation bar, set these to whatever you want (you can change them later):__  
![](.\imgs\1\1-14.png)

15.	__Next select if you want users to be able to setup their own account using their email (the default is to disable – as a developer machine you probably don’t care ( you can create user accounts using your administrator account):__  
![](.\imgs\1\1-15.png)

16.	__After selecting “save changes” above, you are DONE! Moodle is installed and you should be at your blank front page of your new site!:__  
![](.\imgs\1\1-16.png)