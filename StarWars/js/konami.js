jQuery(function()
{
    var kKeys = [];
    function Kpress(e)
	{
        kKeys.push(e.keyCode);
        if (kKeys.toString().indexOf("38,38,40,40,37,39,37,39,66,65") >= 0) 
		{
            jQuery(this).unbind('keydown', Kpress);
            konami();
        }
    }
    jQuery(document).keydown(Kpress);
});
function konami(){
   //alert("KONAMI CODE !")
   window.open("BrowserInvaders2/Invaders.html");
}