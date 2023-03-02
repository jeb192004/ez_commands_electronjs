var jsonCommands = []

async function remove_command(el) {
    if (el.id.split('_')[2] === 'yes') {
        var id = el.id.split('_')[3];
        var tempJson = []
        jsonCommands.forEach(async (item, index) => {
            if (item.id != id) {
                tempJson.push(item)
            }
            if (index + 1 === jsonCommands.length) {
                jsonCommands = tempJson;
                var dialog_id = `confirm_remove_${el.id.split('_')[3]}`
                var dialog = document.querySelector('#'+dialog_id);
                dialog.close()
                await versions.remove_command(jsonCommands)
                var elem = document.getElementById(`${id}`);
                elem.parentNode.removeChild(elem);
            }
        })
    }
}

function close_remove_dialog(el){
    var id = `confirm_remove_${el.id.split('_')[3]}`
    var dialog = document.querySelector('#'+id);
    dialog.close()
}

async function add_command() {
    var command_title = document.getElementById('command_title').value;
    var command = document.getElementById('command').value;
    if (command_title != '' && command != '') {
        var new_command = await build_command_json(command_title, command)
        jsonCommands.push(new_command)
        await versions.save_commands(jsonCommands);
        build_li_item(new_command)
        document.getElementById('command_title').value = "";
        document.getElementById('command').value = "";
    } else {
        if (command_title === '') { console.log('title is empty') }
        if (command === '') { console.log('command is empty') }
    }
}

async function build_command_json(title, command) {
    return new Promise((resolve, reject) => {
        var json = {}
        json["id"] = jsonCommands.length;
        json["name"] = title;
        json['command'] = command;
        resolve(json)
    })
}

async function copy(el) {
    command = ''
    if (el.id.includes('clone')) {
        command = find_command(el.id.split('_')[1]).replace('push', 'clone').replace('pull', 'clone')
    } else if (el.id.includes('push')) {
        command = find_command(el.id.split('_')[1]).replace('clone', 'push').replace('pull', 'push')
    } else if (el.id.includes('pull')) {
        command = find_command(el.id.split('_')[1]).replace('clone', 'pull').replace('push', 'pull')
    } else {
        command = find_command(el.id.split('_')[1])
    }
    navigator.clipboard.writeText(command)
}

function find_command(el) {
    for (var command of jsonCommands) {
        if (command.id.toString() === el) {
            return command.command
        }
    }
}
async function load_commands() {
    var response = await versions.load_commands();
    jsonCommands = JSON.parse(response);
    jsonCommands.forEach((item) => {
        build_li_item(item)
    })

}

function build_li_item(item) {
    var buttons = ''
    if (item.command.includes('git')) {
        buttons += `<x-button id='clone_${item.id}' onclick="copy(this)" style="margin-right:10px;"><x-icon href="#copy"></x-icon><x-label>Clone</x-Label></x-button>`
        buttons += `<x-button id='push_${item.id}' onclick="copy(this)" style="margin-right:10px;"><x-icon href="#copy"></x-icon><x-label>Push</x-Label></x-button>`
        buttons += `<x-button id='pull_${item.id}' onclick="copy(this)" style="margin-right:10px;"><x-icon href="#copy"></x-icon><x-label>Pull</x-Label></x-button>`

    } else { buttons = `<x-button id="copy_${item.id}" onclick="copy(this)"><x-icon href="#copy"></x-icon><x-label>Copy</x-Label></x-button>` }
    buttons += `<x-button style="position: absolute; right:20px" id='remove_${item.id}' style="margin-right:10px;"><x-icon href="#remove"></x-icon><x-label>Remove</x-Label>
    <dialog id="confirm_remove_${item.id}">
            <main>
                <p>Are you sure you want to remove this command?  This cannot be undone.</p>
            </main>
            <footer>
                    <x-button id="confirm_remove_yes_${item.id}" onclick="remove_command(this)">
                        <x-label>Yes</x-label>
                    </x-button>
                    <x-button autofocus toggled style="background-color:red;" id="confirm_remove_no_${item.id}" onclick="close_remove_dialog(this)">
                        <x-label>No</x-label>
                    </x-button>
            </footer>
        </dialog></x-button>`

    document.getElementById('command_list').innerHTML += `
    <li id="${item.id}" style="width:calc(100% - 40px); margin-bottom:10px;" position:relative;><x-card><main><x-box>
        <x-label style="font-size:1.2em; font-weight:bold;">${item.name}<x-label>
        <x-box style="margin-top:10px" horizontal>
            ${buttons}
        </x-box>
    </x-box></main></x-card></li>`
}

load_commands();
async function close_app() { await window.versions.close_app() }
