<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 05.04.18
 * Time: 12:04
 */

/**
 * Tests factory
 */

namespace Wetail\NWC;

if(!class_exists(__NAMESPACE__ . '\_Tests')) :

class _Tests{

    /**
     * Fetch all tests
     *
     * @param $dir
     * @param int $flags
     * @return array
     */
    private static function fetch_tests( $dir, $flags = 0 ) {
        $files = glob( rtrim( $dir, '/' ) . '/*.js', $flags );
        foreach ( glob( rtrim( $dir, '/' ) . '/*', GLOB_ONLYDIR|GLOB_NOSORT ) as $dir)
            $files = array_merge( $files, self::fetch_tests( $dir, $flags ) );
        return $files;
    }

    /**
     * Fetch all existing tests
     *
     * @return string
     */
    public static function get_all_tests(){
        $tests = [];
        $page = (isset($_POST['page'])?(int)$_POST['page']:1);
        $offset_bottom = TESTS_PP * ( $page - 1 );
        $offset_top = $offset_bottom + TESTS_PP;
        $search = (isset($_POST['search'])?$_POST['search']:'');
        $u = self::fetch_tests( TST_DIR );
        sort( $u, SORT_STRING );
        if (empty($u)) return '<ul><li>Not found</li></ul>';
        $ttl_c = 0; $active_page = 1;
        foreach ($u as $i=>$upath)
            if( !$search || false !== strpos( $upath, $search ) ){
                $ttl_c++;
                if($ttl_c>=$offset_bottom && $ttl_c<=$offset_top){
                    $active_page = ceil( $ttl_c / 10 );
                    $tests[basename(dirname(dirname(dirname($upath))))]
                                [basename(dirname(dirname($upath)))]
                                    [basename(dirname($upath))]
                                                =
                                  str_replace(TST_DIR, '', $upath);
                                               //:)
                }
            }
        $r = '<ul class="tests-viewport tests-list">';
        foreach ($tests as $uname => $utests) {
            $r .= '<li>' . $uname .'<ul class="tests-list">';
            foreach ($utests as $ttype => $tests) {
                $r .= '<li>' . $ttype .'<ul class="tests-list">';
                foreach ($tests as $tname => $tpath)
                    $r .= '<li><b><a data-path="' . $tpath . '" 
                                  title="Load test"
                                  class="load-test">' . $tname . '</a> </b><sup><a data-path="' . $tpath . '" 
                                                                          title="Delete test"
                                                                          class="delete-test">x</a></sup></a></li>';
                $r .= '</ul></li>';
            }
            $r .= '</ul></li>';
        }
        $r .= '</ul>';
        $ttl = ceil( $ttl_c / TESTS_PP );
        $rp = '<div class="pager">';
        for($i = 1; $i<=$ttl; $i++)
            $rp .= '<span class="page'.($i == $active_page?' active':'').'">'.$i.'</span>';
        $rp .= ' Total: '.$ttl_c.'</div>';

        return $rp.$r;
    }

    /**
     * Load test
     *
     * @return array
     */
    public static function load_test(){
        $r = [ 'code' => '', 'results' => '' ];
        if(!isset($_POST['rel_path'])) return $r;
        $relative_path = $_POST['rel_path'];
        if( is_file( TST_DIR . $relative_path ) )
            $r['code'] = file_get_contents( TST_DIR . $relative_path );
        if( is_file( TST_DIR . dirname($relative_path) .'/results.txt' ) )
            $r['results'] = self::convertBash( self::decodeErrors( file_get_contents(
                TST_DIR . dirname($relative_path) .'/results.txt'
            ) ) );
        return $r;
    }

    /**
     * Delete test
     *
     * @return bool
     */
    public static function delete_test(){
        if(!isset($_POST['rel_path'])) return '';
        $relative_path = $_POST['rel_path'];
        $test_dir = dirname(TST_DIR . $relative_path);
        $test_type_dir = dirname($test_dir);
        $user_dir = dirname($test_type_dir);
        if( is_file( TST_DIR . $relative_path ) ) {
            $files = glob($test_dir . '/*');
            foreach ($files as $filename) unlink($filename);
            rmdir($test_dir);
        }
        //check if type dir is empty
        $files = glob($test_type_dir . '/*');
        if (empty($files)) rmdir($test_type_dir);
        //check if user is empty
        $files = glob($user_dir . '/*');
        if (empty($files)) rmdir($user_dir);
        return true;
    }

    /**
     * Get current test output
     *
     * @return mixed|string
     */
    public static function get_current_output(){
        if( isset( $_SESSION['running'] ) && is_file( $_SESSION['running'] ) )
            return self::convertBash( self::decodeErrors( file_get_contents( $_SESSION['running'] ) ) );
        return '';
    }

    /**
     * Save and execute test
     *
     * @return bool
     */
    public static function run_test(){
        if(isset( $_SESSION['running'] )) unset($_SESSION['running']);
        if( !self::save_test($tfile) ) return false;
        $_SESSION['running'] = TST_DIR . $_POST['uname'] . '/' . $_POST['ttype'] . '/' . $_POST['tname'] . '/results.txt';
        shell_exec( 'sh bin/run-test-' . $_POST['ttype'] . '-' . $_POST['btype'] . '.sh ' . $tfile . ' > ' . $_SESSION['running'] .' 2>&1 &' );
        return true;
    }

    /**
     * Immediately stop the test
     *
     * @return bool
     */
    public static function stop_test(){
        if(!isset( $_SESSION['running'] )) return true;
        shell_exec('sh bin/stop-test.sh ' . dirname( $_SESSION['running'] ) .' > /dev/null 2>/dev/null &');
        unset( $_SESSION['running'] );
        return true;
    }

    /**
     * Save test
     *
     * @param string $tfile
     * @return string
     */
    public static function save_test( &$tfile = '' ){
        $_SESSION['uname'] = $_POST['uname'];
        if(!is_dir( TST_DIR . $_POST['uname']))
            mkdir( TST_DIR . $_POST['uname']);
        if(!is_dir( TST_DIR . $_POST['uname'] . '/' . $_POST['ttype'] ) )
            mkdir( TST_DIR . $_POST['uname'] . '/' . $_POST['ttype'] );
        if(!is_dir( TST_DIR . $_POST['uname'] . '/' . $_POST['ttype'] . '/' . $_POST['tname'] ) )
            mkdir( TST_DIR . $_POST['uname'] . '/' . $_POST['ttype'] . '/' . $_POST['tname'] );
        $tfile = TST_DIR . $_POST['uname'] . '/' . $_POST['ttype'] . '/' . $_POST['tname'] . '/body.js';
        if( !file_put_contents(  $tfile, $_POST['tcontent'] ) ) return '';
        return 'Saved ' . strftime("%H:%M:%S");
    }

    /**
     * Convert from bash colors into html
     *
     * @param $code
     * @return mixed
     */
    protected static function convertBash($code) {
        $dictionary = array(
            '[1;30m' => '<span style="color:black">',
            '[1;31m' => '<span style="color:red">',
            '[1;32m' => '<span style="color:green">',
            '[1;33m' => '<span style="color:yellow">',
            '[1;34m' => '<span style="color:blue">',
            '[1;35m' => '<span style="color:purple">',
            '[1;36m' => '<span style="color:cyan">',
            '[1;37m' => '<span style="color:white">',
            '[1;90m' => '<span style="color:grey">',
            '[0;30m' => '<span style="color:black">',
            '[0;31m' => '<span style="color:red">',
            '[0;32m' => '<span style="color:green">',
            '[0;33m' => '<span style="color:yellow">',
            '[0;34m' => '<span style="color:blue">',
            '[0;35m' => '<span style="color:purple">',
            '[0;36m' => '<span style="color:cyan">',
            '[0;37m' => '<span style="color:white">',
            '[0;90m' => '<span style="color:grey">',
            '[m'   => '</span>',
            '[0m'   => '</span>'
        );
        $htmlString = str_replace( array_keys($dictionary), $dictionary, $code);
        return $htmlString;
    }

    /**
     * Decode errors from Selenium server
     *
     * @param $htmlstr
     * @return mixed
     */
    protected static function decodeErrors( $htmlstr ){
        $replases = [
            '{' => '',
            '' => '',
            '}' => '',
            "\'" => '',
            "'" => '',
            "<" => '[',
            ">" => ']',
            '\n' => "\r\n"
        ];
        foreach($replases as $rep=>$new)
            $htmlstr = str_replace( $rep, $new, $htmlstr );
        return $htmlstr;
    }

}

endif;