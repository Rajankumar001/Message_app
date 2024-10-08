import { resolve, getValidator, querySyntax,virtual } from '@feathersjs/schema';
import { ObjectIdSchema } from '@feathersjs/schema';
import { dataValidator, queryValidator } from '../../validators.js';
import { userDataSchema } from '../users/users.schema.js';

// Main data model schema
export const messageSchema = {
  $id: 'Message',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'text'],
  properties: {
    _id: ObjectIdSchema(),
    text: { type: 'string' },
    createdAt: { type: 'number' },
    userId: {
      type: 'string' // Treating ObjectId as a string
    },
    user: {
      type: 'object',        // Set the type as object
      properties: userDataSchema.properties, // Reference properties from userDataSchema
      additionalProperties: false
    }
  }
};

export const messageValidator = getValidator(messageSchema, dataValidator);
export const messageResolver = resolve({});

export const messageExternalResolver = resolve({
  user: virtual(async (message, context) => {
    return context.app.service('users').get(message.userId)
  })
  
});

export const messageDataSchema = {
  $id: 'MessageData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...messageSchema.properties
  }
};

export const messageDataValidator = getValidator(messageDataSchema, dataValidator);
export const messageDataResolver = resolve({
  userId: async (_value, _message, context) => {
    // Associate the record with the id of the authenticated user
    return context?.params?.user?._id;
  },
  createdAt: async () => Date.now()
});

// Schema for updating existing data
export const messagePatchSchema = {
  $id: 'MessagePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...messageSchema.properties
  }
};

export const messagePatchValidator = getValidator(messagePatchSchema, dataValidator);
export const messagePatchResolver = resolve({});

// Schema for allowed query properties
export const messageQuerySchema = {
  $id: 'MessageQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(messageSchema.properties)
  }
};

export const messageQueryValidator = getValidator(messageQuerySchema, queryValidator);
export const messageQueryResolver = resolve({});
