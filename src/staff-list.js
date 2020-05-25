/*
    Author: RLNT
    Requested by: Mortis
    License: MIT
    Repository: https://github.com/RLNT/sinus-staff-list
*/
registerPlugin(
    {
        name: 'Staff List',
        version: '1.2.0',
        description:
            'With this script, the bot will automatically keep track of the online status of predefined staff members and post it to a chosen channel description.',
        author: 'RLNT',
        backends: [ 'ts3' ],
        vars: [
            {
                name: 'required',
                title: 'All fields that are marked with (*) are required!'
            },
            {
                name: 'format',
                title: 'You can use the normal BB code to format your text like in TeamSpeak.'
            },
            {
                name: 'priority',
                title:
                    'The order in which you define the groups is important! The script will go from top to bottom and overwrite each group so the last group you defined has the highest priority. Should a user be a member of two groups, they will only be displayed in the last one.'
            },
            {
                name: 'functionality',
                title:
                    "The script stores usernames from people that should be listed. Each user that needs to appear in the list has to join the server atleast once while the script is running. If the script doesn't have any stored members for a specific group yet, it will not be displayed."
            },
            {
                name: 'channel',
                title: 'The channel where the staff list should be shown in. (*)',
                type: 'channel'
            },
            {
                name: 'clickable',
                title: 'Do you want the usernames in the list to be clickable (hyperlinks)?',
                type: 'select',
                options: [ 'Hyperlink (clickable)', 'Plain Text' ]
            },
            {
                name: 'template',
                title: 'Do you want to use a custom template to format your staff list? (*) | Advanced Option',
                type: 'select',
                options: [ 'Yes', 'No' ]
            },
            {
                name: 'tUsername',
                title:
                    'Define what the username in the list should look like. | placeholders: %name% - nickname of the user',
                type: 'string',
                placeholder: '[B]%name%[/B]',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 0
                    }
                ]
            },
            {
                name: 'tPhraseOnline',
                title: 'Define what the phrase if a user is online should look like.',
                type: 'string',
                placeholder: '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 0
                    }
                ]
            },
            {
                name: 'tPhraseOffline',
                title: 'Define what the phrase if a user is offline should look like.',
                type: 'string',
                placeholder: '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 0
                    }
                ]
            },
            {
                name: 'tMemberLine',
                title:
                    'Define what a full line in the member list should look like. | placeholders: %name% - formatted username, %status% - formatted online status, %lb% - line break',
                type: 'multiline',
                placeholder: '%name% [COLOR=#aaff00]>[/COLOR] %status%',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 0
                    }
                ]
            },
            {
                name: 'tGroupSection',
                title:
                    'Define what a group section should look like. | placeholders: %group% - formatted group name, %members% - formatted member lines, %lb% - line break',
                type: 'multiline',
                placeholder: '[center]%group%\n%members%\n____________________\n[/center]\n%lb%',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 0
                    }
                ]
            },
            {
                name: 'separator',
                title: 'The separator that should separate the groups in the channel.',
                type: 'multiline',
                placeholder: '_______________________________________',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 1
                    }
                ]
            },
            {
                name: 'phraseOnline',
                title: 'The phrase that should be shown if the corresponding user is online.',
                type: 'string',
                placeholder: '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 1
                    }
                ]
            },
            {
                name: 'phraseOffline',
                title: 'The phrase that should be shown if the corresponding user is offline.',
                type: 'string',
                placeholder: '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 1
                    }
                ]
            },
            {
                name: 'staffGroups',
                title: 'Staff Groups',
                type: 'array',
                vars: [
                    {
                        name: 'id',
                        title: 'The ID of the group. (*)',
                        indent: 2,
                        type: 'string',
                        placeholder: '1337'
                    },
                    {
                        name: 'name',
                        title:
                            'The name that should be shown for the group. If not set, it will use the default group name.',
                        indent: 2,
                        type: 'multiline',
                        placeholder: '[COLOR=#aa007f][size=12][B]ADMIN[/B][/size][/COLOR]'
                    },
                    {
                        name: 'clients',
                        title: 'A list of additional clients IDs that should also count towards that group.',
                        indent: 2,
                        type: 'strings'
                    },
                    {
                        name: 'groups',
                        title: 'A list of additional group IDs that should also count towards that group.',
                        indent: 2,
                        type: 'strings'
                    }
                ]
            }
        ]
    },
    (_, config) => {
        // DEPENDENCIES
        const engine = require('engine');
        const backend = require('backend');
        const event = require('event');
        const store = require('store');

        // GLOBAL VARS
        const prefix = 'Staff-List';
        let memberList = [];
        let groupList = [];

        // GLOBAL FUNCTIONS
        function log(message) {
            engine.log(prefix + ' > ' + message);
        }

        function waitForBackend() {
            if (backend.isConnected()) {
                main();
            } else {
                setTimeout(waitForBackend, 2000);
            }
        }

        // LOADING EVENT
        event.on('load', () => {
            if (config.channel === undefined) {
                log('There was no channel selected to display the staff list. Deactivating script...');
                return;
            } else if (config.staffGroups === undefined || config.staffGroups.length === 0) {
                log('There are no staff groups selected to be displayed in the staff list. Deactivating script...');
                return;
            } else if (config.template === undefined) {
                log('There was no formatting option selected. Deactivating script...');
                return;
            } else {
                log('The script has loaded successfully!');
                waitForBackend();
            }
        });

        // FUNCTIONS
        function validateListGroups() {
            let staffGroups = [];

            config.staffGroups.forEach(group => {
                if (group.id === undefined || backend.getServerGroupByID(group.id) === undefined) return;
                if (group.clients === undefined || group.clients.length === 0) group.clients = [];
                if (group.groups === undefined || group.groups.length === 0) {
                    group.groups = [ group.id ];
                } else {
                    group.groups.map(id => backend.getServerGroupByID(id) !== undefined && id !== group.id);
                    group.groups.push(group.id);
                }
                if (group.name === undefined || group.name === '') {
                    group.name = '[size=12][B]' + backend.getServerGroupByID(group.id).name() + '[/B][/size]';
                }

                groupList = groupList.concat(group.groups);
                staffGroups.push(group);
            });

            return staffGroups;
        }

        function validateDatabase() {
            store.getKeys().forEach(key => {
                if (!groupList.includes(store.get(key)[1])) removeMember(key);
            });
        }

        function updateMemberList() {
            let list = [];
            const keys = store.getKeys();
            keys.forEach(key => {
                list.push([ key, store.get(key)[0], store.get(key)[1] ]);
            });

            memberList = list;
        }

        function storeMember(uid, nick, group) {
            if (!store.getKeys().includes(uid)) {
                store.set(uid, [ nick, group ]);
            } else if (store.get(uid)[0] !== nick) {
                store.unset(uid);
                store.set(uid, [ nick, group ]);
            } else if (store.get(uid)[1] !== group) {
                store.unset(uid);
                store.set(uid, [ nick, group ]);
            }
            updateMemberList();
        }

        function removeMember(uid) {
            if (store.getKeys().includes(uid)) {
                store.unset(uid);
                updateMemberList();
            }
        }

        function getClientGroup(client, staffGroups) {
            let group = undefined;
            staffGroups.forEach(staffGroup => {
                if (isMemberOfClients(client, staffGroup.clients)) {
                    group = staffGroup;
                } else if (isMemberOfGroups(client, staffGroup.groups)) {
                    group = staffGroup;
                }
            });

            return group;
        }

        function isMemberOfClients(client, clients) {
            return clients.includes(client.uid());
        }

        function isMemberOfGroups(client, groups) {
            let found = false;
            client.getServerGroups().forEach(clientGroup => {
                if (groups.includes(clientGroup.id())) {
                    found = true;
                    return;
                }
            });
            return found;
        }

        function getSortedMemberList() {
            let membersOnline = [];
            let membersOffline = [];
            memberList.forEach(member => {
                const memberUid = member[0];
                if (backend.getClientByUID(memberUid) !== undefined) {
                    membersOnline.push(member);
                } else {
                    membersOffline.push(member);
                }
            });
            membersOnline.sort((a, b) => {
                if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
                if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
                return 0;
            });
            membersOffline.sort((a, b) => {
                if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
                if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
                return 0;
            });

            return [ membersOnline, membersOffline ];
        }

        function updateDescription(staffGroups, channel) {
            const template = config.template == 0;
            const clickable = config.clickable == 0;
            let username, memberLine, groupSection, separator, phraseOnline, phraseOffline;

            if (config.template == 0) {
                username = config.tUsername || '[B]%name%[/B]';
                memberLine = config.tMemberLine || '%name% [COLOR=#aaff00]>[/COLOR] %status%';
                groupSection = config.tGroupSection || '[center]%group%\n%members%____________________[/center]';
                phraseOnline = config.tPhraseOnline || '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]';
                phraseOffline = config.tPhraseOffline || '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]';
            } else {
                separator = config.separator || '_______________________________________';
                phraseOnline = config.phraseOnline || '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]';
                phraseOffline = config.phraseOffline || '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]';
            }

            const sortedMemberList = getSortedMemberList();
            const membersOnline = sortedMemberList[0];
            const membersOffline = sortedMemberList[1];
            let description = '';

            staffGroups.forEach(staffGroup => {
                let membersToList = '';
                membersOnline.forEach(member => {
                    const memberUid = member[0];
                    const memberNick = member[1];
                    const memberGroup = member[2];

                    if (staffGroup.id === memberGroup) {
                        let memberName = '';
                        if (clickable) {
                            memberName = `[URL=client://0/${memberUid}]${memberNick}[/URL]`;
                        } else {
                            memberName = `${memberNick}`;
                        }

                        let memberToList = '';
                        if (template) {
                            memberToList = memberLine
                                .replace('%name%', username.replace('%name%', memberName))
                                .replace('%status%', phraseOnline)
                                .replace('%lb%', '\n');
                        } else {
                            memberToList = `${memberName} - ${phraseOnline}`;
                        }

                        membersToList += `${memberToList}\n`;
                    }
                });
                membersOffline.forEach(member => {
                    const memberUid = member[0];
                    const memberNick = member[1];
                    const memberGroup = member[2];

                    if (staffGroup.id === memberGroup) {
                        let memberName = '';
                        if (clickable) {
                            memberName = `[URL=client://0/${memberUid}]${memberNick}[/URL]`;
                        } else {
                            memberName = `${memberNick}`;
                        }

                        let memberToList = '';
                        if (template) {
                            memberToList = memberLine
                                .replace('%name%', username.replace('%name%', memberName))
                                .replace('%status%', phraseOffline)
                                .replace('%lb%', '\n');
                        } else {
                            memberToList = `${memberName} - ${phraseOffline}`;
                        }

                        membersToList += `${memberToList}\n`;
                    }
                });

                if (membersToList !== '') {
                    if (template) {
                        description += groupSection
                            .replace('%group%', staffGroup.name)
                            .replace('%members%', membersToList.substring(0, membersToList.length - 1))
                            .replace('%lb%', '\n');
                    } else {
                        description += `${staffGroup.name}\n${membersToList}${separator}\n`;
                    }
                }
            });

            // set new description to channel
            channel.setDescription(description);
        }

        // MAIN FUNCTION
        function main() {
            // VARIABLES
            const staffGroups = validateListGroups();
            const channel = backend.getChannelByID(config.channel);

            // validate database
            validateDatabase();

            // store all online listed members
            backend.getClients().forEach(client => {
                const staffGroup = getClientGroup(client, staffGroups);
                if (staffGroup !== undefined) {
                    storeMember(client.uid(), client.nick(), staffGroup.id);
                } else {
                    removeMember(client.uid());
                }
            });

            // update the cached member list
            updateMemberList();

            // update the description for all currently known users
            updateDescription(staffGroups, channel);

            // MOVE EVENT
            event.on('clientMove', event => {
                const client = event.client;
                if (client.isSelf()) return;
                const fromChannel = event.fromChannel;
                const toChannel = event.toChannel;
                const uid = client.uid();
                const nick = client.nick();
                const group = getClientGroup(client, staffGroups);

                // make sure it's a user that has to be listed
                if (group !== undefined) {
                    // on connect or disconnect
                    if (fromChannel === undefined || toChannel === undefined) {
                        // make sure user is stored
                        storeMember(uid, nick, group.id);

                        // update the description
                        updateDescription(staffGroups, channel);
                    }
                }
            });

            // SERVER GROUP ADDED EVENT
            event.on('serverGroupAdded', event => {
                const client = event.client;
                if (client.isSelf()) return;
                const eventGroup = event.serverGroup.id();
                const clientGroup = getClientGroup(client, staffGroups);

                if (groupList.includes(eventGroup)) {
                    storeMember(client.uid(), client.nick(), clientGroup.id);
                    updateDescription(staffGroups, channel);
                }
            });

            // SERVER GROUP REMOVE EVENT
            event.on('serverGroupRemoved', event => {
                const client = event.client;
                if (client.isSelf()) return;
                const eventGroup = event.serverGroup.id();
                const clientGroup = getClientGroup(client, staffGroups);

                if (groupList.includes(eventGroup)) {
                    if (clientGroup === undefined) {
                        removeMember(client.uid());
                    } else {
                        storeMember(client.uid(), client.nick(), clientGroup.id);
                    }

                    updateDescription(staffGroups, channel);
                }
            });
        }
    }
);
