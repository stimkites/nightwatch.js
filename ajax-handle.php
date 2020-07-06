<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 02.04.18
 * Time: 19:10
 */
/**
 * Simple ajax-requests handling
 */

namespace Wetail\NWC;

if(!class_exists(__NAMESPACE__ . '\_Ajax')) :

class _Ajax{

    /**
     * Initialize ajax handler
     */
    public static function init(){
        if (isset($_POST['nwc_ajax']) || isset($_GET['nwc_ajax']))
            die( json_encode( self::handle_ajax( isset($_POST['nwc_ajax'])?$_POST['nwc_ajax']:$_GET['nwc_ajax'] ) ) );
    }

    /**
     * Handle ajax calls
     *
     * @param $command
     * @return mixed
     */
    protected static function handle_ajax( $command ){

        switch($command){

            case'start_server':
                try {
                    shell_exec( 'sh bin/run-selenium.sh > /dev/null 2>/dev/null &' );
                    sleep(4);//let the server to launch
                } catch ( \Exception $e ) {
                    return '[ERROR] Caught exception: ' .  $e->getMessage() . "\n";
                }

            case'extend':
                //extend to 2 ports at least
                $r = 2;
                do{
                    try {
                        //look for free port
                        $port = 8686;
                        do{
                            $port++;
                            $dummy = @file_get_contents("http://localhost:$port/status");
                        }while( $dummy && $port < 9999 );
                        if($port<=9999) {
                            shell_exec('sh bin/reg-driver.sh ' . $port . ' > /dev/null 2>/dev/null &');
                            sleep(3);//let the driver to register
                        }else return '[ERROR] All ports are busy';
                    } catch ( \Exception $e ) {
                        return '[ERROR] Caught exception: ' .  $e->getMessage() . "\n";
                    }
                }while(--$r);

            case'check_server':
                $r = @file_get_contents('http://localhost:5557/wd/hub/status');
                if(!$r)
                    return 'Status: not running. <b><a class="run-server" title="Try to launch Selenium server">Run</a></b>';
                $r = json_decode($r);
            return 'Status: ' . ( false === strpos( $r->value->message, 'No spare' )
                                    ? '<span class="status-green">' . $r->value->message . '</span>'
                                    : '<span class="status-warning">' . $r->value->message
                                            . ' <a class="extend-server" 
                                                   title="Try to extend server">Extend?</a></span>'
                                ) . ' Version: ' . $r->value->build->version . ' <a class="stop-server">Stop</a>';

            case'stop_server':
                try{
                    shell_exec('sh bin/stop-selenium.sh > /dev/null 2>/dev/null &');
                    sleep(4);
                }catch(\Exception $e){
                    return '[ERROR] Caught exception: ' .  $e->getMessage() . "\n";
                }
            return 'OK';

            case'stop_test': return _Tests::stop_test();

            case'run_test': return _Tests::run_test();

            case'save_test': return _Tests::save_test();

            case'get_output': return _Tests::get_current_output();

            case'get_tests': return _Tests::get_all_tests();

            case'load_test': return _Tests::load_test();

            case'delete_test': return _Tests::delete_test();

            default: return false;

        }
    }

}

endif;

_Ajax::init();