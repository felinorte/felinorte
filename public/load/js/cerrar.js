(function(){
var cont=document.getElementById('cont')
var time=0;
var funcion=setInterval(proceso,100)
function proceso(){
if (time==2800) {
clearInterval(funcion);
window.open("index.pug","_self")
}else{
	time=time+100;
	if (time==2500) {
        cont.style.animation="fadeout 1s ease";


	}
}



}



})();