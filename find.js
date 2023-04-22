let indents = "&nbsp;&nbsp;&nbsp;&nbsp;";
let temp = "";
let time = null;

function find(event, data, path, count, html) {
    try {
        let trigger = false;

        for (let folder in data["folders"]) {
            try {
                let local_trigger = false;

                if (folder.toLowerCase().includes(event.target.value.toLowerCase())) {
                    trigger = true;
                    local_trigger = true;
                }

                let div = document.createElement("div");
                div.setAttribute("id", path + folder);
                div.innerHTML += indents.repeat(count) + "💽&nbsp;";

                if (document.getElementById(path + folder) === null) {
                    html.appendChild(div);
                }

                let a = document.createElement("a");
                a.setAttribute("href", path + folder);
                a.textContent = folder;
                div.appendChild(a);

                let br = document.createElement("br");
                div.appendChild(br);

                let responce = find(event, data["folders"][folder], path + folder + "/", count + 1, div);

                if (responce === false && local_trigger === false) {
                    div.remove();
                }

                if (responce === true && trigger === false) {
                    trigger = true;
                }
            } catch {
                return false;
            }
        }

        for (let file in data["files"]) {
            try {
                if (data["files"][file].toLowerCase().includes(event.target.value.toLowerCase())) {
                    let div = document.createElement("div");
                    div.setAttribute("id", path + data["files"][file]);
                    div.innerHTML += indents.repeat(count) + "🎶&nbsp;";

                    if (document.getElementById(path + data["files"][file]) === null) {
                        html.appendChild(div);
                    }

                    let download = document.createElement("a");
                    download.setAttribute("href", "//base.bronyru.info/music/opus/" + path + data["files"][file]);
                    download.setAttribute("style", "text-decoration: none;");
                    download.setAttribute("download", "");
                    download.textContent = "📥";
                    div.appendChild(download);

                    div.innerHTML += "&nbsp;";

                    let a = document.createElement("a");
                    a.setAttribute("href", "#");
                    a.setAttribute("onclick", "event.preventDefault(); cm(`//base.bronyru.info/music/opus/" + path + data["files"][file] + "`, event);");
                    a.setAttribute("style", "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;");
                    a.textContent = data["files"][file].slice(0, -5);
                    div.appendChild(a);

                    let br = document.createElement("br");
                    div.appendChild(br);

                    trigger = true;
                }
            } catch {
                return false;
            }
        }
        return trigger;
    } catch {
        return false;
    }
}

function start(event, playlist, keypress) {
    try {
        if ((new Date - time) > 1000 && keypress === time) {
            time = null;

            if (temp === "") {
                temp = playlist.innerHTML;
            }

            playlist.innerHTML = "";

            fetch("dataset.json").then(function (response) {
                response.json().then(function (dataset) {
                    let responce = find(event, dataset["."], "", 0, playlist);

                    if (responce === false) {
                        playlist.innerHTML = "К сожалению, ничего не найдено...";
                    }
                })
            })
        } else {
            if (time === null) {
                return false;
            } else {
                setTimeout(function () {
                    start(event, playlist, keypress);
                }, 1000);
            }
        }
    } catch {
        return false;
    }
}

function search(event) {
    try {
        let playlist = document.getElementById("playlist");

        if (event !== undefined && event.target.value !== "") {
            let curent = new Date;

            time = curent;

            start(event, playlist, curent);
        } else {
            if (temp !== "") {
                playlist.innerHTML = temp;
                temp = "";
            }

            time = null;
        }
    } catch {
        return false;
    }
}
