import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { Message, MessageContextMenuInteraction, PermissionString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';

import { addTodo } from '../../use-composites/add_todo.js'
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class MarkTodo implements Command {
    public metadata: RESTPostAPIContextMenuApplicationCommandsJSONBody = {
        type: ApplicationCommandType.Message,
        name: Lang.getCom('messageCommands.markTodo'),
        default_member_permissions: undefined,
        dm_permission: true,
    };
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];

    public async execute(intr: MessageContextMenuInteraction, data: EventData): Promise<void> {
        const msg = intr.options.data[0].message
        const what = msg.content
        const who = `${msg.author.username}#${msg.author.discriminator}` 
        const res = await addTodo(what, who)
        console.log(JSON.stringify(res))
        await InteractionUtils.send(
            intr,
            Lang.getEmbed('displayEmbeds.markTodo', data.lang(), {
                TODO_AT: "saved a todo task",
            })
        );
    }
}
