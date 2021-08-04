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
            remove_alert('single'); remove_alert('ao5'); remove_alert('ao12');
            timer = setInterval(updateTimer, 10);
        }
        else {
            clearInterval(timer);
            timer = null;
            add_solve(true);
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
    remove_alert('single'); remove_alert('ao5'); remove_alert('ao12');
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

// Scramble generator based on
// https://codepen.io/yzwsvzzolk/pen/wfukC
function generate_scramble() {
    let face_num;
    let previous_face_num;
    let output = "";
    let face_to_turn;
    let turn_num;
    for (let i = 0; i < 20; i++) {
        do {
            face_num = Math.floor(Math.random() * 6) + 1;
        } while (face_num === previous_face_num); // Cannot have two consecutive moves with the same face
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

function update_averages(number, node) {
    average = document.querySelector(`#ao${number}_solves`);
    average.prepend(node);
    if (average.childElementCount > number) {
        average.removeChild(average.lastElementChild);
    }
    fetch(`/average_times/${number}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(time => {
        if (time) {
            const actual_average = proper_time(time['average'].toFixed(2));
            let average_div = document.querySelector(`#average_${number}`);
            let equal_sign = document.querySelector(`#equal_sign_${number}`);
            let average_span = document.querySelector(`#average_${number}_span`);
            if (!equal_sign) {
                equal_sign = document.createElement('span');
                equal_sign.id = `equal_sign_${number}`;
                equal_sign.style.paddingRight = '7px';
                equal_sign.innerHTML = " = ";
                average_div.appendChild(equal_sign);
            }
            if (!average_span) {
                average_span = document.createElement('span');
                average_span.id = `average_${number}_span`;
                average_span.innerHTML = actual_average;
                average_div.appendChild(average_span);
            }
            else {
                average_span.innerHTML = actual_average;
            }
            if (time['message']) {
                make_message(time);
            }
        }
    });
}

function make_message(dictionary) {
    let table_item = document.createElement('td');
    let alert = document.createElement('div');
    let id = dictionary['id'];
    table_item.id = `success_${id}`;
    alert.className = "alert alert-success";
    alert.setAttribute('role', "alert");
    alert.innerHTML = dictionary['message'];
    table_item.innerHTML = alert.outerHTML;
    let relative = document.querySelector('#success');
    relative.prepend(table_item);
}

function remove_alert(id) {
    let alert = document.querySelector(`#success_${id}`);
    if (alert) {
        alert.parentNode.removeChild(alert);
    }
}

function add_time() {
    let add = document.createElement('textarea');
    add.id = 'add_time';
    add.rows = 1;
    add.cols = 5;
    let add_button = document.querySelector('#add');
    add_button.parentNode.appendChild(add);
    add_button.onclick = function() {
        add_solve(false);
    }
}

function add_solve(condition) {
    if (condition === false) { // Checking whether the timer was used or a solve was added
        let textarea = document.querySelector('#add_time');
        document.querySelector("#add_time").remove();
        document.querySelector("#add").onclick = function() {
            add_time();
        }
        if (!textarea.value) {
            return false;
        }
        solve_to_insert = Math.floor((parseFloat(textarea.value)) * 100);
        remove_alert('single'); remove_alert('ao5'); remove_alert('ao12');
    }
    else {
        solve_to_insert = solve; // Timer was used
    }
    fetch('/solve', {
        method: 'PUT',
        body: JSON.stringify({
            time: solve_to_insert,
            scramble: document.querySelector("#scramble").innerHTML
        })
    })
    .then(response => response.json())
    .then(message => {
        if (message["message"]) {
            make_message(message);
        }

        // Adding solve to time list
        let new_time = document.createElement('td');
        new_time.className = "px-3";
        new_time.onclick = function() {
            solve_info(message["solve_info"]);
        }
        new_time.innerHTML = proper_time(solve_to_insert);
        document.querySelector('#solves').prepend(new_time);
        
        // Updating solve number
        let solve_number = document.querySelector('#solves').childElementCount + 1;
        document.querySelector('#solve_number').innerHTML = `Solve #${solve_number}`;
    });

    generate_scramble(); // Generate new scramble

    // Adding solve to ao5 and ao12 list
    let new_time_span = document.createElement('span');
    new_time_span.style.paddingLeft = '15px';
    new_time_span.innerHTML = proper_time(solve_to_insert);
    update_averages(5, new_time_span);
    clone = new_time_span.cloneNode(true);
    update_averages(12, clone);
}

function solve_info(id) {
    output = "";
    time = "Time: ";
    scramble = "Scramble: ";
    date = "Date: ";

    fetch(`/solve_info/${id}`)
    .then(response => response.json())
    .then(info => {
        time += proper_time(info["time"]);
        scramble += info["scramble"];
        date += info["date"];
        output += time + "\n" + scramble + "\n" + date;
        alert(output);
    });
}