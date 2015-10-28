// ==UserScript==
// @name         TalkDesk Alerts
// @namespace    TDAA
// @version      1.0
// @description  Marks Agents in TalkDesk that have long talk times as well as coloring calls in queue and longest wait.
// @author       Chris Pittelko
// @match        https://*.mytalkdesk.com/
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
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
        callsWaitingWarning = 10,
        callsWaitingDanger = 20,
        waitTimeWarning = '8:00',
        waitTimeDanger = '20:00';
    
    // Adding css
    GM_addStyle('.bg-success{background-color:#dff0d8};');
    GM_addStyle('.bg-warning{background-color:#fcf8e3};');
    GM_addStyle('.bg-danger{background-color:#f2dede};');

    // Adding Agent Listing Clocks to watch list
    waitForKeyElements('.clock', highlightAgents);
    
    // Adding Calls in Queue to watch list
    waitForKeyElements('#waiting_queue_size', highlightQueueSize);
    
    // Adding Longest Wait Time in Queue to watch list
    waitForKeyElements('#longest_waiting_time', highlightQueueTime);
    
    // Highlight Agents with talk times over [callLength]
    function highlightAgents(jNode) {
     
        var seconds = hmsToSeconds(jNode.text());
        
        if ( seconds >= hmsToSeconds(callLength) ) {
         
            jNode.parent().css('background', 'red').css('color', 'white');
            
        }
        
    };
 
    // Color code Queue size based on [callsWaitingWarning][callsWaitingDanger]
    function highlightQueueSize(jNode) {
    
        var queueSize = jNode.text().replace('Calls in Queue', '');
        
        jNode.addClass('bg-success');
        
        if ( queueSize >= callsWaitingWarning ) {
            
            jNode.addClass('bg-warning');
            
        }
        
        if ( queueSize >= callsWaitingDanger ) {
            
            jNode.addClass('bg-danger');
            
        }
    
    };
    
    // Color code Longest Wait Time based on [waitTimeWarning][waitTimeDanger]
    function highlightQueueTime(jNode) {
    
        var queueTime = hmsToSeconds(jNode.text().replace('Longest Wait Time', ''));
        
        jNode.addClass('bg-success');
        
        if ( queueTime >= hmsToSeconds(waitTimeWarning) ) {
            
            jNode.addClass('bg-warning');
            
        }
        
        if ( queueTime >= hmsToSeconds(waitTimeDanger) ) {
            
            jNode.addClass('bg-danger');
            
        }
    
    };
    
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
