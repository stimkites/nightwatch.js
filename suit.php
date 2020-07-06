<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Nightwatch:Casper:js</title>
    <link rel="stylesheet" href="inc/css/styles.css?v=<?php echo time() ?>">
    <link rel="stylesheet" href="inc/highlight/theme/dracula.css">
    <link rel="stylesheet" href="inc/highlight/lib/codemirror.css">
    <link rel="stylesheet" href="inc/highlight/addon/display/fullscreen.css">
    <link rel="stylesheet" href="inc/highlight/addon/scroll/simplescrollbars.css">
    <link rel="stylesheet" href="inc/highlight/addon/dialog/dialog.css">
    <script type="text/javascript" src="inc/js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="inc/js/default.js?v=<?php echo time() ?>"></script>
    <script type="text/javascript" src="inc/highlight/lib/codemirror.js"></script>
    <script type="text/javascript" src="inc/highlight/addon/scroll/simplescrollbars.js"></script>
    <script type="text/javascript" src="inc/highlight/addon/display/fullscreen.js"></script>
    <script type="text/javascript" src="inc/highlight/mode/javascript/javascript.js"></script>
    <script type="text/javascript" src="inc/highlight/addon/selection/active-line.js"></script>
    <script type="text/javascript" src="inc/highlight/addon/edit/matchbrackets.js"></script>
    <script type="text/javascript" src="inc/highlight/addon/search/search.js"></script>
    <script type="text/javascript" src="inc/highlight/addon/search/searchcursor.js"></script>
    <script type="text/javascript" src="inc/highlight/addon/search/jump-to-line.js"></script>
    <script type="text/javascript" src="inc/highlight/addon/dialog/dialog.js"></script>
</head>
<body>
<header>
    <div class="container">
        <a href="http://nightwatch.stage.wetail.io/" class="site-logo">
            <img src="assets/img/logo.png" alt="logo">
        </a>
    </div>
</header>
<section class="container">
    <h1>Nightwatch and Casper .js tests suite</h1>

    <div class="container50">
        <div class="list-container">
            <h3>Selenium server state</h3>
            <ul>
                <li id="selenium-state">Status: checking...</li>
                <li>Java JDK: 1.8.0</li>
                <li>CasperJS: 1.1.4, NightwatchJS: 0.9.20</li>
                <li>SlimerJS: 1.0.0, PhantomJS version: 2.1.1</li>
                <li>Geckodriver: 0.20, Ghostdriver: 1.3.0</li>
            </ul>
        </div>
        <div class="list-container">
            <h3>Currently created tests<span class="search-tests"><input type="text" value="" placeholder="Search"/><a class="reset-search">Reset</a></span></h3>
            <div id="tests"><ul><li>Fetching...</li></ul></div>
        </div>
        <div class="list-container">
            <h3>Tips</h3>
            <ul>
                <li>Make sure Selenium server is running.</li>
                <li>Before running tests, choose what it's type</li>
                <li>Define browser you want to run it into</li>
                <li>Explicit save command - CTRL + S</li>
                <li>While editing your code, press F11 to toggle fullscreen mode</li>
                <li>ALT + F9 - run test immediately, ALT + F8 - toggle output panel</li>
                <li>To duplicate line in editor, use CTRL + D</li>
                <li>Use Esc key to exit from fullscreen mode and stop test immediately</li>
                <li>CTRL + R - replace, CTRL + F - find text in code</li>
                <li>If you are in fullscreen mode, autosave every 30 seconds is engaged</li>
                <li>Every test is automatically saved under your user name in specified .js type</li>
                <li>If test is frozen or browser does not respond, just refresh the page</li>
                <li>Test execution is limited by 10 minutes</li>
                <li>If everything is completely frozen - stop the Selenium server and run it again</li>
                <li>Before deleting any tests, please, make sure it's yours or you are allowed to do it.</li>
                <li>Have fun and enjoy!</li>
            </ul>
        </div>
    </div>

    <div class="container50">
        <div class="list-container">
            <h3>Create/Run test script
                <div class="ttype-switcher" title="JS tests type"><span class="active">nightwatch</span><span>casper</span></div>
            </h3>
            <form action=" " class="new-test" name="new_test" method="post" enctype="multipart/form-data">
                <input type="hidden" id="ttype" value="nightwatch" />
                <p><input type="text" id="uname" placeholder="Your name"
                          value="<?php echo (isset($_SESSION['uname'])?$_SESSION['uname']:''); ?>"/></p>
                <p><input type="text" id="tname" placeholder="Test name" value=""/></p>
                <textarea id="tcontent" placeholder="Your test code"></textarea>
                <input type="hidden" id="browser_type" value="phantomjs" />
                <p></p>
                <div>
                    <input type="button" value="Run" class="run-test" id="run-test"/>
                    <div class="browser-switcher" title="Browser"><span>slimerjs</span><span class="active">phantomjs</span></div>
                    <span id="autosave_flag"></span>
                </div>
            </form>
        </div>
        <div class="list-container">
            <h3>Test run results</h3>
            <div class="test-run-results thin-scroll" tabindex="1">
                <pre id="test-results"></pre>
            </div>
        </div>
    </div>

<br clear="all">

</section>

<footer><div class="container">&copy; <?=date('Y');?> Wetail.se All right reserved</div></footer>

<script>
    //init editor

</script>

</body>
</html>