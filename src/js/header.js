window.addEventListener("load", function(){


    let swipearea = document.getElementById("wrapper");
    let button = document.querySelector("#button");
    let a = document.querySelector(".menu");
    let mainPage = document.querySelector(".main")
    let search = document.querySelector(".head__search");
    let search1 = document.querySelector(".head-1__search");
    let lines = document.getElementsByClassName("button__line");
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    swipearea.addEventListener("touchstart", function(e){
        console.log(e.changedTouches[0].clientX);
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
    }, false)

    mainPage.addEventListener("touchend", function(e){
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        if(endX-startX>0){
        	if(a.classList.contains("move-left")){
						a.classList.remove("move-left");
        	}
        	a.classList.add("move-right");
            lines[1].style.display = "none";
            lines[0].classList.add("transformed-1");
            lines[2].classList.add("transformed-2");
        }
    }, false)
    button.addEventListener('click', function(){
					if(a.classList.contains("move-right")){
						a.classList.remove("move-right");
						a.classList.add("move-left");
                        lines[1].style.display = "block";
                        lines[0].classList.remove("transformed-1");
                        lines[2].classList.remove("transformed-2");
					}
					else{
                        a.classList.remove("move-left");
						a.classList.add("move-right");
                        lines[1].style.display = "none";
                        lines[0].classList.add("transformed-1");
                        lines[2].classList.add("transformed-2");
					}
    }, false)
    search.addEventListener('click', function(){
        if(window.matchMedia("(max-width: 1023px)").matches) {
            document.querySelector(".head").style.display = "none";
            document.querySelector(".head-1").style.display = "flex";
        }
    }, false)

    search1.addEventListener('click', function(){
        if(window.matchMedia("(max-width: 1023px)").matches) {
            document.querySelector(".head-1").style.display = "none";
            document.querySelector(".head").style.display = "flex";
        }
    }, false)

    mainPage.addEventListener("click", function(e){
        if(a.classList.contains("move-right")){
            a.classList.remove("move-right");
            a.classList.add("move-left");
            lines[1].style.display = "block";
            lines[0].classList.remove("transformed-1");
            lines[2].classList.remove("transformed-2");
        }
    }, false)

}, false)