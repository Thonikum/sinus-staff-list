/*
    Author: RLNT
    Requested by: Mortis
    License: MIT
    Repository: https://github.com/RLNT/sinus-staff-list
*/
registerPlugin(
    {
        name: 'Staff List',
        version: '1.1.0',
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
                title: 'Will make the usernames in the list clickable (hyperlink).',
                type: 'select',
                options: [ 'Hyperlink (clickable)', 'Plain Text' ]
            },
            {
                name: 'separator',
                title: 'The separator that should separate the groups in the channel.',
                type: 'multiline',
                placeholder: '_______________________________________'
            },
            {
                name: 'phraseOnline',
                title: 'The phrase that should be shown if the corresponding user is online.',
                type: 'string',
                placeholder: '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]'
            },
            {
                name: 'phraseOffline',
                title: 'The phrase that should be shown if the corresponding user is offline.',
                type: 'string',
                placeholder: '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]'
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
                if (group.clients === undefined || group.clients.length === 0) {
                    if (group.groups === undefined || group.groups.length === 0) {
                        group.clients = [];
                        group.groups = [ group.id ];
                    } else {
                        group.clients = [];
                        group.groups.map(id => backend.getServerGroupByID(id) !== undefined && id !== group.id);
                        group.groups.concat([ group.id ]);
                    }
                } else {
                    if (group.groups === undefined || group.groups.length === 0) {
                        group.groups = [ group.id ];
                    } else {
                        group.groups.map(id => backend.getServerGroupByID(id) !== undefined && id !== group.id);
                        group.groups.concat([ group.id ]);
                    }
                }
                if (group.name === undefined || group.name === '') {
                    group.name = '[size=12][B]' + backend.getServerGroupByID(group.id).name() + '[/B][/size]';
                }

                groupList = groupList.concat(group.groups);
                staffGroups.push(group);
            });

            return staffGroups;
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

        function updateDescription(staffGroups, clickable, phraseOnline, phraseOffline, separator, channel) {
            let description = '';
            const sortedMemberList = getSortedMemberList();
            const membersOnline = sortedMemberList[0];
            const membersOffline = sortedMemberList[1];
            staffGroups.forEach(staffGroup => {
                let membersToList = '';
                membersOnline.forEach(member => {
                    const memberUid = member[0];
                    const memberNick = member[1];
                    const memberGroup = member[2];

                    if (staffGroup.id === memberGroup) {
                        if (clickable) {
                            membersToList += `[URL=client://0/${memberUid}]${memberNick}[/URL] - ${phraseOnline}\n`;
                        } else {
                            membersToList += `${memberNick} - ${phraseOnline}\n`;
                        }
                    }
                });
                membersOffline.forEach(member => {
                    const memberUid = member[0];
                    const memberNick = member[1];
                    const memberGroup = member[2];

                    if (staffGroup.id === memberGroup) {
                        if (clickable) {
                            membersToList += `[URL=client://0/${memberUid}]${memberNick}[/URL] - ${phraseOffline}\n`;
                        } else {
                            membersToList += `${memberNick} - ${phraseOffline}\n`;
                        }
                    }
                });

                if (membersToList !== '') description += `${staffGroup.name}\n${membersToList}${separator}\n`;
            });

            // set new description to channel
            channel.setDescription(description);
        }

        // MAIN FUNCTION
        function main() {
            // VARIABLES
            const staffGroups = validateListGroups();
            const separator = config.separator || '_______________________________________';
            const clickable = config.clickable == 0 || true;
            const channel = backend.getChannelByID(config.channel);
            const phraseOnline = config.phraseOnline || '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]';
            const phraseOffline = config.phraseOffline || '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]';

            // store all online listed members
            backend.getClients().forEach(client => {
                const staffGroup = getClientGroup(client, staffGroups);
                if (staffGroup !== undefined) store.set(client.uid(), [ client.nick(), staffGroup.id ]);
            });

            // update the cached member list
            updateMemberList();

            // update the description for all currently known users
            updateDescription(staffGroups, clickable, phraseOnline, phraseOffline, separator, channel);

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
                if (group !== null) {
                    // on connect or disconnect
                    if (fromChannel === undefined || toChannel === undefined) {
                        // make sure user is stored
                        storeMember(uid, nick, group.id);

                        // update the description
                        updateDescription(staffGroups, clickable, phraseOnline, phraseOffline, separator, channel);
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
                    updateDescription(staffGroups, clickable, phraseOnline, phraseOffline, separator, channel);
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

                    updateDescription(staffGroups, clickable, phraseOnline, phraseOffline, separator, channel);
                }
            });
        }
    }
);
