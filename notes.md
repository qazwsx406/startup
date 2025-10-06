# CS 260 Notes
These are my notes for CS260

## Links To Submissions
I have been working ahead and have realized that the TAs would not be able to check my work if I update the code  
on the server. So I have decided to host several servers each displaying the expected output. Below is the link for the deliverables.

 - **Startup AWS**: https://startup-aws.hottakes260.com
    - [x] HTTPS connection working correctly
    - [x] custom domain setup complete
    - [x] "startup" and "simon" sub-subdomains working correctly

 - **Startup HTML**: https://startup-html.hottakes260.com
    - [x] "startup" and "simon" sub-subdomains working correctly
    - [x] "startup" and "simon" html code deployed correctly using provided script
    - [x] html formatted to display app pages

 - **Startup CSS**: https://startup.hottakes260.com
    - [x] "startup" and "simon" sub-subdomains working correctly
    - [x] "startup" and "simon" css styling deployed correctly using provided script
    - [x] used tailwind to apply styling

## Github Repository Assignment
I have learned how to use basic git commands.  
https://git-school.github.io/visualizing-git/  
This website was really helpful in visualizing what happens which each command

AMI: ami-018f3a022e128a6b2

## AWS Assignment
It seems like for some reason windows powershell doesn't work well when trying to ssh into a server. Git bash worked, so I am sticking to that.  
Release elastic IP !== Terminating EC2 instance

## Route 53 Domain
I have learned how to purchase and register a domain on Route 53. Nothing was too difficult here. Pretty straightforward.

## Caddy and HTTPS Enable
For some reason, apt update && upgrade breaks something in the configuration. The default caddy page displays when done.  
Had to terminate pervious instance and redo everything.

## HTML Structure
Was a good reminder of HTML.

## CSS
Looked through CSS of Simon. Was a good reminder of CSS.

## Vite
Had trouble with styling because of this change:  
<body> → <div id="root"> → Your App's <div> → (<header>, <main>, <footer>)  