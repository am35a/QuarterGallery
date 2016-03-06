/*!
 * QuarterGallery 0.0.7
 * https://github.com/am35a/QuarterGallery
 * MIT licensed
 *
 * Copyright (C) 2016 mobitoon.ru - A project by Arthur A. Selimov
 */


/*-- include Google Material Icon font for QuarterGallery navigation --*/
WebFontConfig = { google: { families: [ 'Material+Icons' ] } };
( function() {
    var wf = document.createElement( 'script' );
    wf.src = ( 'https:' == document.location.protocol ? 'https' : 'http' ) + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName( 'script' )[0];
    s.parentNode.insertBefore( wf, s );
} )();

/*-- the QuarterGallery JS code --*/
var QG_galleryFolder = '',
    QG_tumbnailPrefix = '',
    QG_imgNum = 1,
    QG_imgLast = QG_imgNum, /*-- replace imgNum if know the numbers of pics --*/
    QG_direction = 'none',
    QG_animationEnd = true,
    QG_openOnce = false,
    QG_listTable = '',
    QG_zoom = false;

$( function(){
    /*-- create QuarterGallery html code --*/
    $( '.qg-container' ).html(
        '<div class="qg-container__controls">' +
        '    <i class="material-icons qg-first-image qg-first-image--action">first_page</i>' +
        '    <i class="material-icons qg-last-image qg-last-image--action">last_page</i>' +
        '    <i class="material-icons qg-zoom qg-zoom--action">zoom_in</i>' +
        '    <i class="material-icons qg-fullscreen qg-fullscreen--action">fullscreen</i>' +
        '    <i class="material-icons qg-container-close qg-container-close--action">close</i>' +
        '</div>' +
        '<div>' +
        '   <div class="qg-container__quarter-1 qg-scroll-left--action">' +
        '       <div class="qg-quarter__slide-1">' +
        '           <img class="qg-image-shrink" src="" onerror="qgImgReload( true )">' +
        '       </div>' +
        '   </div>' +
        '   <div class="qg-container__quarter-2 qg-scroll-right--action">' +
        '       <div class="qg-quarter__slide-2">' +
        '           <img class="qg-image-shrink" src="">' +
        '       </div>' +
        '   </div>' +
        '   <div class="qg-container__quarter-3 qg-scroll-left--action">' +
        '       <div class="qg-quarter__slide-3">' +
        '           <img class="qg-image-shrink" src="">' +
        '       </div>' +
        '   </div>' +
        '   <div class="qg-container__quarter-4 qg-scroll-right--action">' +
        '       <div class="qg-quarter__slide-4">' +
        '           <img class="qg-image-shrink" src="" onload="qgOnLoadImage()">' +
        '       </div>' +
        '   </div>' +
        '</div>' +
        '<i class="material-icons md-48 qg-scroll-left qg-scroll-left--action">keyboard_arrow_left</i>' +
        '<i class="material-icons md-48 qg-scroll-right qg-scroll-right--action">keyboard_arrow_right</i>' +
        '<div class="qg_containet__list-table"></div>' +
        '<div class="qg_containet__gallery-info"></div>'
    );

    /*-- jump to first or last images --*/
    $( '.qg-first-image--action' ).on( 'click', function(){
        if ( QG_animationEnd && QG_imgNum > 1 ){
            QG_imgNum = 1;
            QG_animationEnd = false;
            QG_direction = 'none';
            $( '[class*=qg-quarter__slide-]' ).css( 'transform', 'translateX( -50vw )' );
            setTimeout( qgImgReload, 1000, false );
        }
    });
    $( '.qg-last-image--action' ).on( 'click', function(){
        if ( QG_animationEnd && QG_imgNum < QG_imgLast ){
            QG_imgNum = QG_imgLast;
            QG_animationEnd = false;
            QG_direction = 'none';
            $( '[class*=qg-quarter__slide-]' ).css( 'transform', 'translateX( 50vw )' );
            setTimeout( qgImgReload, 1000, false );
        }
    });

    /*-- zoom enter or exit --*/
    $( '.qg-zoom--action' ).on( 'click', function(){
        if ( !QG_zoom ){
            $( '.qg-zoom' ).html( 'zoom_out' );
            $( '[class*=qg-quarter__slide-] img' )
                .removeClass( 'qg-image-shrink' )
                .addClass( 'qg-image-expand' );
        }
        else {
            $( '.qg-zoom' ).html( 'zoom_in' );
            $( '[class*=qg-quarter__slide-] img' )
                .removeClass( 'qg-image-expand' )
                .addClass( 'qg-image-shrink' );
        }
        QG_zoom = !QG_zoom;
    });
    
    /*-- fullscreen enter or exit --*/
    $( '.qg-fullscreen--action' ).on( 'click', function(){
        qgFullScreen();
    });
    function qgFullScreen() {
        if ( !document.fullscreenElement &&    // alternative standard method
             !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
            if ( document.documentElement.requestFullscreen ) document.documentElement.requestFullscreen();
            else if ( document.documentElement.msRequestFullscreen ) document.documentElement.msRequestFullscreen();
            else if ( document.documentElement.mozRequestFullScreen ) document.documentElement.mozRequestFullScreen();
            else if ( document.documentElement.webkitRequestFullscreen ) document.documentElement.webkitRequestFullscreen( Element.ALLOW_KEYBOARD_INPUT );
            $( '.qg-fullscreen' ).html( 'fullscreen_exit' );
        } else {
            if ( document.exitFullscreen ) document.exitFullscreen();
            else if ( document.msExitFullscreen ) document.msExitFullscreen();
            else if ( document.mozCancelFullScreen ) document.mozCancelFullScreen();
            else if ( document.webkitExitFullscreen ) document.webkitExitFullscreen();
            $( '.qg-fullscreen' ).html( 'fullscreen' );
        }
    }
    
    /*-- close QuarterGallery view --*/
    $( '.qg-container-close--action' ).on( 'click', function(){
        if ( $( '.qg-fullscreen' ).html() == 'fullscreen_exit' ) qgFullScreen();
        $( '.qg-quarter__slide-1, .qg-quarter__slide-3' ).css( 'transform', 'translateX( -50vw )' );
        $( '.qg-quarter__slide-2, .qg-quarter__slide-4' ).css( 'transform', 'translateX( 50vw )' );
        setTimeout( function(){
            $( '.qg-container' ).fadeOut( 250 );
        }, 1000 );
    });
    
    /*-- gallery navigation --*/
    $( '.qg-scroll-left--action' ).on( 'click', function(){
        if ( QG_animationEnd && QG_imgLast > 1 ){
            QG_animationEnd = false;
            QG_direction = 'left';
            $( '[class*=qg-quarter__slide-]' ).css( 'transform', 'translateX( -50vw )' );
            setTimeout( qgImgReload, 1000, false );
        }
    });
    $( '.qg-scroll-right--action' ).on( 'click', function(){
        if ( QG_animationEnd ){
            QG_animationEnd = false;
            QG_direction = 'right';
            $( '[class*=qg-quarter__slide-]' ).css( 'transform', 'translateX( 50vw )' );
            setTimeout( qgImgReload, 1000, false ); //qgImgReload( false );
        }
    });
    
    /*-- gallery open by image click --*/
    $( 'img.QuarterGallery' ).on( 'click', function(){
            var str = $( this ).attr( 'src' ),
                cutFirst = str.lastIndexOf( QG_tumbnailPrefix );
                //cutLast = cutFirst + QG_tumbnailPrefix.length;
            QG_imgNum = +str.slice( cutFirst + QG_tumbnailPrefix.length, -4 );
            QG_galleryFolder = str.slice( 0, cutFirst);
            if( $('.QuarterGallery').length >= QG_imgLast )
                QG_imgLast = $('.QuarterGallery').length;
            QG_direction = 'none';
            QuarterGallery();
    });

    /*-- gallery open by click on attribute num --*/
    $( document ).on( "click", ".qg_list-table__item:not(.active)", function() {
        qgShowImageByNum( this );
    });
});

function qgListTable(){
    $( '.qg_list-table__item.active' ).removeClass( 'active' );
    if ( !QG_listTable ){
        var i = 0;
        do {
           i += 1;
           QG_listTable += '<div class="qg_list-table__item" num="' + i + '"></div>'
        } while ( i < QG_imgLast )
        $( '.qg_containet__list-table' ).html( QG_listTable );
    }
}

function qgShowImageByNum( elementClass ) {
    var currentNum = eval( $( elementClass ).attr( 'num' ) );
    if ( QG_animationEnd ){
        QG_animationEnd = false;
        if ( QG_imgNum > currentNum ) {
            QG_direction = 'left';
            $( '[class*=qg-quarter__slide-]' ).css( 'transform', 'translateX( -50vw )' );
            QG_imgNum = currentNum + 1;
        }
        if ( QG_imgNum < currentNum ) {
            QG_direction = 'right';            
            $( '[class*=qg-quarter__slide-]' ).css( 'transform', 'translateX( 50vw )' );
            QG_imgNum = currentNum - 1;
        }
        setTimeout( qgImgReload, 1000, false );

        console.log( QG_direction, QG_imgNum );
    }
}

function qgImgReload( onError ){
    if ( QG_openOnce ){
        qgListTable();
        if ( onError ){
            QG_imgNum = ( QG_direction == 'right' ) ? 1 : --QG_imgLast;
            if( QG_imgNum == 1 )
                $( '.qg_list-table__item' ).last().remove();
        }
        else
            switch ( QG_direction ){
                case 'right':
                    if ( QG_imgNum >= QG_imgLast ){
                        $( '.qg_containet__list-table' ).append( '<div class="qg_list-table__item" num="' + QG_imgNum + '"></div>' );
                        QG_imgLast = ++QG_imgNum;
                    }
                    else
                        QG_imgNum++;
                    break;
                case 'left':
                    QG_imgNum = ( QG_imgNum > 1 ) ? QG_imgNum - 1 : QG_imgLast;
                    break;
            }
        $( '[class*=qg-quarter__slide-] img' ).attr( 'src', QG_galleryFolder + QG_imgNum + '.jpg' );
        // -- from here formed qgOnLoadImage function
        $( '.qg_list-table__item:nth-child(' + QG_imgNum + ')' ).addClass( 'active' );
    }
};

function qgOnLoadImage(){
    if ( QG_openOnce ){
        $( '[class*=qg-quarter__slide-]' ).css( 'transform', 'translateX( 0px )' );
        setTimeout( function(){
            QG_animationEnd = true;
            $( '.qg-quarter__slide-1' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' );
            $( '.qg-quarter__slide-2' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' );
            $( '.qg-quarter__slide-3' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' );
            $( '.qg-quarter__slide-4' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' );
        }, 1400 ); //wait .qg-quarter__slide-1 -- transition-duration * 2 before animation ended
    }
}

function qgRandomInteger( min, max ){
    var rand = min + Math.random() * ( max - min )
    return rand.toFixed( 3 );
}

function QuarterGallery(){
    if( !QG_openOnce ){
        $.get( QG_galleryFolder + 'info.txt', function( data ){
            $( '.qg_containet__gallery-info' ).show().html( data );
            //alert( data );
        }, 'text' )
        .fail(function() {
            $( '.qg_containet__gallery-info' ).hide();
        });
        QG_openOnce = true;
    }
    QG_direction = 'none';
    $( '.qg-container' ).fadeIn( 250, function() {
        qgImgReload( false );
    });
}