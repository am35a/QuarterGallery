var QG_galleryFolder = '',
    QG_tumbnailPrefix = '',
    QG_imgNum = 1,
    QG_imgLast = QG_imgNum, /*-- replace imgNum if know the numbers of pics --*/
    QG_direction = 'none',
    QG_animationEnd = true;

   
$( function(){
    /*-- create QR gallery html code --*/
    $( '.qg-container' ).html(
        '<div class="qg-container__controls">' +
        '    <i class="material-icons qg-first-image qg-first-image--action">first_page</i>' +
        '    <i class="material-icons qg-last-image qg-last-image--action">last_page</i>' +
        '    <i class="material-icons qg-fullscreen qg-fullscreen--action">fullscreen_exit</i>' +
        '    <i class="material-icons qg-container-close qg-container-close--action">close</i>' +
        '</div>' +
        '<div class="qg-container__quarter-1 qg-scroll-left--action">' +
        '    <div class="qg-quarter__slide-1">' +
        '        <img class="qg-image-expand" src="' + QG_galleryFolder + QG_imgNum + '.jpg" onerror="qgImgReload( true )">' +
        '    </div>' +
        '</div>' +
        '<div class="qg-container__quarter-2 qg-scroll-right--action">' +
        '    <div class="qg-quarter__slide-2">' +
        '        <img class="qg-image-expand" src="' + QG_galleryFolder + QG_imgNum + '.jpg">' +
        '    </div>' +
        '</div>' +
        '<div class="qg-container__quarter-3 qg-scroll-left--action">' +
        '    <div class="qg-quarter__slide-3">' +
        '        <img class="qg-image-expand" src="' + QG_galleryFolder + QG_imgNum + '.jpg">' +
        '    </div>' +
        '</div>' +
        '<div class="qg-container__quarter-4 qg-scroll-right--action">' +
        '    <div class="qg-quarter__slide-4">' +
        '        <img class="qg-image-expand" src="' + QG_galleryFolder + QG_imgNum + '.jpg">' +
        '    </div>' +
        '</div>' +
        '<i class="material-icons md-48 qg-scroll-left qg-scroll-left--action">keyboard_arrow_left</i>' +
        '<i class="material-icons md-48 qg-scroll-right qg-scroll-right--action">keyboard_arrow_right</i>'
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
    
    /*-- close QR gallery view --*/
    $( '.qg-container-close--action' ).on( 'click', function(){
        $( '.qg-container' ).hide();
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
    $( 'img.QuarterGallery' )
        .on( 'click', function(){
            var str = $( this ).attr( 'src' ),
                cutFirst = str.lastIndexOf( QG_tumbnailPrefix ),
                cutLast = cutFirst + QG_tumbnailPrefix.length;
            QG_imgNum = +str.slice( cutFirst + QG_tumbnailPrefix.length, -4 );
            QG_imgLast = 4; // - have problem
            QG_direction = 'none';
            QuarterGallery();
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
        if( QG_direction == 'left' )
            QG_imgNum = ( QG_imgNum > 1 ) ? QG_imgNum - 1 : QG_imgLast;
        $( '[class*=qg-quarter__slide-] img' ).attr( 'src', QG_galleryFolder + QG_imgNum + '.jpg' );
        $( '[class*=qg-quarter__slide-]' ).css( 'transform', 'translateX( 0 )' );
        setTimeout( function(){
            QG_animationEnd = true;
                $( '.qg-quarter__slide-1' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' );
                $( '.qg-quarter__slide-2' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' );
                $( '.qg-quarter__slide-3' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' );
                $( '.qg-quarter__slide-4' ).css( 'transition-delay', qgRandomInteger( 0, 0.3 ) + 's' );
            }, 1000 );
};

function qgRandomInteger( min, max ){
    var rand = min + Math.random() * ( max - min )
    return rand.toFixed( 3 );
}

function QuarterGallery(){
    QG_direction = 'none';
    qgImgReload( false );
    $( '.qg-container' ).show();
}