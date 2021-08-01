function change_pb(type) {
    let pb_to_change = document.querySelector(`#${type}`);
    let current_pb = pb_to_change.innerHTML;
    pb_to_change.remove();

    let cell = document.createElement('td');
    let textarea = document.createElement('textarea');
    cell.id = `${type}`;
    textarea.id = `${type}_textarea`;
    textarea.innerHTML = current_pb;
    textarea.rows = 1;
    textarea.cols = 5;
    cell.innerHTML = textarea.outerHTML;

    let button = document.createElement('button');
    button.id = `save_${type}`;
    button.onclick = function() {
        save_pb(type);
    }
    button.type = "button";
    button.className = "btn btn-primary btn-sm";
    button.innerHTML = "Save (in seconds)";

    cell.append(button);
    
    if (type === "single") {
        let data = document.querySelector('#data');
        data.prepend(cell);
    }
    if (type === "ao5") {
        let single = document.querySelector('#single');
        single.parentNode.insertBefore(cell, single.nextSibling);
    }
    if (type === "ao12") {
        let ao5 = document.querySelector('#ao5');
        ao5.parentNode.insertBefore(cell, ao5.nextSibling);
    }
}

function save_pb(type) {
    let textarea = document.querySelector(`#${type}_textarea`);
    if (!textarea.value) {
        return false;
    }
    let pb = textarea.value;
    fetch(`/save_pb/${type}`, {
        method: 'PUT',
        body: JSON.stringify({
            time: pb
        })
    })
    .then(response => response.json())
    .then(new_time => {
        let time = new_time["proper_time"];
        let cell_to_delete = document.querySelector(`#${type}`);
        cell_to_delete.remove();
        let cell_to_insert = document.createElement('td');
        cell_to_insert.id = `${type}`;
        cell_to_insert.innerHTML = time;
        cell_to_insert.onclick = function() {
            change_pb(`${type}`);
        }
        if (type === "single") {
            let data = document.querySelector('#data');
            data.prepend(cell_to_insert);
        }
        if (type === "ao5") {
            let single = document.querySelector('#single');
            single.parentNode.insertBefore(cell_to_insert, single.nextSibling);
        }
        if (type === "ao12") {
            let ao5 = document.querySelector('#ao5');
            ao5.parentNode.insertBefore(cell_to_insert, ao5.nextSibling);
        }
    });
}