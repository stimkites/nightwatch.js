# Nightwatch JS suite

Nightwatch and Casper .js tests suite

## What is?

Standalone Node JS compiler for running NightwatchJS/CasperJS front-end tests using headless browsers: 
slimerJS and phantomJS. It contains both - code editor window, where you edit your NodeJS code, and the run results
window where you see the execution results.

### Implementation

https://nightwatch.stage.wetail.io/ 

To login - use `casper`:`friday13`


### Tips

-   Make sure Selenium server is running.
-   Before running tests, choose type (`nightwatch` or `casper`)
-   Explicit save command - `CTRL + S`
-   While editing your code, press `CTRL + SPACE` to toggle fullscreen mode
-   `ALT + F9` - run test immediately, `ALT + F8` - toggle output panel
-   To duplicate line in editor, use `CTRL + D`
-   Use `Esc` key to exit from fullscreen mode and stop test immediately
-   `CTRL + R` - replace, `CTRL + F` - find text in code
-   If you are in fullscreen mode, auto-save every 30 seconds is engaged by default
-   Every test is automatically saved under your username in specified .js type file
-   If test is frozen or browser does not respond, just refresh the page
-   Test execution is limited by 10 minutes
-   If everything is completely frozen - stop the [Selenium] server and run it again
-   Before deleting any tests, please, make sure it's yours or get punished later!

-   Have fun and enjoy ;)


### Version log

- 0.0.2
  - Hot keys changed, wider screen, bigger fonts, updated environment
  
- 0.0.1
  - Initial commit, initial idea and implementation
