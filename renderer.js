var jsonCommands = []

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
    document.getElementById('command_list').innerHTML += `
    <li id="${item.id}" style="width:calc(100% - 40px); margin-bottom:10px;"><x-card><main><x-box>
        <x-label style="font-size:1.2em; font-weight:bold;">${item.name}<x-label>
        <x-box style="margin-top:10px" horizontal>
            ${buttons}
        </x-box>
    </x-box></main></x-card></li>`
}

load_commands();
async function close_app() { await window.versions.close_app() }
