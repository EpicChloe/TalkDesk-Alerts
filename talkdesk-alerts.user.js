// ==UserScript==
// @name         TalkDesk Alerts
// @namespace    TDAA
// @version      1.2
// @description  Marks Agents in TalkDesk that have long talk times as well as coloring calls in queue and longest wait.
// @author       Chris Pittelko
// @match        https://*.mytalkdesk.com/
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @updateURL    https://github.com/EpicChloe/TalkDesk-Alerts/raw/master/talkdesk-alerts.user.js
// @grant        GM_addStyle
// ==/UserScript==

(function(){
    
    /* Settings:
       callLength: Time in minutes to highlight an Agent on a call.
       callsWaitingWarning: Number of calls to change to warning colors
       callsWaitingDanger: Number of calls to change to danger colors
       waitTimeWarning: Time in minutes to change to warning colors
       waitTimeDanger: Time in minutes to change to danger colors
    */
    
    var callLength = '30:00',
        callsWaitingWarning = 5,
        callsWaitingDanger = 15,
        waitTimeWarning = '08:00',
        waitTimeDanger = '20:00';
    
    // Adding css
    GM_addStyle('.bg-success{background-color:#dff0d8 !important};');
    GM_addStyle('.bg-warning{background-color:#fcf8e3 !important};');
    GM_addStyle('.bg-danger{background-color:#f2dede !important};');

    // Adding Agent Listing Clocks to watch list
    waitForKeyElements('.clock', highlightAgents, false);
    
    // Highlight Agents with talk times over [callLength]
    function highlightAgents(jNode) {
     
        var seconds = hmsToSeconds(jNode.text());
        
        if ( seconds >= hmsToSeconds(callLength) ) {
         
            jNode.parent().parent().addClass('bg-danger');
            
        }
        
    };
    
    // waitForKeyElements doesn't catch Call Queue updates and Longest Wait Time updates.
    // Creating interval to check elements
    setInterval( function() {
        
        // Variable creation
        var qNode = $('#waiting_queue_size h1'),
            queueSize = qNode.text(),
            tNode = $('#longest_waiting_time h1'),
            queueTime = hmsToSeconds(tNode.text());
        
        console.log('Ping');
        
        // Clearing existing classes
        qNode.parent().removeClass('bg-success').removeClass('bg-warning').removeClass('bg-danger');
        tNode.parent().removeClass('bg-success').removeClass('bg-warning').removeClass('bg-danger');
        
        // Color code Queue size based on [callsWaitingWarning][callsWaitingDanger]
        
        qNode.parent().addClass('bg-success');
        
        if ( queueSize >= callsWaitingWarning ) {
            
            qNode.parent().addClass('bg-warning');
            
        }
        
        if ( queueSize >= callsWaitingDanger ) {
            
            qNode.parent().addClass('bg-danger');
            
        }
        
        // Color code Longest Wait Time based on [waitTimeWarning][waitTimeDanger]
        
        tNode.parent().addClass('bg-success');
        
        if ( queueTime >= hmsToSeconds(waitTimeWarning) ) {
            
            tNode.parent().addClass('bg-warning');
            
        }
        
        if ( queueTime >= hmsToSeconds(waitTimeDanger) ) {
            
            tNode.parent().addClass('bg-danger');
            
        }
        
    }, 5000); // Set interval to 5 seconds
    
    // Helper Functions
    // Converts hh:mm:ss to seconds
    function hmsToSeconds(time) {
        
        var p = time.split(':'),
            s = 0, 
            m = 1;

        while (p.length > 0) {
            
            s += m * parseInt(p.pop(), 10);
            
            m *= 60;
            
        }

        return s;
        
    };
    
})();
