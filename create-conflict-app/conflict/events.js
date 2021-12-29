let client;

// Discord events

export function onApiRequest (fn) {
    client.on('apiRequest', fn);
}

export function onApiResponse (fn) {
    client.on('apiResponse', fn);
}

export function onChannelCreate (fn) {
    client.on('channelCreate', fn);
}

export function onChannelDelete (fn) {
    client.on('channelDelete', fn);
}

export function onChannelPinsUpdate (fn) {
    client.on('channelPinsUpdate', fn);
}

export function onChannelUpdate (fn) {
    client.on('channelUpdate', fn);
}

export function onDebug (fn) {
    client.on('debug', fn);
}

export function onEmojiCreate (fn) {
    client.on('emojiCreate', fn);
}

export function onEmojiDelete (fn) {
    client.on('emojiDelete', fn);
}

export function onEmojiUpdate (fn) {
    client.on('emojiUpdate', fn);
}

export function onError (fn) {
    client.on('error', fn);
}

export function onGuildBanAdd (fn) {
    client.on('guildBanAdd', fn);
}

export function onGuildBanRemove (fn) {
    client.on('guildBanRemove', fn);
}

export function onGuildCreate (fn) {
    client.on('guildCreate', fn);
}

export function onGuildDelete (fn) {
    client.on('guildDelete', fn);
}

export function onGuildIntegrationsUpdate (fn) {
    client.on('guildIntegrationsUpdate', fn);
}

export function onGuildMemberAdd (fn) {
    client.on('guildMemberAdd', fn);
}

export function onGuildMemberAvailable (fn) {
    client.on('guildMemberAvailable', fn);
}

export function onGuildMemberRemove (fn) {
    client.on('guildMemberRemove', fn);
}

export function onGuildMembersChunk (fn) {
    client.on('guildMembersChunk', fn);
}

export function onGuildMemberUpdate (fn) {
    client.on('guildMemberUpdate', fn);
}

export function onGuildScheduledEventCreate (fn) {
    client.on('guildScheduledEventCreate', fn);
}

export function onGuildScheduledEventDelete (fn) {
    client.on('guildScheduledEventDelete', fn);
}

export function onGuildScheduledEventUpdate (fn) {
    client.on('guildScheduledEventUpdate', fn);
}

export function onGuildScheduledEventUserAdd (fn) {
    client.on('guildScheduledEventUserAdd', fn);
}

export function onGuildScheduledEventUserRemove (fn) {
    client.on('guildScheduledEventUserRemove', fn);
}

export function onGuildUnavailable (fn) {
    client.on('guildUnavailable', fn);
}

export function onGuildUpdate (fn) {
    client.on('guildUpdate', fn);
}

export function onInteractionCreate (fn) {
    client.on('interactionCreate', fn);
}

export function onInvalidated (fn) {
    client.on('invalidated', fn);
}

export function onInvalidRequestWarning (fn) {
    client.on('invalidRequestWarning', fn);
}

export function onInviteCreate (fn) {
    client.on('inviteCreate', fn);
}

export function onInviteDelete (fn) {
    client.on('inviteDelete', fn);
}

export function onMessageCreate (fn) {
    client.on('messageCreate', fn);
}

export function onMessageDelete (fn) {
    client.on('messageDelete', fn);
}

export function onMessageDeleteBulk (fn) {
    client.on('messageDeleteBulk', fn);
}

export function onMessageReactionAdd (fn) {
    client.on('messageReactionAdd', fn);
}

export function onMessageReactionRemove (fn) {
    client.on('messageReactionRemove', fn);
}

export function onMessageReactionRemoveAll (fn) {
    client.on('messageReactionRemoveAll', fn);
}

export function onMessageReactionRemoveEmoji (fn) {
    client.on('messageReactionRemoveEmoji', fn);
}

export function onMessageUpdate (fn) {
    client.on('messageUpdate', fn);
}

export function onPresenceUpdate (fn) {
    client.on('presenceUpdate', fn);
}

export function onRateLimit (fn) {
    client.on('rateLimit', fn);
}

export function onReady (fn) {
    client.on('ready', fn);
}

export function onRoleCreate (fn) {
    client.on('roleCreate', fn);
}

export function onRoleDelete (fn) {
    client.on('roleDelete', fn);
}

export function onRoleUpdate (fn) {
    client.on('roleUpdate', fn);
}

export function onShardDisconnect (fn) {
    client.on('shardDisconnect', fn);
}

export function onShardError (fn) {
    client.on('shardError', fn);
}

export function onShardReady (fn) {
    client.on('shardReady', fn);
}

export function onShardReconnecting (fn) {
    client.on('shardReconnecting', fn);
}

export function onShardResume (fn) {
    client.on('shardResume', fn);
}

export function onStageInstanceCreate (fn) {
    client.on('stageInstanceCreate', fn);
}

export function onStageInstanceDelete (fn) {
    client.on('stageInstanceDelete', fn);
}

export function onStageInstanceUpdate (fn) {
    client.on('stageInstanceUpdate', fn);
}

export function onStickerCreate (fn) {
    client.on('stickerCreate', fn);
}

export function onStickerDelete (fn) {
    client.on('stickerDelete', fn);
}

export function onStickerUpdate (fn) {
    client.on('stickerUpdate', fn);
}

export function onThreadCreate (fn) {
    client.on('threadCreate', fn);
}

export function onThreadDelete (fn) {
    client.on('threadDelete', fn);
}

export function onThreadListSync (fn) {
    client.on('threadListSync', fn);
}

export function onThreadMembersUpdate (fn) {
    client.on('threadMembersUpdate', fn);
}

export function onThreadMemberUpdate (fn) {
    client.on('threadMemberUpdate', fn);
}

export function onThreadUpdate (fn) {
    client.on('threadUpdate', fn);
}

export function onTypingStart (fn) {
    client.on('typingStart', fn);
}

export function onUserUpdate (fn) {
    client.on('userUpdate', fn);
}

export function onVoiceStateUpdate (fn) {
    client.on('voiceStateUpdate', fn);
}

export function onWarn (fn) {
    client.on('warn', fn);
}

export function onWebhookUpdate (fn) {
    client.on('webhookUpdate', fn);
}

export function on (event, fn) {
    client.on(event, fn);
}

// Time-based events

export function onInterval (interval, code, startRightAway) {
    let counter = startRightAway ? 1 : 0;
    if (startRightAway) code(0);
    let id = setInterval(_ => {
        code(counter);
        counter++;
    }, interval);
    return id;
}

export function onLoop (delay, code) {
    let counter = 0;
    let ended = false;
    (function loop () {
        setTimeout(async _ => {
            let output = code(counter);
            if (output instanceof Promise) await output;
            counter++;
            if (!ended) loop();
        }, delay)
    })();
    return _ => {
        ended = true;
    }
}

// Configuration

export function _setClient (newClient) {
    client = newClient;
}
