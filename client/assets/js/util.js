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

function loadRightArea() {
    $('#rightArea').load( "/components/rightArea.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#wrapper').css('display', 'block');
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#rightArea" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}

function loadFooter() {
    $('#footer').load( "/components/footer.html?" + new Date().getTime(),
        function( response, status, xhr ) {
            $('#wrapper').css('display', 'block');
            if ( status == "error" ) {
                var msg = "Error loading component.";
                $( "#footer" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        }
    );
}