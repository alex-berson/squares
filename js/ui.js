let blueTimeout, pinkTimeout;

const touchScreen = () => matchMedia('(hover: none)').matches;

const setHeaderColors = (color) => {

    if (color == blue) {
        document.documentElement.style.setProperty('--color1', 'var(--blue)');
        document.documentElement.style.setProperty('--color2', 'var(--pink)');
    } else {
        document.documentElement.style.setProperty('--color1', 'var(--pink)');
        document.documentElement.style.setProperty('--color2', 'var(--blue)');
    }
}

const showChoice = (initial) => {

    document.querySelector(".choice").style.display = "flex";

    setTimeout(() => {
        document.querySelector(".choice").style.opacity = 1;
    }, 50);

    if (!initial) {
        setTimeout(showBoard, 1500); 
        return;
    };

    blueTimeout = setTimeout(() => {
        document.querySelector(".boy").classList.add("zoom");
    }, 1000 + 50);

    pinkTimeout = setTimeout(() => {
        document.querySelector(".girl").classList.add("zoom");
    }, 1000 + 700 + 50);    
}

const getDashEl = (dash) => {

    let dashesEl = document.querySelectorAll('.dash');
    let dashesVEl = document.querySelectorAll('.dash-v');

    return dash < dashesEl.length ?  dashesEl[dash] :  dashesVEl[dash - dashesEl.length];   
}

const getDash = (dashEl) => {

    let dashesEl = document.querySelectorAll('.dash');

    for (let i = 0; i < dashesEl.length; i++) {
        if (dashesEl[i] == dashEl) return i;
    }

    dashesEl = document.querySelectorAll('.dash-v');

    for (let i = 0; i < dashesEl.length; i++) {
        if (dashesEl[i] == dashEl) return i + dashesEl.length;
    }
}
 
const select = (dashEl) => {

    dashEl = dashEl.currentTarget ? dashEl.currentTarget : dashEl;

    if (dashEl.classList.contains("blue") || dashEl.classList.contains("pink")) return false;

    player == blue ? dashEl.classList.add("blue") : dashEl.classList.add("pink");
    
    return true;
} 

const fillSquares = (dash) => {

    let boxes = document.querySelectorAll('.box');

    for (let square of dashSquares[dash]) {

        if (squares[square] < 4) continue;

        player == blue ? boxes[square].classList.add("blue") : boxes[square].classList.add("pink");
    }
}

const clearBoard = () => {

    document.querySelectorAll(".box").forEach((box) => {
        box.style.transition = "background-color 0.5s linear";  
    });

    document.querySelectorAll('.dash, .dash-v, .box, .dot').forEach((element) => {
        element.classList.remove("blue");
        element.classList.remove("pink");
    });

    setTimeout(() => {
        document.querySelectorAll(".box").forEach((box) => {
            box.style = "";  
        });
    }, 500);
}

const colorChoice = (e) => {

    disableTouchChoice();
    clearTimeout(blueTimeout);
    clearTimeout(pinkTimeout);

    document.querySelector(".boy").classList.remove("zoom");
    document.querySelector(".girl").classList.remove("zoom");

    let el = e.currentTarget;

    if (el.classList.contains("boy")) {
        storeColor(blue);
        setHeaderColors(blue);
    } else {
        storeColor(pink);
        setHeaderColors(pink);   
    }

    setColor();

    setTimeout(() => {
        el.classList.add("zoom");
    }, 50);

    showBoard(el);
} 

const showBoard = (el = undefined) => {

    setTimeout(() => {
        document.querySelector(".choice").style.opacity = 0;
    }, 500);

    setTimeout(() => {

        if (el) el.classList.remove("zoom");

        document.querySelector(".choice").style.display = "none";
        document.querySelector("h1").style.display = "block";
        document.querySelector("#designed").style.display = "inline";    
        document.querySelector(".board").style.display = "block";

        setTimeout(() => {
            document.querySelector("h1").style.opacity = 1;
            document.querySelector("#designed").style.opacity = 1;
            document.querySelector(".board").style.opacity = 1;

        }, 500);

        setTimeout(() => {
            enableTouch();
        }, 500 + 500);


    }, 1000 + 500);
}

const showWinner = () => {
    document.querySelectorAll('.dot').forEach((dot) => {
        winner(squares) == blue ? dot.classList.add("blue") : dot.classList.add("pink");
    });
} 

const enableTouch = () => {
    document.querySelectorAll('.dash, .dash-v').forEach((dash) => {

        if (touchScreen()){
            dash.addEventListener('touchstart', humanTurn);
        } else {
            dash.addEventListener('mousedown', humanTurn);
        }
    });
}

const disableTouch = () => {
    document.querySelectorAll('.dash, .dash-v').forEach((dash) => {
        if (touchScreen()){
            dash.removeEventListener('touchstart', humanTurn);
        } else {
            dash.removeEventListener('mousedown', humanTurn);
        }
    });
}

const enableTouchChoice = () => {
    document.querySelectorAll('img').forEach((img) => {

        if (touchScreen()){
            img.addEventListener('touchstart', colorChoice);
        } else {
            img.addEventListener('mousedown', colorChoice);
        }
    });
}

const disableTouchChoice = () => {
    document.querySelectorAll('img').forEach((img) => {

        if (touchScreen()){
            img.removeEventListener('touchstart', colorChoice);
        } else {
            img.removeEventListener('mousedown', colorChoice);
        }
    });
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}
