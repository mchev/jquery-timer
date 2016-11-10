/**
 * Timer: A simple countdown
 * Author: Martin C. <martinchevignard@gmail.com>, martinchevignard.com
 */

;(function($, window, document, undefined){
	
	// Methods
	var methods = {
		init : function(options) {
			
			options = $.extend({}, $.fn.timer.options, options);
			started = false;
			
			container = $("<div class='mc-timer'/>");
			container.append(
				'<div class="control"><i class="fa fa-play" aria-hidden="true"></i></div>' + 
				'<span class="circle min" data-value="0" data-time="0"><i>0</i><span>Minutes</span></span>' +
				'<span class="circle sec" data-value="0" data-time="0"><i>0</i><span>Secondes</span></span>' +
				'<audio id="timerAlarm" loop><source src="' + options.sound + '" type="audio/mpeg"></audio>'
			);

			this.append(container);
			
			container.find(".circle").circleProgress({
				size: 100,
				thickness: 3,
				startAngle: 0,
				emptyFill: "#FFFFFF",
				fill: "#01ABAA"
			});
			
			this.find('.circle').on('click touch', function () {
				update($(this), options);
			});
			
			this.find('.control').on('click touch', function () {
				if (started) {
					stop();
				} else if (start()) {
					started = true;
				}
			});
			
		},
		start : function(value) {
			start(value);
		},
		hide : function( ) {  },// GOOD
		update : function( content ) { 

		}// !!!
	};
	
	

    $.fn.timer = function ( method ) {
		
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {		
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.timer' );
		}
	
	};
	
        /**
        * Default settings(dont change).
        * You can globally override these options
        * by using $.fn.timer.key = 'value';
        **/
        $.fn.timer.options = {
            'predefined': {},
			'autostart': false,
			'sound' : "sounds/alarm.mp3",
			'steps': {
				'seconds': 5,
				'minutes': 1,
			}
        };
		

		/**
		 * Update the DOM
		 * @param  {Object} el The modified element
		 * @param  {Object} options
		 */
		var update = function(el, options) {
				
			var step = (el.hasClass('min')) ? options.steps.minutes : options.steps.seconds;
			
			var time = parseInt(el.attr('data-time'));
				time = (time < 59) ? (time+step) : 0;
				
			el.attr('data-time', time).find('i').text(time);
			el.circleProgress('value', (time/59));
			
		}
		
		/**
		 * Reset the DOM
		 */
		var reset = function() {
			
			container.find(".circle").attr('data-time', 0).find('i').text(0);
			container.find(".circle").circleProgress('value', 0);
		}
		
		/**
		 * Init the countdown
		 * @param  {String} mmss Minutes and Seconds
		 * @return {Object} duration
		 */
		var setDuration = function(mmss) {
			times = mmss.split(":");
			container.find(".min").circleProgress('value', (times[0]/60)).attr('data-time', times[0]);
			container.find(".sec").circleProgress('value', (times[1]/60)).attr('data-time', times[1]);
			return moment().set({'minutes': times[0], 'seconds': times[1]});
		}
		
		var getDuration = function() {
			var min = parseInt(container.find(".min").attr('data-time'));
			var sec = parseInt(container.find(".sec").attr('data-time'));
			return moment().set({'minutes': min, 'seconds': sec});
		}

		var start = function(value) {
			
			started = true;
			
			var duration = (value) ? setDuration(value) : getDuration();
			
			container.find(".control i").removeClass("fa-play").addClass("fa-stop");
			autostart = setInterval(countdown, 1000);
			
			function countdown() {
				
				if (!duration.seconds() && !duration.minutes()) {
					clearInterval(timer);
					document.getElementById('timerAlarm').play();
					container.addClass('bg-alert');
				} else {
					duration = moment(duration).subtract(1, 'seconds');		
					container.find(".min i").text(duration.format('m'));
					container.find(".sec i").text(duration.format('s'));
					container.find(".min").circleProgress('value', (duration.format('m')/60));
					container.find(".sec").circleProgress('value', (duration.format('s')/60));
				}
			}
			
			return true;

		}

		var stop = function() {
			clearInterval(autostart);
			reset();
			
			document.getElementById('timerAlarm').pause();
			document.getElementById('timerAlarm').currentTime = 0;
			
			container.removeClass('bg-alert');
			container.find(".control i").removeClass("fa-stop").addClass("fa-play");
		}

})(jQuery, window, document);