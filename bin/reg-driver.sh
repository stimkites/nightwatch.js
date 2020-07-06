#SET ENV
export PATH=$PATH:/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/geckodriver
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/libs

#SET ALIASES
alias phantomjs="/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/phantomjs"

#REGISTER GHOST DRIVER
phantomjs /home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/slimerjs-1.0.0/vendors/ghostdriver/main.js --hub=http://localhost:5557 --ip=127.0.0.1 --port=$1