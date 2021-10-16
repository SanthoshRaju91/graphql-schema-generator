import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLInputField,
    GraphQLString,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from "graphql";

export interface SchemaInput {
    definitions: {
        [key: string]: {
            request: {
                $ref: string;
            };
            response: {
                $ref: string;
            };
        };
    };
}

export interface Schema {
    definitions: {
        [key: string]: {
            request: {
                name: string;
                url: string;
                method: "GET" | "POST" | "UPDATE" | "DELETE";
                parameters: any;
            };
            response: any;
        };
    };
}

export interface RootGraphQLSchema {
    query: GraphQLObjectType;
    mutation?: GraphQLObjectType;
}

export const PrimitiveTypes = {
    object: GraphQLObjectType,
    string: GraphQLString,
    boolean: GraphQLBoolean,
    integer: GraphQLInt,
    number: GraphQLFloat
};

export {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLInputField
};
