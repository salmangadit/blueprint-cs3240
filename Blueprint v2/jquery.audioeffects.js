//AudioEffects - 2011 - A jQuery Plugin. NRC Studios - http://audioeffects.nrcstudios.info written by: Nolan R Campbell - nuvuscripts@gmail.com
(function($){
       $.fn.audioeffects = function( options, callback ) {
          if (typeof callback == 'function') { // make sure the callback is a function
        callback.call(this); // brings the scope to the callback
    };



         //default options
		options = $.extend({
            volume : 0.9, //0.0 to 1
            theTrigger : "click", //"mouseover" , "mouseout" , "click", "dblclick", "mousemove"
            theStop : "",
            audioId : "", //id of the audio tag on the page
            keycode: 38, //the keycode for a keydown keyup keypress event
            callback: function() {}
		}, options, arguments[0] || {});
     //return each targeted element
    return this.each(function() {
       var $this = $(this);



        var o = $.metadata ? $.extend({}, options, $this.metadata()) : options;
        var audioId = document.getElementById(o.audioId);
        //set volume of the audio
        document.getElementById(o.audioId).volume=o.volume;
        //the event trigger variable
         var $theTrigger = o.theTrigger;
          var $theStop = o.theStop;

         //if key events get keycode else bind event passed
         if ($theTrigger == "keydown" || $theTrigger == "keyup"){
            $this.bind($theTrigger, function(e){
                 if ( e.keycode || e.which == o.keycode ) {
                  audioId.play();
                  o.callback.call(this);
                 }
             });

         }else{ $this.bind($theTrigger, function(){audioId.play(); o.callback.call(this);});   }

         $this.bind($theStop, function(){audioId.pause(); o.callback.call(this);});



 });

};//end each

})(jQuery)

