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

    <div class="container40">
        <div class="list-container">
            <h3>Selenium server state</h3>
            <ul>
                <li id="selenium-state">Status: checking...</li>
                <li>Java JDK: 1.8.0, CasperJS: 1.1.4</li>
                <li>NightwatchJS: 2.1.0</li>
                <li>SlimerJS: 1.0.0, PhantomJS: 2.1.1</li>
                <li>Geckodriver: 0.3.0, Ghostdriver: 1.3.0</li>
            </ul>
        </div>
        <div class="list-container">
            <h3>Tests to run<span class="search-tests"><input type="text" value="" placeholder="Search"/><a class="reset-search">Reset</a></span></h3>
            <div id="tests"><ul><li>Fetching...</li></ul></div>
        </div>
        <div class="list-container">
            <h3>Tips</h3>
            <?php
            // Tips are taken from readme
            include "inc/php/MDParse.php";
            $parser = new MDParse();
            $content = file_get_contents( "README.md" );
            $tips_start = strpos( $content, '### Tips' ) + 8;
            $tips_end = strpos( $content, '### Version log' );
            echo $parser->parse( substr( $content, $tips_start, $tips_end - $tips_start ) );
            ?>
        </div>
    </div>

    <div class="container60">
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

<footer><div class="container">&copy; <?=date('Y');?> Stim, under license of <a href="https://wetail.io" target="_blank">Wetail AB, Sweden</a></div></footer>

<script>
    //init editor

</script>

</body>
</html>