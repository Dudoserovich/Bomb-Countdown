let minChoose = document.getElementById('min');
let secChoose = document.getElementById('sec');
let millChoose = document.getElementById('mill');

let min = document.querySelector('.time .min');
let sec = document.querySelector('.time .sec');
let mill = document.querySelector('.time .mill');

let time;
let date = new Date();

let startPauseBtn = document.querySelector('.buttons :first-child');

function generateChoose() {

    for (let i = 0; i < 60; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", '' + i);
        option.textContent = i + ' мин';
        minChoose.appendChild(option);
    }

    for (let i = 0; i < 60; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", '' + i);
        option.textContent = i + ' сек';
        secChoose.appendChild(option);
    }

    for (let i = 0; i < 1000 / 100; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", '' + i * 100);
        option.textContent = i * 100 + ' мс';
        millChoose.appendChild(option);
    }
}

generateChoose();

minChoose.addEventListener("change", () => {
    let val = minChoose.options[minChoose.selectedIndex].value;
    if (val > 9)
        min.textContent = val;
    else
        min.textContent = '0' + val;
});

secChoose.addEventListener("change", () => {
    let val = secChoose.options[secChoose.selectedIndex].value;
    if (val > 9)
        sec.textContent = val;
    else
        sec.textContent = '0' + val;
});

millChoose.addEventListener("change", () => {
    let val = millChoose.options[millChoose.selectedIndex].value;
    if (val > 0)
        mill.textContent = val;
    else
        mill.textContent = '00' + val;
});

function start() {
    time = Number(min.textContent) * 60 * 1000 + Number(sec.textContent) * 1000 + Number(mill.textContent);
    console.log(time);

    document.querySelector('.buttons :last-child').style.cursor = 'pointer';

    if (startPauseBtn.textContent !== 'pause' && time !== 0) {
        timer().then(() => {
            minChoose.value = -1;
            secChoose.value = -1;
            millChoose.value = -1;
            startPauseBtn.textContent = 'pause';
        });
    } else if (time === 0) {
        alert('Прежде чем запустить таймер, задайте время!')
    }
}

function updateTimer(num) {
    if (Math.floor(num / 1000 / 60) <= 0 && Math.floor(num / 1000) % 60 <= 0 && Math.floor(num) % 1000 <= 0) {
        min.textContent = '00';
        sec.textContent = '00';
        mill.textContent = '000'
    } else {
        // минуты
        min.textContent = addZero(Math.floor(num / 1000 / 60), 2);
        // секунды
        sec.textContent = addZero(Math.floor(num / 1000) % 60, 2);
        // миллисекунды
        mill.textContent = addZero(Math.floor(num) % 1000, 3);
    }
}

async function timer() {
    new Promise((resolve, reject) => {
        date.setMilliseconds(time);
        let dateFin = Date.now() + time;

        console.log("Start timer");
        let interval = setInterval(() => {
            updateTimer(dateFin - Date.now());
            console.log(dateFin - Date.now());
            if (dateFin - Date.now() <= 0) {
                clearInterval(interval);
                resolve("End timer");
            }
        });

        document.querySelector('.buttons :first-child').addEventListener("click", () => {
            clearInterval(interval);
            resolve('pause');
        });

        document.querySelector('.buttons :last-child').addEventListener("click", () => {
            clearInterval(interval);
            resolve('stop');
            updateTimer(0);
            document.querySelector('.buttons :last-child').style.cursor = 'not-allowed';
        });

    }).then(str => {
        console.log(str);
        if (str === 'End timer') {
            let audio = new Audio();
            audio.preload = 'auto';
            audio.src = 'oh-shit-iam-sorry.wav';
            audio.play();

            document.querySelector('.buttons :last-child').style.cursor = 'not-allowed';
        }
        startPauseBtn.textContent = 'start';
    });
}

function addZero(item, n) {
    while (item.toString().length < n)
        item = "0" + item;
    return item;
}