import State from 'conflict/state'

State.commands('/help') // access store for a command
State.users('ID') // access store for a user
State.guilds('ID') // access store for a guild
State.kv() // access the key/value store
