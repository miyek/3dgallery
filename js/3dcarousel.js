//file with json
var dataObj='json/carousel.json';

//function load json object for all page
function LoadMe(v){
    var v = v;
    
    //structure of element
    var structureElement = function(title, desc, index, howmany){
        var li = $('<li></li>');
        $('<h3>'+ title+'</h3>').appendTo(li);
        return li; 
    };
    
    $.getJSON(dataObj)
    //when ok
      .done(function(json) {
            var howmany= json.length;
            var elements = $.map(json, function(item, index){
                return structureElement(item.title, item.description, index, howmany);
            });
            $(v + ' ul').html(elements);
      })
    //error messege
      .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        alert( "Request Failed: " + err );
    });
}

function DDslider(v){
    //main class
    var v = v;
    var vUl = v + ' ul';
    var c, it;
    
    //carousel, change element style
    carousel = function(options){
        var defaults = {
            items: 9, //default number of items (9,7,5,3)
            top: 30, //top px
            duration: 0, //animation duration
            step: 0.2, //step to opacity
        };
        var settings= $.extend(defaults, options);
        
        var middle = parseInt(settings['items']/2+1); // return integer
        //% LEFT MARGIN (POSITION OF ITEMS)
        //25, 12.5, 0, 16.25, 37.5, 58.75, 75, 62.5, 50
        var leftItems9 = [25, 12.5, 0, 16.25, 37.5, 58.75, 75, 62.5, 50];
        var leftItems7 = [12.5, 0, 16.25, 37.5, 58.75, 75, 62.5];
        var leftItems5 = [0, 16.25, 37.5, 58.75, 75];
        var leftItems3 = [0, 37.5, 75];
        var left, item;
        left = (settings['items'] > 7) ? leftItems9 : (settings['items'] > 5) ? leftItems7 : (settings['items'] > 3)? leftItems5 : leftItems3;
        
        //remove all styles
        $(vUl + ' li').removeAttr('style').css('opacity', '0');

        for(var j=0,i=1; i<=settings['items']; i++){
            item = $(vUl + ' li:nth-child('+i+')');
            
            //change j index for top*j (can not * 0)
            (i==1 && middle<=3) ? j++ : false;
               
            //when index < middle number of items
            (i!=1 && i<=middle) ? j++: false;
            //when index > middle number of items
            (i>middle) ? j--: false;
            //when index = middle number of items
            (i==middle) ? item.animate({
                    top : settings['top']*j,
                    left: left[i-1]+'%'
                }, settings['duration']).css({
                    'transform' : 'scale(1)',
                    'opacity' : '1',
                    'z-index' : '9'
                }) : item.animate({
                    top : settings['top']*j,
                    opacity : 0.3 + settings['step'] * j,
                    left: left[i-1]+'%'
                }, settings['duration']).css({
                    'transform' : 'scale('+(0.3 + settings['step'] * j)+')',
                    'z-index' : j
                });     
            
        };
    }
    
    $(v + ' .btn-toggle').on('click', function(){
        c=$(this).val();// niepotrzebne do usuniecia
        carousel({items: it, top: c})
    });
    $(v + ' .btn-items').on('click', function(){
        it=$(this).val();// niepotrzebne do usuniecia
        carousel({items: it, top: c})
    });
    
    //gonext
    goNext = function(){ 
        $(vUl + ' li:first').before($(vUl + ' li:last'));
       carousel({items: it, top: c});// przenosi styl zmienia w locie + for
    }
    
    //goprev
    goPrev = function(){
        $(vUl + ' li:last').after($(vUl + ' li:first'));
       carousel({items: it, top: c});// przenosi styl niepotrzebnie
    }

    //button on click
    $(v + ' .btn-prev').on('click', goPrev);
    $(v + ' .btn-next').on('click', goNext);

    //on keydown change slide
    $(document).keydown(function(key){
        //key left
        if(key.keyCode == 37){
            goPrev();
        }
        //key right
        if(key.keyCode == 39){
            goNext();
        }
    });
    
    //mousewheel Up or Down
    $(document).bind('mousewheel', function(e,currentEl, nextEl, lastEl){
        e.preventDefault();
        
        if(e.originalEvent.wheelDelta /120 > 0) {
            goNext();
        }
        else{
           goPrev()
        }
    });
}

$(document).ready(function(){ 
    
    //load json object nad add elements at website
    LoadMe('.3dgallery');
    
    //slider
    DDslider('.3dgallery');
   
})