var QG_galleryFolder = 'gallery-pics/',
    QG_imgNum = 1,
    QG_imgLast = QG_imgNum, /*-- replace imgNum if know the numbers of pics --*/
    QG_direction,
    QG_animationEnd = true;
    
$( function(){
    /*-- close QR gallery view --*/
    $( '.qg-container-close--action' ).on( 'click', function(){
        $( '.qg-container' ).hide();
    });    
    
    /*-- fullscreen enter or exit --*/
    var fullscreen = true;
    $( '.qg-fullscreen--action' ).on( 'click', function(){
        if ( fullscreen ){
            $( '.qg-fullscreen' ).html( 'fullscreen' );
            $( '[class*=qg-quarter__slide-] img' )
                .removeClass( 'qg-image-expand' )
                .addClass( 'qg-image-shrink' );
        }
        else {
            $( '.qg-fullscreen' ).html( 'fullscreen_exit' );
            $( '[class*=qg-quarter__slide-] img' )
                .removeClass( 'qg-image-shrink' )
                .addClass( 'qg-image-expand' );
        }
        fullscreen = !fullscreen;
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
});

function qgImgReload( onError ){
    if ( onError )
        QG_imgNum = ( QG_direction == 'right' ) ? 1 : --QG_imgLast;
    else
        if( QG_direction == 'right' )
            if ( QG_imgNum >= QG_imgLast )
                QG_imgLast = ++QG_imgNum;
            else
                QG_imgNum++;
        else
            QG_imgNum = ( QG_imgNum > 1 ) ? QG_imgNum - 1 : QG_imgLast;
        $( '[class*=qg-quarter__slide-] img' ).attr( 'src', QG_galleryFolder + QG_imgNum + '.jpg' );
        $( '[class*=qg-quarter__slide-]' ).css( 'transform', 'rotate( 0 )' );
        setTimeout( function(){
            QG_animationEnd = true;
                $( '.qg-quarter__slide-1' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' )
                $( '.qg-quarter__slide-2' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' )
                $( '.qg-quarter__slide-3' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' )
                $( '.qg-quarter__slide-4' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' )
            }, 1000 );
};

function qgRandomInteger( min, max ){
    var rand = min + Math.random() * ( max - min )
    return rand.toFixed( 3 );
}

function QuarterGallery(){
    $( '.qg-container' ).show();
}