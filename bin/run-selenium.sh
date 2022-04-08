#SET ALIASES
alias java="/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/jdk/bin/java"
alias phantomjs="/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/phantomjs"

#RUN SELENIUM SERVER FOR GHOST AND GECKO DRIVERS
java -jar -Dwebdriver.gecko.driver=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/geckodriver -Dphantomjs.driver.path=/home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/phantomjs /home/125541.cloudwaysapps.com/sxxkmarttt/public_html/bin/selenium.jar -role hub -port 5557

#DONE!