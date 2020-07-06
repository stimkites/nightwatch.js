#SET ENV
export PATH=$PATH:/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/
export PATH=$PATH:/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/slimerjs-1.0.0
export DISPLAY=:99
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/libs
export SLIMERJSLAUNCHER=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/firefox/firefox

#SET ALIASES
alias slimerjs=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/slimerjs-1.0.0/slimerjs
alias casperjs=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/casperjs-1.1.4-1/bin/casperjs
alias phantomjs=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/phantomjs
alias firefox=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/firefox/firefox
alias nightwatch="/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/nightwatch-0.9.20/bin/nightwatch";

#LAUNCH TEST
nightwatch --engine=slimerjs $1