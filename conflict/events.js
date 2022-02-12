let client;
let events = {};

// Discord events

export function onApiRequest (fn) {
    client.on('apiRequest', fn);
}
events.onApiRequest = onApiRequest;

export function onApiResponse (fn) {
    client.on('apiResponse', fn);
}
events.onApiResponse = onApiResponse;

export function onChannelCreate (fn) {
    client.on('channelCreate', fn);
}
events.onChannelCreate = onChannelCreate;

export function onChannelDelete (fn) {
    client.on('channelDelete', fn);
}
events.onChannelDelete = onChannelDelete;

export function onChannelPinsUpdate (fn) {
    client.on('channelPinsUpdate', fn);
}
events.onChannelPinsUpdate = onChannelPinsUpdate;

export function onChannelUpdate (fn) {
    client.on('channelUpdate', fn);
}
events.onChannelUpdate = onChannelUpdate;

export function onDebug (fn) {
    client.on('debug', fn);
}
events.onDebug = onDebug;

export function onEmojiCreate (fn) {
    client.on('emojiCreate', fn);
}
events.onEmojiCreate = onEmojiCreate;

export function onEmojiDelete (fn) {
    client.on('emojiDelete', fn);
}
events.onEmojiDelete = onEmojiDelete;

export function onEmojiUpdate (fn) {
    client.on('emojiUpdate', fn);
}
events.onEmojiUpdate = onEmojiUpdate;

export function onError (fn) {
    client.on('error', fn);
}
events.onError = onError;

export function onGuildBanAdd (fn) {
    client.on('guildBanAdd', fn);
}
events.onGuildBanAdd = onGuildBanAdd;

export function onGuildBanRemove (fn) {
    client.on('guildBanRemove', fn);
}
events.onGuildBanRemove = onGuildBanRemove;

export function onGuildCreate (fn) {
    client.on('guildCreate', fn);
}
events.onGuildCreate = onGuildCreate;

export function onGuildDelete (fn) {
    client.on('guildDelete', fn);
}
events.onGuildDelete = onGuildDelete;

export function onGuildIntegrationsUpdate (fn) {
    client.on('guildIntegrationsUpdate', fn);
}
events.onGuildIntegrationsUpdate = onGuildIntegrationsUpdate;

export function onGuildMemberAdd (fn) {
    client.on('guildMemberAdd', fn);
}
events.onGuildMemberAdd = onGuildMemberAdd;

export function onGuildMemberAvailable (fn) {
    client.on('guildMemberAvailable', fn);
}
events.onGuildMemberAvailable = onGuildMemberAvailable;

export function onGuildMemberRemove (fn) {
    client.on('guildMemberRemove', fn);
}
events.onGuildMemberRemove = onGuildMemberRemove;

export function onGuildMembersChunk (fn) {
    client.on('guildMembersChunk', fn);
}
events.onGuildMembersChunk = onGuildMembersChunk;

export function onGuildMemberUpdate (fn) {
    client.on('guildMemberUpdate', fn);
}
events.onGuildMemberUpdate = onGuildMemberUpdate;

export function onGuildScheduledEventCreate (fn) {
    client.on('guildScheduledEventCreate', fn);
}
events.onGuildScheduledEventCreate = onGuildScheduledEventCreate;

export function onGuildScheduledEventDelete (fn) {
    client.on('guildScheduledEventDelete', fn);
}
events.onGuildScheduledEventDelete = onGuildScheduledEventDelete;

export function onGuildScheduledEventUpdate (fn) {
    client.on('guildScheduledEventUpdate', fn);
}
events.onGuildScheduledEventUpdate = onGuildScheduledEventUpdate;

export function onGuildScheduledEventUserAdd (fn) {
    client.on('guildScheduledEventUserAdd', fn);
}
events.onGuildScheduledEventUserAdd = onGuildScheduledEventUserAdd;

export function onGuildScheduledEventUserRemove (fn) {
    client.on('guildScheduledEventUserRemove', fn);
}
events.onGuildScheduledEventUserRemove = onGuildScheduledEventUserRemove;

export function onGuildUnavailable (fn) {
    client.on('guildUnavailable', fn);
}
events.onGuildUnavailable = onGuildUnavailable;

export function onGuildUpdate (fn) {
    client.on('guildUpdate', fn);
}
events.onGuildUpdate = onGuildUpdate;

export function onInteractionCreate (fn) {
    client.on('interactionCreate', fn);
}
events.onInteractionCreate = onInteractionCreate;

export function onInvalidated (fn) {
    client.on('invalidated', fn);
}
events.onInvalidated = onInvalidated;

export function onInvalidRequestWarning (fn) {
    client.on('invalidRequestWarning', fn);
}
events.onInvalidRequestWarning = onInvalidRequestWarning;

export function onInviteCreate (fn) {
    client.on('inviteCreate', fn);
}
events.onInviteCreate = onInviteCreate;

export function onInviteDelete (fn) {
    client.on('inviteDelete', fn);
}
events.onInviteDelete = onInviteDelete;

export function onMessageCreate (fn) {
    client.on('messageCreate', fn);
}
events.onMessageCreate = onMessageCreate;

export function onMessageDelete (fn) {
    client.on('messageDelete', fn);
}
events.onMessageDelete = onMessageDelete;

export function onMessageDeleteBulk (fn) {
    client.on('messageDeleteBulk', fn);
}
events.onMessageDeleteBulk = onMessageDeleteBulk;

export function onMessageReactionAdd (fn) {
    client.on('messageReactionAdd', fn);
}
events.onMessageReactionAdd = onMessageReactionAdd;

export function onMessageReactionRemove (fn) {
    client.on('messageReactionRemove', fn);
}
events.onMessageReactionRemove = onMessageReactionRemove;

export function onMessageReactionRemoveAll (fn) {
    client.on('messageReactionRemoveAll', fn);
}
events.onMessageReactionRemoveAll = onMessageReactionRemoveAll;

export function onMessageReactionRemoveEmoji (fn) {
    client.on('messageReactionRemoveEmoji', fn);
}
events.onMessageReactionRemoveEmoji = onMessageReactionRemoveEmoji;

export function onMessageUpdate (fn) {
    client.on('messageUpdate', fn);
}
events.onMessageUpdate = onMessageUpdate;

export function onPresenceUpdate (fn) {
    client.on('presenceUpdate', fn);
}
events.onPresenceUpdate = onPresenceUpdate;

export function onRateLimit (fn) {
    client.on('rateLimit', fn);
}
events.onRateLimit = onRateLimit;

export function onReady (fn) {
    client.on('ready', fn);
}
events.onReady = onReady;

export function onRoleCreate (fn) {
    client.on('roleCreate', fn);
}
events.onRoleCreate = onRoleCreate;

export function onRoleDelete (fn) {
    client.on('roleDelete', fn);
}
events.onRoleDelete = onRoleDelete;

export function onRoleUpdate (fn) {
    client.on('roleUpdate', fn);
}
events.onRoleUpdate = onRoleUpdate;

export function onShardDisconnect (fn) {
    client.on('shardDisconnect', fn);
}
events.onShardDisconnect = onShardDisconnect;

export function onShardError (fn) {
    client.on('shardError', fn);
}
events.onShardError = onShardError;

export function onShardReady (fn) {
    client.on('shardReady', fn);
}
events.onShardReady = onShardReady;

export function onShardReconnecting (fn) {
    client.on('shardReconnecting', fn);
}
events.onShardReconnecting = onShardReconnecting;

export function onShardResume (fn) {
    client.on('shardResume', fn);
}
events.onShardResume = onShardResume;

export function onStageInstanceCreate (fn) {
    client.on('stageInstanceCreate', fn);
}
events.onStageInstanceCreate = onStageInstanceCreate;

export function onStageInstanceDelete (fn) {
    client.on('stageInstanceDelete', fn);
}
events.onStageInstanceDelete = onStageInstanceDelete;

export function onStageInstanceUpdate (fn) {
    client.on('stageInstanceUpdate', fn);
}
events.onStageInstanceUpdate = onStageInstanceUpdate;

export function onStickerCreate (fn) {
    client.on('stickerCreate', fn);
}
events.onStickerCreate = onStickerCreate;

export function onStickerDelete (fn) {
    client.on('stickerDelete', fn);
}
events.onStickerDelete = onStickerDelete;

export function onStickerUpdate (fn) {
    client.on('stickerUpdate', fn);
}
events.onStickerUpdate = onStickerUpdate;

export function onThreadCreate (fn) {
    client.on('threadCreate', fn);
}
events.onThreadCreate = onThreadCreate;

export function onThreadDelete (fn) {
    client.on('threadDelete', fn);
}
events.onThreadDelete = onThreadDelete;

export function onThreadListSync (fn) {
    client.on('threadListSync', fn);
}
events.onThreadListSync = onThreadListSync;

export function onThreadMembersUpdate (fn) {
    client.on('threadMembersUpdate', fn);
}
events.onThreadMembersUpdate = onThreadMembersUpdate;

export function onThreadMemberUpdate (fn) {
    client.on('threadMemberUpdate', fn);
}
events.onThreadMemberUpdate = onThreadMemberUpdate;

export function onThreadUpdate (fn) {
    client.on('threadUpdate', fn);
}
events.onThreadUpdate = onThreadUpdate;

export function onTypingStart (fn) {
    client.on('typingStart', fn);
}
events.onTypingStart = onTypingStart;

export function onUserUpdate (fn) {
    client.on('userUpdate', fn);
}
events.onUserUpdate = onUserUpdate;

export function onVoiceStateUpdate (fn) {
    client.on('voiceStateUpdate', fn);
}
events.onVoiceStateUpdate = onVoiceStateUpdate;

export function onWarn (fn) {
    client.on('warn', fn);
}
events.onWarn = onWarn;

export function onWebhookUpdate (fn) {
    client.on('webhookUpdate', fn);
}
events.onWebhookUpdate = onWebhookUpdate;

export function on (event, fn) {
    client.on(event, fn);
}
events.on = on;

export function emit (event, ...args) {
    client.emit(event, ...args);
}
events.on = emit;

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
events.onInterval = onInterval;

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
events.onLoop = onLoop;

// Configuration

export function _setClient (newClient) {
    client = newClient;
}
events._setClient = _setClient;

export default events;