// Each html page should include this script

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function makeStickyHeader() {
    // Get the header
    let header = document.getElementById("header");

    // Get the offset position of the navbar
    let sticky = header.offsetTop;

    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

// Load header and footer
$(function(){
    $("#header").load("/riocontra-translator/html/header.html"); 
    $("#footer").load("/riocontra-translator/html/footer.html"); 
    $("#pop-ups-placeholder").load("/riocontra-translator/html/rules_pop_ups.html"); 
    
    // Add favicon
    const link = document.createElement('link');
    link.href = 'https://raw.githubusercontent.com/spig95/riocontra-translator/main/img/favicon.ico';
    link.rel = 'shortcut icon';
    $("head").append(link);

    // Sticky header, from https://www.w3schools.com/howto/howto_js_sticky_header.asp
    // When the user scrolls the page, execute myFunction
    window.onscroll = function() {makeStickyHeader()};
});