import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { Message, MessageContextMenuInteraction, PermissionString,
//         ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';

import { addTag } from '../../use-composites/add_tag.js'
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class AddTag implements Command {
    public metadata: RESTPostAPIContextMenuApplicationCommandsJSONBody = {
        type: ApplicationCommandType.Message,
        name: Lang.getCom('messageCommands.addTag'),
        default_member_permissions: undefined,
        dm_permission: true,
    };
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];

    public async execute(intr: MessageContextMenuInteraction, data: EventData): Promise<void> {
        const msg = intr.options.data[0].message
        const what = msg.content
        const curator = null; // current logged in user, not author
        const who = `${msg.author.username}#${msg.author.discriminator}` 

        await InteractionUtils.send(intr, "Your tag: ")

        const tag = await intr.channel.awaitMessages({filter: (m) => m.author.id === intr.user.id,
            max: 1,
            time: 300000,
            errors: ['time']}
        )
            .then(g_the_tag => {
                console.log("GOT A TAG: " + JSON.stringify(g_the_tag))
                console.log(g_the_tag.first().content)
                return g_the_tag.first().content
            })
        console.log("TAG IS " + tag)
        const res = await addTag(what, tag, curator)
        console.log(JSON.stringify("Added tag " + tag))
        await InteractionUtils.send(
            intr,
            Lang.getEmbed('displayEmbeds.addTag', data.lang(), {
            })
        );
    }
}
