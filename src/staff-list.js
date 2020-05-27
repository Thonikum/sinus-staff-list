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
                name: 'functionality',
                title:
                    "The script stores usernames from people that should of the staff groups. Each user you want to list has to join the server at least once while the script is running. If the script doesn't have any stored users for a specific group yet, it will not be displayed."
            },
            {
                name: 'configuration',
                title: 'A guide how to configure the script to your needs can be found here: ' // TODO
            },
            {
                name: 'spacer0',
                title: ''
            },
            {
                name: 'header0',
                title: '->>> General Options <<<-'
            },
            {
                name: 'channel',
                title: 'Display-Channel > Define the channel where the staff list should be shown in! (*)',
                type: 'channel'
            },
            {
                name: 'clickable',
                title:
                    'Clickable-Names > Do you want the usernames in the list to be clickable? They work like hyperlinks then.',
                type: 'select',
                options: [ 'Yes', 'No' ]
            },
            {
                name: 'away',
                title: 'Away-Status > Do you want a third status (besides online & offline) if someone is away/afk?',
                type: 'select',
                options: [ 'Yes', 'No' ]
            },
            {
                name: 'awayChannel',
                title: 'Away-Channel > Do you want to set someone away/afk if they join an afk channel?',
                type: 'select',
                options: [ 'Yes', 'No' ],
                indent: 1,
                conditions: [
                    {
                        field: 'away',
                        value: 0
                    }
                ]
            },
            {
                name: 'afkChannel',
                title: 'AFK-Channel > Define the afk channel! (*)',
                type: 'channel',
                indent: 2,
                conditions: [
                    {
                        field: 'away',
                        value: 0
                    },
                    {
                        field: 'awayChannel',
                        value: 0
                    }
                ]
            },
            {
                name: 'awayMute',
                title: 'Away-Mute > Do you want to count muted clients as away/afk?',
                type: 'select',
                options: [ 'Yes', 'No' ],
                indent: 1,
                conditions: [
                    {
                        field: 'away',
                        value: 0
                    }
                ]
            },
            {
                name: 'awayDeaf',
                title: 'Away-Deaf > Do you want to count deaf clients as away/afk?',
                type: 'select',
                options: [ 'Yes', 'No' ],
                indent: 1,
                conditions: [
                    {
                        field: 'away',
                        value: 0
                    }
                ]
            },
            {
                name: 'spacer1',
                title: ''
            },
            {
                name: 'header1',
                title: '->>> Text & Format Options <<<-'
            },
            {
                name: 'format',
                title: 'You can use the normal BB code to format your text like in TeamSpeak.'
            },
            {
                name: 'template',
                title: 'Custom-Template > Do you want to use a custom template to format your staff list?',
                type: 'select',
                options: [ 'Yes', 'No' ]
            },
            {
                name: 'tUsername',
                title:
                    'Username > Define what the name of a user in the list should look like! | placeholders: %name% - name of the user',
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
                title: 'Online-Phrase > Define what the phrase if a user is online should look like!',
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
                name: 'tPhraseAway',
                title: 'Away-Phrase > Define what the phrase if a user is away/afk should look like!',
                type: 'string',
                placeholder: '[COLOR=#c8c8c8][B]AWAY[/B][/COLOR]',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 0
                    },
                    {
                        field: 'away',
                        value: 0
                    }
                ]
            },
            {
                name: 'tPhraseOffline',
                title: 'Offline-Phrase > Define what the phrase if a user is offline should look like!',
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
                    'User-Line > Define what a full line in the member list should look like! | placeholders: %name% - formatted username, %status% - formatted status phrase, %lb% - line break',
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
                    'Group-Section > Define what a group section should look like! | placeholders: %group% - formatted group name, %users% - formatted member list, %lb% - line break',
                type: 'multiline',
                placeholder: '[center]> %group% <\n%users%\n____________________\n[/center]%lb%',
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
                title: 'Separator > Define what the separator between each group section should look like!',
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
                title: 'Online-Phrase > Define what the phrase if a user is online should look like!',
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
                name: 'phraseAway',
                title: 'Away-Phrase > Define what the phrase if a user is away/afk should look like!',
                type: 'string',
                placeholder: '[COLOR=#c8c8c8][B]AWAY[/B][/COLOR]',
                indent: 1,
                conditions: [
                    {
                        field: 'template',
                        value: 1
                    },
                    {
                        field: 'away',
                        value: 0
                    }
                ]
            },
            {
                name: 'phraseOffline',
                title: 'Offline-Phrase > Define what the phrase if a user is offline should look like!',
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
                name: 'spacer2',
                title: ''
            },
            {
                name: 'header2',
                title: '->>> Group Options <<<-'
            },
            {
                name: 'priority',
                title:
                    'The order in which you define the groups is important! The script will go from top to bottom and overwrite each group so the last group you defined has the highest priority. Should a user be a member of two groups, they will only be displayed in the last one.'
            },
            {
                name: 'staffGroups',
                title: 'Staff Groups List',
                type: 'array',
                vars: [
                    {
                        name: 'id',
                        title: 'ID > Define the ID of the staff group! (*)',
                        indent: 2,
                        type: 'string',
                        placeholder: '1337'
                    },
                    {
                        name: 'name',
                        title:
                            'Name > Define the name that should be shown for the group! If not set it will use the default group name.',
                        indent: 2,
                        type: 'multiline',
                        placeholder: '[COLOR=#aa007f][size=12][B]ADMIN[/B][/size][/COLOR]'
                    },
                    {
                        name: 'clients',
                        title:
                            'Clients > Define a list of additional clients IDs that should also count towards this staff group!',
                        indent: 2,
                        type: 'strings'
                    },
                    {
                        name: 'groups',
                        title:
                            'Groups > Define a list of additional group IDs that should also count towards this staff group!',
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
        let staffList = [];
        let groupList = [];

        const template = varDef(config.template, 1) == 0;
        const clickable = varDef(config.clickable, 0) == 0;
        const away = varDef(config.away, 1) == 0;
        let awayChannel, awayMute, awayDeaf;
        if (away) {
            awayChannel = varDef(config.awayChannel, 1) == 0;
            awayMute = varDef(config.awayMute, 1) == 0;
            awayDeaf = varDef(config.awayDeaf, 1) == 0;
        } else {
            awayChannel = false;
            awayMute = false;
            awayDeaf = false;
        }
        let username, userLine, groupSection, separator, phraseOnline, phraseAway, phraseOffline;
        if (template) {
            username = varDef(config.tUsername, '[B]%name%[/B]');
            userLine = varDef(config.tMemberLine, '%name% [COLOR=#aaff00]>[/COLOR] %status%');
            groupSection = varDef(config.tGroupSection, '[center]%group%\n%users%____________________[/center]');
            phraseOnline = varDef(config.tPhraseOnline, '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]');
            phraseAway = varDef(config.tPhraseAway, '[COLOR=#c8c8c8][B]AWAY[/B][/COLOR]');
            phraseOffline = varDef(config.tPhraseOffline, '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]');
        } else {
            separator = varDef(config.separator, '_______________________________________');
            phraseOnline = varDef(config.phraseOnline, '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]');
            phraseAway = varDef(config.phraseAway, '[COLOR=#c8c8c8][B]AWAY[/B][/COLOR]');
            phraseOffline = varDef(config.phraseOffline, '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]');
        }

        // FUNCTIONS
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
            let membersAway = [];
            let membersOffline = [];
            memberList.forEach(member => {
                const memberUid = member[0];
                const client = backend.getClientByUID(memberUid);
                if (client !== undefined) {
                    if (config.template) {
                        if (config.tAway == 0) {
                            let away = false;
                            if (client.isAway()) away = true;
                            if (config.tAwayMute == 0 && client.isMuted()) away = true;
                            if (config.tAwayDeaf == 0 && client.isDeaf()) away = true;
                            if (away) {
                                membersAway.push(member);
                            } else {
                                membersOnline.push(member);
                            }
                        } else {
                            membersOnline.push(member);
                        }
                    } else {
                        if (config.away == 0) {
                            let away = false;
                            if (client.isAway()) away = true;
                            if (config.awayMute == 0 && client.isMuted()) away = true;
                            if (config.awayDeaf == 0 && client.isDeaf()) away = true;
                            if (away) {
                                membersAway.push(member);
                            } else {
                                membersOnline.push(member);
                            }
                        } else {
                            membersOnline.push(member);
                        }
                    }
                } else {
                    membersOffline.push(member);
                }
            });
            membersOnline.sort((a, b) => {
                if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
                if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
                return 0;
            });
            membersAway.sort((a, b) => {
                if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
                if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
                return 0;
            });
            membersOffline.sort((a, b) => {
                if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
                if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
                return 0;
            });

            return [ membersOnline, membersAway, membersOffline ];
        }

        function updateDescription(staffGroups, channel) {
            const template = config.template == 0;
            const clickable = config.clickable == 0;
            let username, memberLine, groupSection, separator, phraseOnline, phraseAway, phraseOffline;

            if (config.template == 0) {
                username = config.tUsername || '[B]%name%[/B]';
                memberLine = config.tMemberLine || '%name% [COLOR=#aaff00]>[/COLOR] %status%';
                groupSection = config.tGroupSection || '[center]%group%\n%members%____________________[/center]';
                phraseOnline = config.tPhraseOnline || '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]';
                phraseAway = config.tPhraseAway || '[COLOR=#c8c8c8][B]ONLINE[/B][/COLOR]';
                phraseOffline = config.tPhraseOffline || '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]';
            } else {
                separator = config.separator || '_______________________________________';
                phraseOnline = config.phraseOnline || '[COLOR=#00ff00][B]ONLINE[/B][/COLOR]';
                phraseAway = config.phraseAway || '[COLOR=#c8c8c8][B]ONLINE[/B][/COLOR]';
                phraseOffline = config.phraseOffline || '[COLOR=#ff0000][B]OFFLINE[/B][/COLOR]';
            }

            const sortedMemberList = getSortedMemberList();
            const membersOnline = sortedMemberList[0];
            const membersAway = sortedMemberList[1];
            const membersOffline = sortedMemberList[2];
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
                if (config.away == 0 || config.taway == 0) {
                    membersAway.forEach(member => {
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
                                    .replace('%status%', phraseAway)
                                    .replace('%lb%', '\n');
                            } else {
                                memberToList = `${memberName} - ${phraseAway}`;
                            }

                            membersToList += `${memberToList}\n`;
                        }
                    });
                }
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

            event.on('clientAway', event => {
                if (config.away == 0 || config.taway == 0) {
                    const client = event.client;
                    if (client.isSelf()) return;
                    const group = getClientGroup(client, staffGroups);

                    if (group !== undefined) {
                        updateDescription(staffGroups, channel);
                    }
                }
            });

            event.on('clientBack', event => {
                if (config.away == 0 || config.taway == 0) {
                    const client = event.client;
                    if (client.isSelf()) return;
                    const group = getClientGroup(client, staffGroups);

                    if (group !== undefined) {
                        updateDescription(staffGroups, channel);
                    }
                }
            });

            event.on('clientMute', event => {
                if (config.awayMute == 0 || config.tawayMute == 0) {
                    const client = event.client;
                    if (client.isSelf()) return;
                    const group = getClientGroup(client, staffGroups);

                    if (group !== undefined) {
                        updateDescription(staffGroups, channel);
                    }
                }
            });

            event.on('clientUnmute', event => {
                if (config.awayMute == 0 || config.tawayMute == 0) {
                    const client = event.client;
                    if (client.isSelf()) return;
                    const group = getClientGroup(client, staffGroups);

                    if (group !== undefined) {
                        updateDescription(staffGroups, channel);
                    }
                }
            });

            event.on('clientDeaf', event => {
                if (config.awayDeaf == 0 || config.tawayDeaf == 0) {
                    const client = event.client;
                    if (client.isSelf()) return;
                    const group = getClientGroup(client, staffGroups);

                    if (group !== undefined) {
                        updateDescription(staffGroups, channel);
                    }
                }
            });

            event.on('clientUndeaf', event => {
                if (config.awayDeaf == 0 || config.tawayDeaf == 0) {
                    const client = event.client;
                    if (client.isSelf()) return;
                    const group = getClientGroup(client, staffGroups);

                    if (group !== undefined) {
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
