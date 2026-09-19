import * as messagesModel from '../models/messages.model.js';

export const createMessageService = async (messageData) => {
    return await messagesModel.saveMessage(messageData);
};

export const getAllMessagesService = async () => {
    return await messagesModel.getAllMessages();
};

export const markMessageAsReadService = async (id) => {
    return await messagesModel.markMessageAsRead(id);
};

export const deleteMessageService = async (id) => {
    return await messagesModel.deleteMessage(id);
};