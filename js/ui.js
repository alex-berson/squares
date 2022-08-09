let blueTimeout, pinkTimeout;

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

// const showBoard = () => {

//     document.querySelector("h1").style.display = "block";    
//     document.querySelector("#designed").style.display = "inline";    
//     document.querySelector(".board").style.display = "block";

//     setTimeout(() => {
//         document.querySelector("h1").style.opacity = 1;
//         document.querySelector("#designed").style.opacity = 1;
//         document.querySelector(".board").style.opacity = 1;

//     }, 50);
// }

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
        // document.querySelector(".blue-button").classList.add("zoom");
        document.querySelector(".boy").classList.add("zoom");

    }, 1000 + 50);

    pinkTimeout = setTimeout(() => {
        // document.querySelector(".pink-button").classList.add("zoom");
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

    clearTimeout(blueTimeout);
    clearTimeout(pinkTimeout);

    // document.querySelector(".blue-button").classList.remove("zoom");
    // document.querySelector(".pink-button").classList.remove("zoom");
    document.querySelector(".boy").classList.remove("zoom");
    document.querySelector(".girl").classList.remove("zoom");



    // if (localStorage.color) {
    //     color = localStorage.getItem("color");
    //     console.log(color);
    // }

    let el = e.currentTarget;


    if (el.classList.contains("boy")) {
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

    showBoard(el);

    // setTimeout(() => {
    //     document.querySelector(".choice").style.opacity = 0;
    // }, 500);

    // setTimeout(() => {

    //     el.classList.remove("zoom");

    //     document.querySelector(".choice").style.display = "none";
    //     document.querySelector("h1").style.display = "block";
    //     document.querySelector("#designed").style.display = "inline";    
    //     document.querySelector(".board").style.display = "block";

    //     setTimeout(() => {
    //         document.querySelector("h1").style.opacity = 1;
    //         document.querySelector("#designed").style.opacity = 1;
    //         document.querySelector(".board").style.opacity = 1;

    //     }, 500);

    //     setTimeout(() => {
    //         enableTouch();
    //     }, 500 + 500);


    // }, 1000 + 500);
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
    // document.querySelectorAll('.blue-botton, .pink-button').forEach((dash) => {
    document.querySelectorAll('img').forEach((img) => {

        if (touchScreen()){
            img.removeEventListener('touchstart', colorChoice);
        } else {
            img.removeEventListener('mousedown', colorChoice);
        }
    });
}

const enableTouchChoice = () => {
    // document.querySelectorAll('.blue-button, .pink-button').forEach((dash) => {
    document.querySelectorAll('img').forEach((img) => {

        if (touchScreen()){
            img.addEventListener('touchstart', colorChoice);
        } else {
            img.addEventListener('mousedown', colorChoice);
        }
    });
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}




const setPattern = () => {


    // let order = [0,1,2,3,4,5,6,7,8,9,10,11,12];

    let dashesEl = document.querySelectorAll('.dash');
    let dashesVEl = document.querySelectorAll('.dash-v');

    // order = shuffle(order);

    dashesEl.forEach(dashEl => {

        Math.round(Math.random()) ? dashEl.classList.add("blue") : dashEl.classList.add("pink");

    });

    dashesVEl.forEach(dashEl => {

        Math.round(Math.random()) ? dashEl.classList.add("blue") : dashEl.classList.add("pink");

    });

    let boxes = document.querySelectorAll('.box');

    boxes[0].classList.add("blue");
    boxes[1].classList.add("pink");
    boxes[2].classList.add("pink");
    boxes[3].classList.add("blue");
    boxes[4].classList.add("blue");
    boxes[5].classList.add("pink");
    boxes[6].classList.add("blue");
    boxes[7].classList.add("pink");
    boxes[8].classList.add("pink"); 
    
    
    // boxes[0].classList.add("pink");
    // boxes[1].classList.add("blue");
    // boxes[2].classList.add("pink");
    // boxes[3].classList.add("pink");
    // boxes[4].classList.add("pink");
    // boxes[5].classList.add("pink");
    // boxes[6].classList.add("blue");
    // boxes[7].classList.add("blue");
    // boxes[8].classList.add("blue");

    // boxes[0].classList.add("pink");
    // boxes[1].classList.add("blue");
    // boxes[2].classList.add("pink");
    // boxes[3].classList.add("pink");
    // boxes[4].classList.add("blue");
    // boxes[5].classList.add("pink");
    // boxes[6].classList.add("blue");
    // boxes[7].classList.add("pink");
    // boxes[8].classList.add("blue");

    showWinner();

}

const checkPattern1 = () => {

    let boxes = document.querySelectorAll('.box');

    if (!boxes[0].classList.contains('blue')) return false;
    if (!boxes[1].classList.contains('pink')) return false;
    if (!boxes[2].classList.contains('pink')) return false;
    if (!boxes[3].classList.contains('blue')) return false;
    if (!boxes[4].classList.contains('blue')) return false;
    if (!boxes[5].classList.contains('pink')) return false;
    if (!boxes[6].classList.contains('blue')) return false;
    if (!boxes[7].classList.contains('pink')) return false;
    if (!boxes[8].classList.contains('pink')) return false;

    return true;
}

const checkPattern2 = () => {

    let boxes = document.querySelectorAll('.box');

    if (!boxes[0].classList.contains('blue')) return false;
    if (!boxes[1].classList.contains('blue')) return false;
    if (!boxes[2].classList.contains('blue')) return false;
    if (!boxes[3].classList.contains('pink')) return false;
    if (!boxes[4].classList.contains('blue')) return false;
    if (!boxes[5].classList.contains('pink')) return false;
    if (!boxes[6].classList.contains('pink')) return false;
    if (!boxes[7].classList.contains('pink')) return false;
    if (!boxes[8].classList.contains('pink')) return false;

    return true;
}

const checkPattern3 = () => {

    let boxes = document.querySelectorAll('.box');

    if (!boxes[0].classList.contains('pink')) return false;
    if (!boxes[1].classList.contains('pink')) return false;
    if (!boxes[2].classList.contains('blue')) return false;
    if (!boxes[3].classList.contains('pink')) return false;
    if (!boxes[4].classList.contains('blue')) return false;
    if (!boxes[5].classList.contains('blue')) return false;
    if (!boxes[6].classList.contains('pink')) return false;
    if (!boxes[7].classList.contains('pink')) return false;
    if (!boxes[8].classList.contains('blue')) return false;

    return true;
}

const checkPattern4 = () => {

    let boxes = document.querySelectorAll('.box');

    if (!boxes[0].classList.contains('pink')) return false;
    if (!boxes[1].classList.contains('pink')) return false;
    if (!boxes[2].classList.contains('pink')) return false;
    if (!boxes[3].classList.contains('pink')) return false;
    if (!boxes[4].classList.contains('blue')) return false;
    if (!boxes[5].classList.contains('pink')) return false;
    if (!boxes[6].classList.contains('blue')) return false;
    if (!boxes[7].classList.contains('blue')) return false;
    if (!boxes[8].classList.contains('blue')) return false;

    return true;
}

const checkPattern5 = () => {

    let boxes = document.querySelectorAll('.box');

    if (boxes[0].classList.contains('blue')) return false;
    if (boxes[1].classList.contains('pink')) return false;
    if (boxes[2].classList.contains('pink')) return false;
    if (boxes[3].classList.contains('blue')) return false;
    if (boxes[4].classList.contains('blue')) return false;
    if (boxes[5].classList.contains('pink')) return false;
    if (boxes[6].classList.contains('blue')) return false;
    if (boxes[7].classList.contains('pink')) return false;
    if (boxes[8].classList.contains('pink')) return false;

    return true;
}

const checkPattern6 = () => {

    let boxes = document.querySelectorAll('.box');

    if (boxes[0].classList.contains('blue')) return false;
    if (boxes[1].classList.contains('blue')) return false;
    if (boxes[2].classList.contains('blue')) return false;
    if (boxes[3].classList.contains('pink')) return false;
    if (boxes[4].classList.contains('blue')) return false;
    if (boxes[5].classList.contains('pink')) return false;
    if (boxes[6].classList.contains('pink')) return false;
    if (boxes[7].classList.contains('pink')) return false;
    if (boxes[8].classList.contains('pink')) return false;

    return true;
}

const checkPattern7 = () => {

    let boxes = document.querySelectorAll('.box');

    if (boxes[0].classList.contains('pink')) return false;
    if (boxes[1].classList.contains('pink')) return false;
    if (boxes[2].classList.contains('blue')) return false;
    if (boxes[3].classList.contains('pink')) return false;
    if (boxes[4].classList.contains('blue')) return false;
    if (boxes[5].classList.contains('blue')) return false;
    if (boxes[6].classList.contains('pink')) return false;
    if (boxes[7].classList.contains('pink')) return false;
    if (boxes[8].classList.contains('blue')) return false;

    return true;
}

const checkPattern8 = () => {

    let boxes = document.querySelectorAll('.box');

    if (boxes[0].classList.contains('pink')) return false;
    if (boxes[1].classList.contains('pink')) return false;
    if (boxes[2].classList.contains('pink')) return false;
    if (boxes[3].classList.contains('pink')) return false;
    if (boxes[4].classList.contains('blue')) return false;
    if (boxes[5].classList.contains('pink')) return false;
    if (boxes[6].classList.contains('blue')) return false;
    if (boxes[7].classList.contains('blue')) return false;
    if (boxes[8].classList.contains('blue')) return false;

    return true;
}

const checkPattern = () => {
    return checkPattern1() || checkPattern2() || checkPattern3() || checkPattern4();
}