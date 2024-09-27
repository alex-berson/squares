let boyTimeout, girlTimeout;

const selectColor = (e) => {

    let el = e.currentTarget;
    let boy = document.querySelector('.boy');
    let girl = document.querySelector('.girl');
    let choice = document.querySelector('.choice');
    let color = el.classList.contains('boy') ? blue : pink;

    disableChoice();
    clearTimeout(boyTimeout);
    clearTimeout(girlTimeout);

    boy.classList.remove('zoom');
    girl.classList.remove('zoom');

    localStorage.setItem('squares-color', color);

    player = firstPlayer = color;
                
    setHeaderColors(color);
    setTimeout(() => el.classList.add('zoom'), 50);
    setTimeout(() => choice.classList.remove('visible'), 500);
    setTimeout(showBoard, 1000 + 500);
}

const setColors = () => {

    let boy = document.querySelector('.boy');
    let girl = document.querySelector('.girl');
    let choice = document.querySelector('.choice');
    let color = Number(localStorage.getItem('squares-color'));

    setTimeout(() => choice.classList.add('visible', 50));

    enableChoice();

    if (!color) {

        boyTimeout = setTimeout(() => boy.classList.add('zoom'), 1000 + 50);
        girlTimeout = setTimeout(() => girl.classList.add('zoom'), 1000 + 600 + 50);

        return;
    }
        
    player = firstPlayer = color;

    setHeaderColors(color);
    setTimeout(() => choice.classList.remove('visible'), 1500);
    setTimeout(showBoard, 1500 + 1000); 
} 

const setHeaderColors = (color) => {

    let root = document.documentElement;

    root.style.setProperty('--color1', color == blue ? 'var(--blue)' : 'var(--pink)');
    root.style.setProperty('--color2', color == blue ? 'var(--pink)' : 'var(--blue)');
}

const showBoard = () => {

    let h1 = document.querySelector('h1');
    let boy = document.querySelector('.boy');
    let girl = document.querySelector('.girl');
    let board = document.querySelector('.board');
    let choice = document.querySelector('.choice');
    let designed = document.querySelector('.designed');

    boy.classList.remove('zoom');
    girl.classList.remove('zoom');

    choice.classList.add('removed');
    h1.classList.add('block');
    designed.classList.add('block');
    board.classList.add('block');

    setTimeout(() => {
        h1.classList.add('visible');
        designed.classList.add('visible');
        board.classList.add('visible');
    }, 500);

    setTimeout(enableTouch, 500 + 500);
}

const getDashEl = (dash) => {

    let dashesEl = document.querySelectorAll('.dash');
    let dashesVEl = document.querySelectorAll('.dash-v');

    return dash < dashesEl.length ? dashesEl[dash] : dashesVEl[dash - dashesEl.length];
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
 
const fillDash = (dashEl) => {

    dashEl = dashEl.currentTarget ? dashEl.currentTarget : dashEl;

    if (dashEl.classList.contains('blue') || dashEl.classList.contains('pink')) return false;

    dashEl.classList.add('color-dash');
    dashEl.classList.add(player == blue ? 'blue' : 'pink');

    dashEl.addEventListener('transitionend', () => dashEl.classList.remove('color-dash'), {once: true});
    
    return true;
} 

const fillSquares = (dash) => {

    let boxes = document.querySelectorAll('.box');

    for (let square of dashSquares[dash]) {

        if (squares[square] < 4) continue;

        boxes[square].classList.add('color-square');
        boxes[square].classList.add(player == blue ? 'blue' : 'pink');

        boxes[square].addEventListener('transitionend', () => boxes[square].classList.remove('color-square'), {once: true});
    }
}

const endGame = () => {

    let dots = document.querySelectorAll('.dot');
    let board = document.querySelector('.board');

    dots.forEach((dot) => {

        dot.classList.add('color-dot');
        dot.classList.add(squares.blue > squares.pink ? 'blue' : 'pink');
        
        dot.addEventListener('transitionend', () => dot.classList.remove('color-dot'), {once: true});
    });

    setTimeout(() => {
        board.classList.add('reset');
        board.addEventListener('touchstart', newGame);
        board.addEventListener('mousedown', newGame);
    }, 500);
}

const clearBoard = () => {

    let board = document.querySelector('.board');
    let elements = document.querySelectorAll('.dash, .dash-v, .box, .dot');

    board.classList.remove('reset');
    board.removeEventListener('touchstart', newGame);
    board.removeEventListener('mousedown', newGame);

    elements.forEach((element) => {

        element.classList.add('color-reset');
        element.classList.remove('blue', 'pink');

        element.addEventListener('transitionend', () => element.classList.remove('color-reset'), {once: true});
    });
}

const enableChoice = () => {

    let images = document.querySelectorAll('.boy, .girl');

    images.forEach((img) => {
        img.addEventListener('touchstart', selectColor);
        img.addEventListener('mousedown', selectColor);
    });
}

const disableChoice = () => {

    let images = document.querySelectorAll('.boy, .girl');

    images.forEach((img) => {
        img.removeEventListener('touchstart', selectColor);
        img.removeEventListener('mousedown', selectColor);
    });
}

const enableTouch = () => {

    let dashes = document.querySelectorAll('.dash, .dash-v');

    dashes.forEach((dash) => {
        dash.addEventListener('touchstart', humanTurn);
        dash.addEventListener('mousedown', humanTurn);
    });
}

const disableTouch = () => {

    let dashes = document.querySelectorAll('.dash, .dash-v');

    dashes.forEach((dash) => {
        dash.removeEventListener('touchstart', humanTurn);
        dash.removeEventListener('mousedown', humanTurn);
    });
}

const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}