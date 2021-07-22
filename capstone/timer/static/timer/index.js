let timer;
let solve = 0;

document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        if (!timer) {
            document.querySelector("#centiseconds").innerHTML = 00;
            document.querySelector("#seconds").innerHTML = 0;
            solve = 0;
            timer = setInterval(updateTimer, 10);
        }
        else {
            clearInterval(timer);
            timer = null;
            fetch('/solve', {
                method: 'PUT',
                body: JSON.stringify({
                    time: solve
                })
            });
            let new_time = document.createElement('div');
            new_time.innerHTML = (solve / 100).toFixed(2);
            let solves = document.querySelector("#times");
            solves.insertBefore(new_time, solves.firstChild);
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
    }
    if (centiseconds < 10) {
        centiseconds = "0" + centiseconds;
    }
    document.querySelector("#centiseconds").innerHTML = centiseconds;
    document.querySelector("#seconds").innerHTML = seconds;
}

function clear_times() {
    fetch('/clear');
    document.querySelector('#times').innerHTML = '';
}