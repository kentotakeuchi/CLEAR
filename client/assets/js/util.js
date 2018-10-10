function loadHeader1(title) {
    $('#header-1').load( "/components/header-1.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#pageTitle').html(title);
            $('#wrapper').css('display', 'block');
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#header-1" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}

function loadHeader2() {
    $('#header-2').load( "/components/header-2.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#pageTitle').html();
            $('#wrapper').css('display', 'block');
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#header-2" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}

function loadRightArea(id) {
    $('#rightArea').load( "/components/rightArea.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#wrapper').css('display', 'block');
            $('#' + id).css('color', 'black');
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#rightArea" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}

function loadFooter(id) {
    $('#footer').load( "/components/footer.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#wrapper').css('display', 'block');
            $('#' + id).css('color', 'black');
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#footer" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}