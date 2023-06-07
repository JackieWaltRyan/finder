let indents = "&nbsp;&nbsp;&nbsp;&nbsp;";
let temp = "";
let timeout = null;

function search(value) {
    try {
        let playlist = document.getElementById("playlist");

        if (value !== "") {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                if (temp === "") {
                    temp = playlist.innerHTML;
                }

                playlist.innerHTML = "";

                let xhr = new XMLHttpRequest();
                xhr.open("GET", "finder/dataset.json", false);
                xhr.send();

                if (xhr.status === 200) {
                    let dataset = JSON.parse(xhr.responseText);
                    let responce = find(value, dataset["."], "", 0, playlist);

                    if (responce === false) {
                        playlist.innerHTML = "К сожалению, ничего не найдено...";
                    }
                } else {
                    playlist.innerHTML = "Ошибка загрузки файла dataset.json.<br><br>Обновите страницу и попробуйте еще раз.<br><br>Если ошибка повториться обратитесь к администратору сайта для решения проблемы.";
                }
            }, 1000);
        } else {
            if (temp !== "") {
                playlist.innerHTML = temp;
                temp = "";
            }
        }
    } catch {
        return false;
    }
}

function find(value, data, path, count, html) {
    try {
        let trigger = false;

        for (let folder in data["folders"]) {
            try {
                let local_trigger = false;

                if (folder.toLowerCase().includes(value.toLowerCase())) {
                    trigger = true;
                    local_trigger = true;
                }

                let div = document.createElement("div");
                div.id = path + folder;
                div.innerHTML += indents.repeat(count) + "💽&nbsp;";

                if (document.getElementById(path + folder) === null) {
                    html.appendChild(div);
                }

                let a = document.createElement("a");
                a.href = ("/стафф/музыка/" + path + folder);
                a.textContent = folder;
                div.appendChild(a);

                let br = document.createElement("br");
                div.appendChild(br);

                let responce = find(value, data["folders"][folder], path + folder + "/", count + 1, div);

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
                if (data["files"][file].toLowerCase().includes(value.toLowerCase())) {
                    let div = document.createElement("div");
                    div.id = path + data["files"][file];
                    div.innerHTML += indents.repeat(count) + "🎶&nbsp;";

                    if (document.getElementById(path + data["files"][file]) === null) {
                        html.appendChild(div);
                    }

                    let download = document.createElement("a");
                    download.href = "//base.bronyru.info/music/opus/" + path + data["files"][file];
                    download.style.textDecoration = "none";
                    download.download = "";
                    download.textContent = "📥";
                    div.appendChild(download);

                    div.innerHTML += "&nbsp;";

                    let a = document.createElement("a");
                    a.href = "#";
                    a.style.overflow = "hidden";
                    a.style.textOverflow = "ellipsis";
                    a.style.whiteSpace = "nowrap";
                    a.textContent = data["files"][file].slice(0, -5);
                    a.onclick = (event) => {
                        event.preventDefault();
                        cm(("//base.bronyru.info/music/opus/" + path + data["files"][file]), event);
                    };
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
