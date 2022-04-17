const touchScreen = () => matchMedia('(hover: none)').matches;

// const showBoard = () => document.querySelector("body").style.opacity = 1;


const setHeaderColors = (color) => {

    if (color == blue) {
        document.documentElement.style.setProperty('--color1', 'var(--blue)');
        document.documentElement.style.setProperty('--color2', 'var(--pink)');
    } else {
        document.documentElement.style.setProperty('--color1', 'var(--pink)');
        document.documentElement.style.setProperty('--color2', 'var(--blue)');
    }
}

const showBoard = () => {

    document.querySelector("h1").style.display = "block";    
    document.querySelector("#designed").style.display = "inline";    
    document.querySelector(".board").style.display = "block";

    setTimeout(() => {
        document.querySelector("h1").style.opacity = 1;
        document.querySelector("#designed").style.opacity = 1;
        document.querySelector(".board").style.opacity = 1;

    }, 50);
}

const showChoice = () => {

    document.querySelector(".choice").style.display = "flex";

    setTimeout(() => {
        document.querySelector(".choice").style.opacity = 1;
    }, 50);

    setTimeout(() => {
        document.querySelector(".blue-button").classList.add("zoom");
    }, 1000 + 50);

    setTimeout(() => {
        document.querySelector(".pink-button").classList.add("zoom");
    }, 1000 + 500 + 50);

    // setTimeout(() => {
    //     document.querySelector(".blue-button").classList.remove("zoom");
    //     document.querySelector(".pink-button").classList.remove("zoom");
    // }, 1700 + 500);


};

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

    // dashEl.style.opacity = 1;

    // dashEl.style.animation = `select 0.5s 1 linear forwards`;
    
    return true;
} 

const fillSquares = (dash) => {

    let boxes = document.querySelectorAll('.box');

    for (let square of dashSquares[dash]) {

        if (squares[square] < 4) continue;

        player == blue ? boxes[square].classList.add("blue") : boxes[square].classList.add("pink");

        // boxes[square].style.animation = `fill 1s 1 linear forwards`;

    }
}

const clearBoard = () => {

    // let elements = document.querySelectorAll('.dash, .dash-v, .box');

    // let boxes = document.querySelectorAll('.box');

    // for (let box of boxes) {

    //     console.log(box);

    //     box.slyle.transition = 'background-color 0.5s linear';

    // }

    document.querySelectorAll(".box").forEach((box) => {
        box.style.transition = "background-color 0.5s linear";  
    });

    document.querySelectorAll('.dash, .dash-v, .box, .dot').forEach((element) => {
        element.classList.remove("blue");
        element.classList.remove("pink");
    });

    // for (let element of elements) {

    //     element.classList.remove("blue");
    //     element.classList.remove("pink");
    // }

    setTimeout(() => {
        document.querySelectorAll(".box").forEach((box) => {
            box.style = "";  
        });
    }, 500);
}

const colorChoice = (e) => {

    // let color;

    disableTouchChoice();

    document.querySelector(".blue-button").classList.remove("zoom");
    document.querySelector(".pink-button").classList.remove("zoom");

    // if (localStorage.color) {
    //     color = localStorage.getItem("color");
    //     console.log(color);
    // }

    let el = e.currentTarget;


    if (el.classList.contains("blue-button")) {
        // console.log("BOY")
        storeColor(blue);
        setHeaderColors(blue);

        // localStorage.setItem("color", blue);
    } else {
        storeColor(pink);
        setHeaderColors(pink);
        // localStorage.setItem("color", pink);
        // console.log("GIRL")
    }

    // if (localStorage.color) {
    //     color = localStorage.getItem("color");
    //     console.log(color);
    // }

    setColor();

    // playerColor = localStorage.getItem("color");
    // player = playerColor;

    setTimeout(() => {
        el.classList.add("zoom");
    }, 50);

    setTimeout(() => {
        document.querySelector(".choice").style.opacity = 0;
    }, 500);

    setTimeout(() => {

        el.classList.remove("zoom");

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

const disableTouchChoice = () => {
    document.querySelectorAll('.blue-botton, .pink-button').forEach((dash) => {
        if (touchScreen()){
            dash.removeEventListener('touchstart', colorChoice);
        } else {
            dash.removeEventListener('mousedown', colorChoice);
        }
    });
}

const enableTouchChoice = () => {
    document.querySelectorAll('.blue-button, .pink-button').forEach((dash) => {
        if (touchScreen()){
            dash.addEventListener('touchstart', colorChoice);
        } else {
            dash.addEventListener('mousedown', colorChoice);
        }
    });
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}