(function($){
  'use strict';
 
  
  $(window).resize(function(){
     if($(window).width() > 992){
       $(".sidebar").css("left","0");
     } else {
       $(".sidebar").css("left","-200px");
     }
  });

  $(".nav-icon").on("click",function(){
    if($(".sidebar").css("left") == "-200px"){
      $(".nav-icon i").addClass("fa-rotate-90")
      $(".sidebar").css("left","0");
    } else {
      $(".nav-icon i").removeClass("fa-rotate-90")
      $(".sidebar").css("left","-200px");
    }
  });
  
  $(".right-overlay").mouseenter(function(){
      $(".select-user h2").html("other left");
    }).mouseleave(function(){
      $(".select-user h2").html("Select a person from the menu on the left");
    });
    
  if($(window).width() < 993){
    $(".nav-icon").trigger("click");
  }
  
})(jQuery);
