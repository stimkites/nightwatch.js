/**
 * Main javascript for project
 * TBD: separate into different files
 */

var nwc_js = (function($){
    
    /**
     * Handling refresh timeouts 
     */
    var refresher = {
            output: {
                delay: 600,
                handler: 0,
                timeout: 240000,
                tohandler: 0
            },
            tests: {
                delay: 6000,
                handler: 0
            },
            server:{
                delay: 5000,
                handler: 0
            },
            autosave:{
                delay: 30000,
                handler: 0
            }
        },
        tests = {
            page: 1,
            search: '',
            current: '',
            editor: 0
        },

        /**
         * Self-descritive
         */
        delete_test = function( path ){
            var tname = path.split('/')[2];
            if(!confirm('Are you sure to delete test \r\n\t[' + tname + ']\r\n with all it\'s results?')) return;
            $.ajax({
                url: '?',
                data: { nwc_ajax: 'delete_test', 'rel_path': path },
                type: 'post',
                dataType:'json',
                success: function(data){
                    get_tests();
                },
                error: function(a,b,error){
                    alert(error);
                }
            });
        },

        /**
         * Self-descritive
         */
        load_test = function( path ){
            clearInterval(refresher.output.handler);
            $.ajax({
                url: '?',
                data: { nwc_ajax: 'load_test', 'rel_path': path },
                type: 'post',
                dataType:'json',
                success: function(data){
                    $('#autosave_flag').html('');
                    var paths = path.split('/');
                    tests.current = path;
                    update_hash();
                    $('#uname').val(paths[0]);
                    $('#ttype').val(paths[1]);
                    if('casper' === paths[1])
                        $('.ttype-switcher span:nth-child(2)').addClass('active').siblings().removeClass('active');
                    else
                        $('.ttype-switcher span:nth-child(1)').addClass('active').siblings().removeClass('active');
                    $('#tname').val(paths[2]);
                    tests.editor.getDoc().setValue(data.code);
                    $('#test-results').html(data.results);
                    $('#run-test').attr('disabled', false).val('Run');
                },
                error: function(a,b,error){
                    $('#uname').val('');
                    $('#tname').val('');
                    $('#tcontent').html(error);
                    $('#run-test').attr('disabled', false).val('Run');
                }
            });
        },
        
        /**
         * Self-descritive
         */
        save_code = function(){
            //check data before saving
            var user = $('#uname').val();
            if(!user) return alertit();
            var ttype = $('#ttype').val();
            var tname = $('#tname').val();
            if(!tname) return alertit();
            var tcontent = tests.editor.getDoc().getValue();
            if(!tcontent) return alertit();
            var btype = $('#browser_type').val();
            $.ajax({
                url: '?',
                data: {
                    nwc_ajax: 'save_test',
                    uname: user,
                    ttype: ttype,
                    tname: tname,
                    tcontent: tcontent,
                    btype: btype
                },
                type: 'post',
                dataType:'json',
                error: function(a,b,error){
                    alert(error);
                },
                success: function(data){
                    tests.current = user + '/' + ttype + '/' + tname + '/body.js';
                    update_hash();
                    $('#autosave_flag').html(data);
                }
            });
        },

        /**
         * Update hash link tags for the current front-end rendering
         */
        update_hash = function(){
            location.hash = tests.search + '&' + tests.page + '&' + tests.current;
            if(tests.editor.getOption('fullScreen')) location.hash += '&full';
            if($('div.fs-hover').length) location.hash += '&output';
        },

        /**
         * Toggle output panel in fullscreen editor mode
         * @param on
         */
        toggle_output = function( on ){
            if(on){
                $('.test-run-results').addClass('fs-hover').focus();
                $('div.CodeMirror-code').click(function(){
                    if(!$('div.fs-hover').length) return;
                    clearInterval(refresher.output.handler);
                    $('div.fs-hover').removeClass('fs-hover');
                    update_hash();
                });
                $('div.fs-hover').off('keydown').on('keydown', function( e ){
                    if(e.keyCode === 27)
                        perform_esc();
                });
            }else
                $('.test-run-results').removeClass('fs-hover');
            update_hash();
        },

        /**
         * Toggle editor fullscreen mode
         * @param on
         */
        toggle_fullscreen = function( on ){
            tests.editor.setOption("fullScreen", on);
            tests.editor.focus();
            if( on )
                refresher.autosave.handler = setInterval(save_code, refresher.autosave.delay);
            else {
                clearInterval(refresher.autosave.handler);
                $('div.fs-hover').removeClass('fs-hover');
            }
            update_hash();
        },

        /**
         * Self-descritive
         */
        stop_test = function(){
            $.ajax({
                url: '?',
                data: {
                    nwc_ajax: 'stop_test',
                    tpath: tests.current
                },
                type: 'post',
                dataType: 'json'
            });
        },

        /**
         * Perform Esc key command
         */
        perform_esc = function(){
            stop_test();
            clearInterval( refresher.output.handler );
            if($('div.fs-hover').length) {
                toggle_output(false);
                tests.editor.focus(); 
            }else
                toggle_fullscreen( false );
        },

        /**
         * Self-descritive
         */
        init_code_editor = function(){
            //CodeMirror.
            tests.editor = CodeMirror.fromTextArea( document.getElementById("tcontent"), {
                lineNumbers: true,
                styleActiveLine: true,
                matchBrackets: true,
                theme:'dracula',
                extraKeys: {
                    "Alt-Enter": function( cm ) {
                        toggle_fullscreen( !cm.getOption("fullScreen") );
                    },
                    "F11": function( cm ) {
                        toggle_fullscreen( !cm.getOption("fullScreen") );
                    },
                    "Ctrl-Space": function( cm ) {
                        toggle_fullscreen( !cm.getOption("fullScreen") );
                    },
                    "Esc": function(cm) {
                        perform_esc();
                    },
                    "Ctrl-S": function(){
                        save_code();
                        return false;
                    },
                    "Ctrl-Enter": function(cm){
                        toggle_output( cm.getOption("fullScreen") );
                        run_test();
                        return false;
                    },
                    "Ctrl-F9": function(cm){
                        if( ! cm.getOption("fullScreen") ) return;
                        toggle_output(!$('.fs-hover').length);
                        return false;
                    },
                    "Ctrl-R": function(cm){
                        CodeMirror.commands.replaceAll(cm);
                        return false;
                    },
                    "Ctrl-F": function(cm){
                        CodeMirror.commands.find(cm);
                        return false;
                    },
                    "Ctrl-D": function(cm){ //custom duplicate line
                        var current_cursor = cm.doc.getCursor();
                        var line_content = cm.doc.getLine(current_cursor.line);
                        CodeMirror.commands.goLineEnd(cm);
                        cm.doc.replaceSelection("\n");
                        cm.doc.replaceSelection(line_content);
                        cm.doc.setCursor(current_cursor.line + 1, current_cursor.ch);
                        return false;
                    }
                },
                scrollbarStyle: "overlay"
            });
        },
        
        /**
         * Self-descritive
         */
        get_output = function(){
            $.ajax({
                url: '?',
                data: { nwc_ajax: 'get_output' },
                type: 'post',
                dataType:'json',
                success: function(data){
                    $('#test-results').html(data);
                },
                error: function(a,b,error){
                    $('#test-results').html(error);
                }
            });
        },

        /**
         * Alert incomplete data filling
         */
        alertit = function(){
            alert('Insufficient data. Please, fill in all fields (user or test name not defined?)');
            $('#run-test').attr('disabled', false).val('Run');
        },

        /**
         * Self-descritive
         */
        run_test = function(){
            clearInterval(refresher.output.handler);
            $('#run-test').attr('disabled', true).val('Running...');
            $('#test-results').html('');
            //check data before launch
            var user = $('#uname').val();
            if(!user) return alertit();
            var ttype = $('#ttype').val();
            var tname = $('#tname').val();
            if(!tname) return alertit();
            var tcontent = tests.editor.getDoc().getValue();
            if(!tcontent) return alertit();
            var btype = $('#browser_type').val();
            $.ajax({
                url: '?',
                data: {
                    nwc_ajax: 'run_test',
                    uname: user,
                    ttype: ttype,
                    tname: tname,
                    tcontent: tcontent,
                    btype: btype
                },
                type: 'post',
                dataType:'json',
                success: function(data){
                    tests.current = user + '/' + ttype + '/' + tname + '/body.js';
                    refresher.output.handler = setInterval( get_output, refresher.output.delay );
                    setTimeout(function(){
                        $('#run-test').attr('disabled', false).val('Run');
                    }, 6000);
                    clearTimeout( refresher.output.tohandler );
                    refresher.output.tohandler = setTimeout(function(){
                        clearInterval(refresher.output.handler);
                    }, refresher.output.timeout );
                    update_hash();
                },
                error: function(a,b,error){
                    alert(error);
                    $('#run-test').attr('disabled', false).val('Run');
                }
            });
        },

        /**
         * Self-descritive
         */
        stop_server = function(){
            if($('.stop-server').attr('disabled')) return;
            $('.stop-server').attr('disabled', true).html('');
            var onduty = setInterval( function(){
                $('.stop-server').html( $('.stop-server').html() + '.' );
            }, 1000 );
            clearTimeout(refresher.server.handler);
            $.ajax({
                url: '?',
                data: { nwc_ajax: 'stop_server' },
                type: 'post',
                dataType:'json',
                success: function(data){
                    if(data.indexOf('ERROR')>0)
                        alert(data);
                    else
                        check_server();
                },
                error: function(a,b,error){
                    $('#selenium-state').html(error);
                },
                complete: function() {
                    clearInterval( onduty );
                }
            });
        },

        /**
         * Register more ports for testing
         */
        extend_server = function(){
            if($('.extend-server').attr('disabled')) return;
            $('.extend-server').attr('disabled', true).html('');
            var onduty = setInterval( function(){
                $('.extend-server').html( $('.extend-server').html() + '.' );
            }, 1000 );
            clearTimeout(refresher.server.handler);
            $.ajax({
                url: '?',
                data: { nwc_ajax: 'extend' },
                type: 'post',
                dataType:'json',
                success: function(data){
                    if(data.indexOf('ERROR')>0)
                        alert(data);
                    else
                        check_server();
                },
                error: function(a,b,error){
                    $('#selenium-state').html(error);
                },
                complete: function() {
                    clearInterval( onduty );
                }
            });
        },

        /**
         * Self-descritive
         */
        run_server = function(){
            if($('.run-server').attr('disabled')) return;
            $('.run-server').attr('disabled', true).html('');
            var onduty = setInterval( function(){
                $('.run-server').html( $('.run-server').html() + '.' );
            }, 1000 );
            clearTimeout(refresher.server.handler);
            $.ajax({
                url: '?',
                data: { nwc_ajax: 'start_server' },
                type: 'post',
                dataType:'json',
                success: function(data){
                    if(data.indexOf('ERROR')>0)
                        alert(data);
                    else
                        check_server();
                },
                error: function(a,b,error){
                    $('#selenium-state').html(error);
                },
                complete: function() {
                    clearInterval( onduty );
                }
            });
        },

        /**
         * Self-descritive
         */
        check_server = function(){
            clearTimeout(refresher.server.handler);
            $.ajax({
                url: '?',
                data: { nwc_ajax: 'check_server' },
                type: 'post',
                dataType:'json',
                success: function(data){
                    $('#selenium-state').html(data);
                    refresher.server.handler    = setTimeout( check_server,    refresher.server.delay );
                    $('.run-server').off().on('click', run_server);
                    $('.extend-server').off().on('click', extend_server);
                    $('.stop-server').off().on('click', stop_server);
                },
                error: function(a,b,error){
                    $('#selenium-state').html(error);
                }
            });
        },

        /**
         * Self-descritive
         */
        reset_search = function(){
            clearTimeout(refresher.tests.handler);
            $('#tests').html('<ul><li>Fetching...</li></ul>');
            $('.search-tests input').val('');
            tests.search = '';
            tests.page = 1;
            update_hash();
            $('a.reset-search').css('visibility', 'hidden');
            get_tests();
        },

        /**
         * Self-descritive
         */
        search_tests = function( search_string ){
            clearTimeout(refresher.tests.handler);
            $('#tests').html('<ul><li>Searching...</li></ul>');
            tests.search = search_string;
            tests.page = 1;
            update_hash();
            $('a.reset-search').css('visibility', 'visible');
            get_tests();
        },

        /**
         * Assign events in tests list
         */
        assign_test_events = function(){
            $('.pager span:not(.active)').on('click', function(e){
                tests.page = Number( $(this).html() );
                update_hash();
                get_tests();
            });
            $('.load-test').on( 'click', function(e){ load_test( $(this).data('path') ); } );
            $('.delete-test').on( 'click', function(e){ delete_test( $(this).data('path') ); } );
        },

        /**
         * Self-descritive
         */
        get_tests = function(){
            clearTimeout(refresher.tests.handler);
            $.ajax({
                url: '?',
                data: { nwc_ajax: 'get_tests', page: tests.page, search: tests.search },
                type: 'post',
                dataType:'json',
                success: function(data){
                    $('#tests').html(data);
                    refresher.tests.handler     = setTimeout( get_tests,       refresher.tests.delay );
                    assign_test_events();
                },
                error: function(a,b,error){
                    $('#tests').html(error);
                }
            });
        };
    return {

        /**
         * Initialize
         */
        init : function(){
            $(document).ready(function(){
                //get data
                check_server();
                //assign events
                $('#run-test').on( 'click', run_test );
                $('.ttype-switcher span').on('click', function(){
                    $(this).addClass('active').siblings().removeClass('active');
                    $('#ttype').val( $(this).html() );
                });
                $('.browser-switcher span').on('click', function(){
                    alert('SlimerJS is currently disabled.');
                    // $(this).addClass('active').siblings().removeClass('active');
                    // $('#browser_type').val( $(this).html() );
                });
                $('.search-tests input').on('keyup', function(e){
                    if(e.keyCode===13) search_tests( $(this).val() );
                });
                $('.search-tests a.reset-search').on('click', reset_search);
                init_code_editor();
                //parse url and load test
                var s = window.location.hash.replace('#','').split('&');
                console.log(s);
                if(s[0]) {
                    $('.search-tests input').val(s[0]);
                    search_tests(s[0]);
                }
                if(s[1]>1){
                    tests.page = s[1];
                }
                get_tests();
                if(s[2]) {
                    tests.current = s[2];
                    load_test(s[2]);
                }
                if('full' === s[3]) toggle_fullscreen( true );
                if('output' === s[4]) toggle_output( true );
            })
        }
    }
})(jQuery);

nwc_js.init();