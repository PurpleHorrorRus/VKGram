import { CacheProfileType } from "~/types/Messages/CacheProfileType";
import { MessageType } from "~/types/Messages/MessageType";

export type CacheObjectType = {
    conversation: CacheProfileType
    profiles: Array<CacheProfileType>
    messages: Array<MessageType>
    draft: string | ""
};