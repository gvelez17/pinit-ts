import {
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, PermissionString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { retrieveTodos } from '../../use-composites/list_todo.js'
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';


export class TodosCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getCom('chatCommands.todos'),
        description: Lang.getRef('commandDescs.todos', Lang.Default),
        dm_permission: true,
        default_member_permissions: undefined,
    };
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let tasks = await retrieveTodos()
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.todos', data.lang()));
        for (let todo of tasks) {
            if (! todo.completed) {
                let msg = `*${todo.content}* assigned to @${todo.assignee} `
                await InteractionUtils.send(intr, msg)
            }
        }

    }
}
