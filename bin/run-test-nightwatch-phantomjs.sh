#SET ENV
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/libs
export NODE_PATH=/home/master/node_modules;

#SET ALIASES
alias nightwatch="/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/nightwatch/bin/nightwatch";
alias phantomjs=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/phantomjs

#LAUNCH TEST
nightwatch $1;