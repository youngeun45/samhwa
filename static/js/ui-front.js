/********************************
 * UI 스크립트 *
 * 작성자 : 안효주 *
 ********************************/
$(document).ready(function(){
	preLoading();
	deviceCheck();

	headerUI();
	footerUI();
	htmlInclude();
	commonUI();
	etcUI();
	popupUI();
	swiperInit();
	
	btnUI();
	tabUI();
	toggleUI('.btn_toggle_01', false);
	scrollItem();
	if($('.ui-scroll-on').length > 0)scrollOn();
	
	$(window).load(function(){
		$(window).resize();
	});

	$('.iframe').iFrameSizer({
		log                    : true,  // For development
		autoResize             : true,  // Trigering resize on events in iFrame
		contentWindowBodyMargin: 8,     // Set the default browser body margin style (in px)
		doHeight               : true,  // Calculates dynamic height
		doWidth                : false, // Calculates dynamic width
		enablePublicMethods    : true,  // Enable methods within iframe hosted page 
		interval               : 0,     // interval in ms to recalculate body height, 0 to disable refreshing
		scrolling              : false, // Enable the scrollbars in the iFrame
		callback               : function(messageData){ // Callback fn when message is received
   /*          $('p#callback').html(
				  '<b>Frame ID:</b> '    + messageData.iframe.id +
				  ' <b>Height:</b> '     + messageData.height +
				  ' <b>Width:</b> '      + messageData.width + 
				  ' <b>Event type:</b> ' + messageData.type
			 );
			 */
		}
   });
});

var preLoading = function(){
	var isAppPreLoading = sessionStorage.getItem('isPreLoading'),
		$class = 'pre_loading',
		$imgarry = [
			'/static/images/common/logo_white.png',
			'/static/images/common/logo_red.png',
			'/static/images/common/btn_gnb_open.png',
			'/static/images/common/btn_gnb_open2.png',
			'/static/images/common/head_search.png',
			'/static/images/common/head_search2.png',
			'/static/images/common/btn_gnb_close.png',
			'/static/images/common/btn_pop_close.png'
		];
		
	if(isAppPreLoading != 'true'){
		var $html = '<div class="'+$class+'">';
		for(var i in $imgarry){
			$html += '<span style="background-image:url('+$imgarry[i]+');"></span>';
		}
		$html += '</div>';
	
		sessionStorage.setItem('isPreLoading',true);
		$('body').append($html);
	}
};

var isMobile = {
	Android :function(){
		return navigator.userAgent.match(/Android/i) == null ? false : true;
	},

	BlackBerry :function(){
		return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
	},

	iOS :function(){
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
	},

	Opera :function(){
		return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
	},

	Windows :function(){
		return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
	},

	any :function(){
		return ( isMobile.Android() || isMobile.iOS() || isMobile.BlackBerry() || isMobile.Opera() || isMobile.Windows());
	},
	add :function(){
		if(isMobile.any()){
			if(isMobile.iOS())$('html').addClass('ios');
			if(isMobile.Android())$('html').addClass('android');
		}
	}
};

var deviceCheck = function(){
	isMobile.add();
};

var headerUI = function(){
	var $header = $('#header'),
		$gnbTxt = $('#gnb a'),
		$pageTitle = $('#pageTit');									//gnb, lnb, title에 쓰일 텍스트지정
		
	if($pageTitle.length > 0 && !$('body').hasClass('main')){
		var $current = $.trim($pageTitle.text());
		document.title = $current + ' | 삼화페인 모바일';			//#pageTit 가 title태그에 삽입

		if($('#gnb').length){
			$gnbTxt.each(function() {
				if ( $(this).text() == $current) {
					$(this).parents('li').addClass('active');
				}
			});
		}
	}

	if($('#pageTop').hasClass('visual')){
		$header.addClass('type2');
	}

	//GNB UI
	$('.btn_gnb').click(function(e){
		e.preventDefault();
		if($('body').hasClass('gnb_open')){	
			$('body').removeClass('gnb_open');
		}else{	
			$('body').addClass('gnb_open');	
		}
	});
	$('.btn_gnb_open').on('click',function(e){
		e.preventDefault();
		$('body').addClass('gnb_open');
	});
	$('.btn_gnb_close').on('click',function(e){
		e.preventDefault();
		$('body').removeClass('gnb_open');
	});
	$('#gnb .in_sub').on('click', function(e){
		e.preventDefault();
		$(this).next('ul').stop().slideToggle();
		$(this).parent().toggleClass('on').siblings().removeClass('on').find('ul').slideUp();
	});

	//헤더 검색버튼
	$('.head_search').click(function(e){
		e.preventDefault();
		if($('body').hasClass('search_open')){	
			$('body').removeClass('search_open');
		}else{	
			$('body').addClass('search_open');
		}
		$('html,body').scrollTop(0);
	});
	$('.btn_search_close').on('click',function(e){
		e.preventDefault();
		$('body').removeClass('search_open');
		$('html,body').scrollTop(0);
	});
	

	//스크롤 시(리사이즈 시) 헤더 고정, visual 영
	if($header.length > 0){
		$(window).on('scroll resize',function(){
			var $scrollTop = $(this).scrollTop(),
				$contTop = $('#contents').offset().top;
			
			if($scrollTop > $contTop){
				$header.addClass('fixed');
			}else{
				$header.removeClass('fixed');
			}

			if($('#pageTop.visual').length > 0 && $header.hasClass('type2')){
				var $topStart = $('#pageTop').offset().top,
					$topEnd = $('#pageTop').outerHeight();

				if($scrollTop > ($topStart + $topEnd)){
					$header.addClass('on');
				}else{
					$header.removeClass('on');
				}
				$scrollTop = Math.max(0,$scrollTop - $topStart);
				
				if($('body').hasClass('main')){
					if($scrollTop > 0){
						$('.main_bg').addClass('fixed');
						var $height = $(window).height() * 0.65,
							$opacity  = Math.max(0.5,Math.min(1,$scrollTop/$height)),
							$opacity2  = 1 - Math.max(0,Math.min(0.9,$scrollTop/($height * 0.5)));
						$('#pageTit').css('opacity',$opacity);
						$('#pageTit').next().css('opacity',(1-$opacity));
						$('.main_navi, .main_banner .cont').css('opacity',$opacity2);
					}else{
						$('.main_bg').removeClass('fixed');
					}
				}else{
					$('#pageTop.visual .bg').css('top',($scrollTop/2));
				}
			}
		});
	}
};

var footerUI = function(){
	//btnTop
	$('#btnTop').on('click',function(e){
		e.preventDefault();
		$('html,body').animate({'scrollTop':0},500);
	});
	$('.popBtnTop').on('click',function(e){
		e.preventDefault();
		$(this).closest('.pop_wrap').animate({'scrollTop':0},500);
	});
	
};

var htmlInclude = function(){
	var $elements = $.find('*[data-include-html]');
	if($elements.length){
		$.each($elements, function() {
			var $this =  $(this),
				$html = $this.data('include-html'),
				$htmlAry = $html.split('/'),
				$htmlLast = $htmlAry[$htmlAry.length - 1];
			
			$this.load($html,function(res,sta,xhr){
				if(sta == "success"){
					console.log('Include '+$htmlLast+'!');
					$this.children().unwrap();
					if($htmlLast == 'header.html'){
						headerUI();
						$(window).resize();
					}
					if($htmlLast == 'footer.html')footerUI();
				}
			});  
		});
	}
};

var commonUI = function(){

	//focus
	$(document).on('focusin','input, select, textarea',function(){
		$(this).addClass('focus');
	}).on('focusout','input, select, textarea',function(){
		$(this).removeClass('focus');
	});

	//input:file
	$(document).on('focus','.input_file .input',function(){
		$(this).closest('.input_file').find('.btn_file input').trigger('click');
	});
	$(document).on('click','.input_file .btn_file .button',function(e){
		e.preventDefault();
		$(this).closest('.btn_file').find('input').trigger('click');
	});
	$(document).on('change','.input_file .btn_file input',function(){
		$(this).closest('.input_file').find('.input').val($(this).val());
	});

	//input-del : input 입력 삭제버튼
	$('.input_del').each(function(){
		var $parent = $(this).parent();
		if(!$parent.hasClass('input_box'))$parent.addClass('input_box');
		if($(this).siblings('.btn_search').size() > 0)$parent.addClass('type2');
	});
	$(document).on('click','.input_del',function(e){
		e.preventDefault();
		var $input = $(this).siblings('input');
		$input.val('').focus();
		if($(this).closest('.search_input').length)$(this).closest('.search_input').removeClass('on');
	});
	$(document).on('keyup','.search_input .input',function(){
        var $val = $(this).val();
        if($val != ''){
            $('.search_input').addClass('on');
        }else{
            $('.search_input').removeClass('on');
        }
	});
	$(document).on('click','.search_input .button',function(){
		$('.search_input').removeClass('on');
		$('.search_input .input').val('');
  });

	
	//select_list
	$(document).on('click','.select_list > a',function(e) {
		e.preventDefault();
		var $parent = $(this).parent();
		if($parent.hasClass('on')){
			$parent.removeClass('on');
		}else{
			$('.select_list').removeClass('on');
			$(this).parent().addClass('on');
		}
	});
	$(document).on('click','.select_list .option',function(e) {
		if(!$(this).hasClass('link')){
			e.preventDefault();
			var $html = $(this).html();
			$(this).parent().addClass('selected').siblings().removeClass('selected');
			$(this).closest('.select_list').removeClass('on').children('a').html($html);
		}
	});

	//fake_select
	$(document).on('change','.fake_select select',function(e) {
		var $selected = $(this).find(':selected');
		$(this).siblings('span').text($selected.text());
	});
};


var etcUI = function(){
	//faq_list
	$(document).on('click','.faq_list > li > a',function(e){
		e.preventDefault();
		$(this).next('div').slideToggle(300).parent().toggleClass('on').siblings('li').removeClass('on').children('div').slideUp(300);
	});
};

/* 레이어 팝업 */
var $popSpeed = 300,
	$popOpenBtn = '';
var popupUI = function(){
	$(document).on('click','.ui-pop-open',function(e) {
		e.preventDefault();
		var $pop = $(this).attr('href');
		popOpen($pop,this);
	});
	$(document).on('click','.ui-pop-close',function(e) {
		e.preventDefault();
		var $pop = $(this).closest('.pop_wrap');
		popClose($pop);
	});

	/*
	//팝업 bg 클릭시 닫힘 기능
	$('.pop_wrap').on('click',function(){
		var $pop = $(this);
		if(!$pop.hasClass('close_none')){popClose($pop);} 	//배경 클릭시 안닫히게 할때는 close_none 클래스 추가로 처리
	}).on('click','.popup',function(e) {
		e.stopPropagation();
	});
	*/
};
var popOpen = function(tar,btn){
	if($(tar).length < 1 || $(tar).children('.popup').length < 1) return console.log('해당팝업없음');
	var $visible = $('.pop_wrap:visible').size();
	if(btn != null || btn != window)$popOpenBtn = $(btn);
	if($visible > 0){
		$(tar).css('z-index','+='+$visible);
	}
	$('body').addClass('pop_open');	
	$(tar).fadeIn($popSpeed,function(){
		$(this).attr({'tabindex':0}).focus();
	});
	if($sliders.length > 0 && $(tar).find('.ui-swiper').length > 0){
		for(var i in $sliders){
			$sliders[i].reInit();
		}
	}
};
var popClose = function(tar){
	var $visible = $('.pop_wrap:visible').size();
	if($visible == 1){
		$('body').removeClass('pop_open');
	}
	$(tar).find('.popup').animate({'margin-top':0},$popSpeed,function(){
		$(this).removeAttr('style');
	});
	$(tar).fadeOut($popSpeed,function(){
		$(tar).removeAttr('tabindex');
		if($popOpenBtn != ''){
			if($popOpenBtn != window){
				$popOpenBtn.focus();
			}
			$popOpenBtn = '';
		}
	});
};

/* 다중 Swiper */
var swiperInit = function(){
	if($('.ui-swiper').length > 0)multiSwiper('.ui-swiper');
};
var $sliders = [];
var multiSwiper = function (tar){
	$(tar).each(function(i, element){
		var $list = $(this).find('.swiper-container'),
			$prev = $(this).find('.ui-prev'),
			$next = $(this).find('.ui-next'),
			$pagination = $(this).find('.pagination'),
			$length = $list.find('.swiper-slide').length;

		//console.log($length);

		$list.addClass('ui-swipe-s'+i);
		if($prev.length > 0){
			$prev.addClass('ui-swipe-l'+i);
		}
		if($next.length > 0){
			$next.addClass('ui-swipe-r'+i);
		}
		if($pagination.length > 0){
			$pagination.addClass('ui-swipe-p'+i);
		}
		var slider = new Swiper('.ui-swipe-s'+i, {
			//slidesPerView:'auto',
			calculateHeight:true,
			pagination:'.ui-swipe-p'+i,
			paginationClickable : true,
			resizeReInit:true,
			onInit:function(swiper){
				var wid = $(swiper.container).width(),
					wid2 = $(swiper.container).find('.swiper-wrapper').width();
				$('.ui-swipe-l'+i).addClass('disabled');
				if(wid >= wid2){
					$('.ui-swipe-r'+i).addClass('disabled');
				}
			},
			onSlideChangeStart: function(swiper){
				var $i = swiper.activeIndex,
					$l = swiper.visibleSlides.length;
				if($i == 0){
					$('.ui-swipe-l'+i).addClass('disabled');
				}else{
					$('.ui-swipe-l'+i).removeClass('disabled');
				}
				if(($i+$l) == $length){
					$('.ui-swipe-r'+i).addClass('disabled');
				}else{
					$('.ui-swipe-r'+i).removeClass('disabled');
				}
			}
		});

		$sliders.push(slider);

		$('.ui-swipe-l'+i).click(function(e){
			e.preventDefault();
			$sliders[i].swipePrev();
		});
		$('.ui-swipe-r'+i).click(function(e){
			e.preventDefault();
			$sliders[i].swipeNext();
		});
	});
	
};

/* btn */
var btnUI = function(){
	//a태그 링크 '#', '#none' 이동 방지
	$(document).on('click','a',function(e){
		var $href = $(this).attr('href');
		if($href == '#' || $href == '#none' )e.preventDefault();
	});
	$(document).on('click','.button.disabled',function(e){
		return false;
	});
	

	//버튼 클릭 효과
	$(document).on('click', '.button, .list_link', function(e){
		var $btnEl = $(this),
			$delay = 650,
			$href = $btnEl.attr('href');
		if($href == '#' || $href == '#none')e.preventDefault();

		//if(!$btnEl.hasClass('disabled') && $btnEl.closest('.btn_wrap').size() > 0){
		if(!$btnEl.is('.disabled')){
			if($btnEl.find('.btn_click_in').length == 0) $btnEl.prepend('<i class="btn_click_in"></i>');
			var $btnIn = $btnEl.find('.btn_click_in'),
				$btnMax = Math.max($btnEl.outerWidth(),$btnEl.outerHeight()),
				$btnX = e.pageX - $btnEl.offset().left - $btnMax/2,
				$btnY = e.pageY - $btnEl.offset().top - $btnMax/2;

			$btnIn.css({
				'left':$btnX,
				'top':$btnY,
				'width':$btnMax,
				'height':$btnMax
			}).addClass('animate').delay($delay).queue(function(next){
				$btnIn.remove();
				next();
			});
		}
	});
};

/* tab 기능 */
var tabSwiper;
var tabUI = function(){
	var $onText = '<span class="blind">현재위치</span>';

	$(document).on('click','.ui-tabmenu a',function(e) {
		e.preventDefault();
		var href = $(this).attr('href');
		if(!$(this).parent().hasClass('on')){
			$(href).addClass('on').siblings('.tab_cont').removeClass('on');
			$(this).prepend($onText).parent().addClass('active').siblings().removeClass('active').find('.blind').remove();
		}

		if($sliders.length > 0 && $(href).find('.ui-swiper').length > 0){
			for(var i in $sliders){
				$sliders[i].reInit();
			}
		}

		//웹 접근성 보완
		var $role = $(this).attr('role');
		if($role == 'tab'){
			var $tabpanel = $(this).attr('aria-controls');
			$(this).attr('aria-selected',true).closest('li').siblings().find('[role=tab]').attr('aria-selected',false);
			$('#'+$tabpanel).attr('aria-expanded',true).siblings('[role=tabpanel]').attr('aria-expanded',false);
		}
	});

	var $wrap = $('.tab_wrap');
	if($wrap.length > 0){
		$(window).on('scroll resize',function(){
			var $scrollTop = $(this).scrollTop(),
				$haedH = $('#header').outerHeight();

			$wrap.each(function(index, element){
				var $this = $(this),
					$thisTop = $this.offset().top,
					$height = $this.outerHeight(),
					$st = Math.floor($thisTop) + $height;
				
				$this.css('height',$height);
				if($st <= $scrollTop){
					$this.addClass('fixed');
				}else{
					$this.removeClass('fixed');
				}
			});
		});
	}

	tabSwiper = $('.tabmenu.swiper-container').swiper({		
		calculateHeight: true,
		slidesPerView: 'auto',
		//resizeReInit: true,
		onFirstInit: function(swiper){
			var $width = swiper.wrapper.clientWidth;
			$(swiper.wrapper).css('width',$width+5);
		},
		onInit: function(swiper){
			var $width = swiper.wrapper.clientWidth;
			$(swiper.wrapper).css('width',$width+5);
		}
	});
	if($('.tabmenu').hasClass('color_lnb')){
		var $ldx = $('.swiper-wrapper li.on').index();
		//console.log($ldx)
		tabSwiper.swipeTo($ldx)
	}
	$(window).load(function(){
		var $href = location.href;

		if($('.ui-tabmenu').length > 0){
			$('.ui-tabmenu').each(function(index, element) {
				var $this = $(this);
				$this.find('li').eq(0).find('a').trigger('click');
			});
		}
	});
};

/* 토글 기능 */
var $toggleSpeed = 500;
var toggleUI = function(btn,isTxtChange){
	$(document).on('click',btn,function(){
		if($(this).hasClass('disabled')) return;
		var $target,
			isList = false;
		if($(this).parents('.toggle-list').size() > 0){
			$target = $(this).closest('li').find('.toggle_cont');
			isList = true;
		}else{
			$target = $(this).data('target');
		}
		if($($target).is(':animated')) return;
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			if(isTxtChange)$(this).text('상세보기 열기');
			$($target).stop().slideUp($toggleSpeed);
		}else{
			$(this).addClass('on');
			if(isTxtChange)$(this).text('상세보기 닫기');
			if(isList){
				$($target).closest('li').siblings().find(btn).removeClass('on');
				$($target).closest('li').siblings().find('.toggle_cont').not('.no-toggle').stop().slideUp($toggleSpeed);
			}
			$($target).stop().slideDown($toggleSpeed,function(){
				toggleScroll(this);
			});
		}
	});
};
var toggleScroll = function(tar){
	var $scrollTop = $(window).scrollTop(),
		$winH = $(window).height(),
		$top = $(tar).offset().top,
		$height = $(tar).outerHeight(),
		$gap = ($top+$height)-($scrollTop+$winH);
	if($('.btn_wrap.fixed').length > 0)$gap += $('.btn_wrap.fixed').outerHeight();
	var	$scroll = Math.min($top,$scrollTop+$gap);
	if($gap>0)$('html, body').stop().animate({'scrollTop':$scroll},$toggleSpeed);
};

/* 스크롤 애니메이션 */
var scrollItem = function(){
	var $elements = $.find('*[data-animation]'),
		$window = $(window);

	$(window).on('scroll resize',function(){
		$elements = $.find('*[data-animation]');
		if($elements.length > 0){
			checkInView();
		}
	});

	function checkInView(){
		var $wHeight = $window.height(),
			$scrollTop = $window.scrollTop(),
			$winBottom = ($scrollTop + $wHeight - 50);

		$.each($elements, function(){
			var $el = $(this),
				$elHeight = $($el).outerHeight(),
				$elTop = $($el).offset().top,
				$elBottom = $elTop + $elHeight,
				$animationClass = $el.data('animation'),
				$delay = $el.data('delay'),
				$duration = $el.data('duration'),
				$animationIn = $el.data('animation-in');

			if(!$el.hasClass('animated') && $animationClass != 'on'){
				if($delay>0){
					$el.css({
						'-webkit-animation-delay':$delay+'ms',
						'animation-delay':$delay+'ms'
					});
				}
				if($duration>0){
					$el.css({
						'-webkit-animation-duration':$duration+'ms',
						'animation-duration':$duration+'ms'
					});
				}
				$el.addClass('animated');
			}
			if($animationIn){
				if(($elTop >= $scrollTop) && ($elBottom <= $winBottom)){
					$el.addClass($animationClass);
				}else{
					$el.removeClass($animationClass);
				}
			}else{
				if(($elBottom >= $scrollTop) && ($elTop <= $winBottom)){
					$el.addClass($animationClass);
				}
			}
		});
	}
};

function scrollOn(){
	var tar = '.cr_case_wrap li',
		navi = '.ui-scroll-on';

	$('.ui-scroll-on a').on('click',function(e){
		e.preventDefault();
		var $idx = $(this).closest('li').index();
			$scrollTop = ($(tar).eq($idx).offset().top) - 121;
		$('html,body').animate({'scrollTop':$scrollTop},300);
	});

	$(window).bind('scroll resize',function(){
		var winH = $(window).height(),
			scrollTop = $(this).scrollTop(),
			center = scrollTop+(winH/2);
		var idxArry  = [];
		$(tar).each(function(e){
			var secH = $(this).outerHeight(),
				secS = $(this).offset().top;
			
			if(center >= secS){
				idxArry.push(e);
			}
		});
		var $idxMax = Math.max.apply(null, idxArry);

		$(navi).find('.swiper-slide').eq($idxMax).addClass('on').siblings().removeClass('on');
		$(tar).eq($idxMax).addClass('on').siblings().removeClass('on');
		tabSwiper.swipeTo($(navi).find('.swiper-slide.on').index());
	});	
}

/********************************
** plugins **
*********************************/
(function($){
	/* resizeEnd 사용법 : (같은 엘리먼트에 다중 사용 안됨)
	* $(window).resizeEnd(function(){console.log('resizeEnd');},300);
	*/
	$.fn.resizeEnd = function(callback, timeout){
		$(this).resize(function(){
			var $this = $(this);
			if($this.data('resizeTimeout')){
				clearTimeout($this.data('resizeTimeout'));
			}
			$this.data('resizeTimeout', setTimeout(callback,timeout));
		});
	};

	/* scrollEnd 사용법 : (같은 엘리먼트에 다중 사용 안됨)
	* $(window).scrollEnd(function(){console.log('scrollEnd');},300);
	*/
	$.fn.scrollEnd = function(callback, timeout){
		$(this).scroll(function(){
			var $this = $(this);
			if($this.data('scrollTimeout')){
				clearTimeout($this.data('scrollTimeout'));
			}
			$this.data('scrollTimeout', setTimeout(callback,timeout));
		});
	};

	/* changeClass 사용법 :
	* $(this).changeClass('on', 'off');
	*/
	$.fn.changeClass = function(removeClassName,addClassName){
		var element = this;
		element.removeClass(removeClassName).addClass(addClassName);
	};

	/* addRemoveClass 사용법 :
	* $(this).addRemoveClass('on', 500, 1000);
	*/
	$.fn.addRemoveClass = function(className,addTime,removeTime){
		var element = this;
		var addIt = function(){
			element.addClass(className);
		};
		var removeIt = function(){
			element.removeClass(className);
		};
		setTimeout(function(){addIt();setTimeout(removeIt,removeTime);},addTime);
		return this;
	};

	/* scrollIn 사용법 :
	* $(this).scrollIn();
	* ios 나 안드로이드에서 focus() 했을때 스크롤 안되는 현상 대체함수
	*/
	$.fn.scrollIn = function(){
		var $this = $(this),
			$top = $this.offset().top,
			$wrap = $('html, body'),
			$height = $(window).height() - 50;
		setTimeout(function(){
			var $scrollTop = $(window).scrollTop();
			if($top <= $scrollTop || ($scrollTop+$height) <= $top){
				$wrap.stop().animate({'scrollTop':($top-50)},300);
			}
		},50);
		return this;
	};
}(jQuery));