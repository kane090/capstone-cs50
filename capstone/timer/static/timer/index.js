let timer;
let solve = 0;
let centiseconds = 0;
let seconds = 0;
let minutes = 0;

document.addEventListener("DOMContentLoaded", function() {
    generate_scramble();
})

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        if (!timer) {
            document.querySelector("#clock").style.color = "green";
        }
    }
});

document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        if (!timer) {
            document.querySelector("#clock").style.color = "black";
            document.querySelector("#centiseconds").innerHTML = "00";
            document.querySelector("#seconds").innerHTML = "0";
            document.querySelector("#minutes").innerHTML = "";
            document.querySelector("#colon").innerHTML = "";
            solve = 0;
            minutes = 0;
            seconds = 0;
            centiseconds = 0;
            timer = setInterval(updateTimer, 10);
        }
        else {
            clearInterval(timer);
            timer = null;
            fetch('/solve', {
                method: 'PUT',
                body: JSON.stringify({
                    time: solve,
                    scramble: document.querySelector("#scramble").innerHTML
                })
            });
            let new_time = document.createElement('td');
            new_time.innerHTML = proper_time(solve);
            document.querySelector('#solves').prepend(new_time);
            generate_scramble(); ao(5); ao(12);
            let solve_number = document.querySelector('#solves').childElementCount + 1;
            document.querySelector('#solve_number').innerHTML = `Solve #${solve_number}`;
        }
    }
});

function updateTimer() {
    let centiseconds = parseInt(document.querySelector("#centiseconds").innerHTML);
    let seconds = parseInt(document.querySelector("#seconds").innerHTML);
    solve++;
    centiseconds++;
    if (centiseconds === 100) {
        centiseconds = 0;
        seconds++;
        if (minutes > 0 && seconds < 10) {
            seconds = "0" + seconds;
        }
        document.querySelector("#seconds").innerHTML = seconds;
    }
    if (centiseconds < 10) {
        centiseconds = "0" + centiseconds;
    }
    if (seconds === 60) {
        seconds = 0;
        minutes++;
        seconds = "0" + seconds;
        document.querySelector("#colon").innerHTML = ":";
        document.querySelector("#minutes").innerHTML = minutes;
        document.querySelector("#seconds").innerHTML = seconds;
    }
    document.querySelector("#centiseconds").innerHTML = centiseconds;
}

function clear_times() {
    fetch('/clear');
    document.querySelector('#solves').innerHTML = '';
    document.querySelector('#ao5_solves').innerHTML = '';
    document.querySelector('#ao12_solves').innerHTML = '';
    document.querySelector('#average_5').innerHTML = '';
    document.querySelector('#average_12').innerHTML = '';
    document.querySelector('#solve_number').innerHTML = 'Solve #1';
}

function proper_time(time) {
    colon = "";
    centiseconds = time % 100;
    seconds = Math.floor((time / 100) % 60);
    minutes = Math.floor((time / 6000));
    if (centiseconds < 10) {
        centiseconds = "0" + centiseconds;
    }
    if (minutes > 0) {
        colon = ":";
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + colon + seconds + "." + centiseconds
    }
    return seconds + "." + centiseconds
}

function generate_scramble() {
    let face_num;
    let previous_face_num;
    let output = "";
    let face_to_turn;
    let turn_num;
    for (let i = 0; i < 20; i++) {
        do {
            face_num = Math.floor(Math.random() * 6) + 1;
        } while (face_num === previous_face_num);
        previous_face_num = face_num;
        if (face_num === 1) {
            face_to_turn = "R";
        }
        if (face_num === 2) {
            face_to_turn = "L";
        }
        if (face_num === 3) {
            face_to_turn = "U";
        }
        if (face_num === 4) {
            face_to_turn = "D";
        }
        if (face_num === 5) {
            face_to_turn = "F";
        }
        if (face_num === 6) {
            face_to_turn = "B";
        }
        turn_num = Math.floor(Math.random() * 3) + 1;
        if (turn_num === 1) {
            face_to_turn += "'";
        }
        if (turn_num === 2) {
            face_to_turn += "2";
        }
        output += face_to_turn + " ";
    }
    document.querySelector("#scramble").innerHTML = output;
}

function ao(number) {
    document.querySelector(`#ao${number}_solves`).innerHTML = '';
    fetch(`/averages/${number}`)
    .then(response => response.json())
    .then(solves => {
        solves.forEach(element => {
            const time = element["time"];
            let row = document.querySelector(`#ao${number}_solves`);
            let entry = document.createElement('td');
            entry.innerHTML = proper_time(time);
            row.append(entry);
        });
    });

    fetch(`/average_times/${number}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(time => {
        if (time) {
            const average = proper_time(time['average'].toFixed(2));
            document.querySelector(`#average_${number}`).innerHTML = `= ${average}`
        }
    });
}