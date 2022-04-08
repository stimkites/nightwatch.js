#SET ENV
export PATH=$PATH:/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/
export PATH=$PATH:/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/slimerjs
export DISPLAY=:99
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/libs
export SLIMERJSLAUNCHER=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/firefox/firefox

#SET ALIASES
alias slimerjs=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/slimerjs/slimerjs
alias casperjs=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/casperjs/bin/casperjs
alias phantomjs=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/phantomjs
alias firefox=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/firefox/firefox

#LAUNCH TEST
casperjs --engine=slimerjs --headless $1