// If an html page has a description of rosbi, boba, chiove, supercazzolaro can
// load the text in an element with id rosbi-description, chiove-description ecc

$(function(){
    $("#rosbi-description").html(
        '<p>Il rosbi <b>non</b> conosce il riocontra.</p> \
        <p> Si avvicina incautamente all\'ozi della dastra parlando un italiano perfetto, \
        sperando di imparare qualcosa. Putroppo il riocontra gli resta incomprensibile e non impara nemmeno le regole \
        più basilari.</p>'
    );

    $("#boba-description").html(
        '<p>Il boba è un timido, reso tale dal bullismo dei tefra a lascuo.</p> \
        <p> Per via della sua timidezza, traduce solo il \
        <a href="#" data-toggle="modal" data-target="#percentagePopUp">50%</a> delle parole. \
        Inoltre conosce poche tecniche, tra cui quella del \
        <a href="#" data-toggle="modal" data-target="#nezioPopUp">nezio</a> \
        e dell\'<a href="#" data-toggle="modal" data-target="#erreMossaPopUp">erre mossa</a>.</p>'
    );

    $("#chiove-description").html(
        '<p>Il chiove ne sa, e non ha paura di mostrarlo.</p> \
        <p>Il chiove traduce il \
        <a href="#" data-toggle="modal" data-target="#percentagePopUp">75%</a> \
        delle parole, e dalla sua elevata esperienza conosce tutte le \
        tecniche del riocontra, perfino il \
        <a href="#" data-toggle="modal" data-target="#supertofePopUp">supertofe</a>.</p>'
    );

    $("#supercazzolaro-description").html(
        '<p>Il supercazzolaro è l\'uomo di teoria, conosce tutte le regole ma non viene dalla \
        dastra. </p> \
        <p> Usa il riocontra per supercazzolare e traduce <b>tutte</b> le \
        parole. Purtroppo il supercazzolaro \
        sa solo abusare del riocontra, e non sa regolarsi come un vero ozi.</p>'
    );
});

