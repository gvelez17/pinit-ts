import {
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, PermissionString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { addTodo } from '../../use-composites/add_todo.js'
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';


export class TodoCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getCom('chatCommands.todo'),
        description: Lang.getRef('commandDescs.todo', Lang.Default),
        dm_permission: true,
        default_member_permissions: undefined,
    };
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        addTodo('what', 'who')
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.todo', data.lang()));
    }
}
