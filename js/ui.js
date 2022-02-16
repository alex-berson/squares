const getDashEl = (dash) => {

    let dashesEl = document.querySelectorAll('.dash');
    let dashesVEl = document.querySelectorAll('.dash-v');

    return dash < dashesEl.length ?  dashesEl[dash] :  dashesVEl[dash - dashesEl.length];   
}

const getDash = (dashEl) => {

    let dashesEl = document.querySelectorAll('.dash');

    for (let i = 0; i < dashesEl.length; i ++) {
        if (dashesEl[i] == dashEl) return i;
    }

    dashesEl = document.querySelectorAll('.dash-v');

    for (let i = 0; i < dashesEl.length; i ++) {
        if (dashesEl[i] == dashEl) return i + dashesEl.length;
    }
}
 
const select = (dashEl) => {

    dashEl = dashEl.currentTarget ? dashEl.currentTarget : dashEl;

    if (dashEl.classList.contains("blue") || dashEl.classList.contains("pink")) return false;

    player == blue ? dashEl.classList.add("blue") : dashEl.classList.add("pink");

    dashEl.style.opacity = 1;

    
    return true;
} 

const fillSquares = (dash) => {

    let boxes = document.querySelectorAll('.box');

    for (let square of dashSquares[dash]) {

        if (squares[square] < 4) continue;

        player == blue ? boxes[square].classList.add("blue") : boxes[square].classList.add("pink");

        boxes[square].style.animation = `fill 1s 1 linear forwards`;

    }
}

const clearBoard = () => {
    let elements = document.querySelectorAll('.dash, .dash-v, .box');

    for (let element of elements) {

        element.classList.remove("blue");
        element.classList.remove("pink");
    }
}

const disableTouch = () => {
    document.querySelectorAll('.dash, .dash-v').forEach((dash) => {
        if (touchScreen()){
            dash.removeEventListener('touchstart', humanTurn);
            // dash.removeEventListener('touchmove', humanTurn);
        } else {
            dash.removeEventListener('mousedown', humanTurn);
        }
    });
}

const enableTouch = () => {
    document.querySelectorAll('.dash, .dash-v').forEach((dash) => {
        if (touchScreen()){
            dash.addEventListener('touchstart', humanTurn);
            // dash.addEventListener('touchmove', humanTurn);
        } else {
            dash.addEventListener('mousedown', humanTurn);
        }
    });
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}