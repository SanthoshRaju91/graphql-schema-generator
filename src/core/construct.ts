import lodash from "lodash";
import {
    Schema,
    GraphQLList,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInputObjectType
} from "./types";
import { getType, capitalize, getPrimitiveTypes } from "./utils";

const schemaTypeToGraphQL = (title: string, schema: any, schemaName: string, gqlTypes: any) => {
    const baseType = (() => {
        const schemaType = getType(schema);
        if (schemaType === "object" || schemaType === "array") {
            return createGraphQLObject(schema, `${title}_${capitalize(schemaName)}`, gqlTypes);
        } else if (getPrimitiveTypes(schemaType)) {
            return getPrimitiveTypes(schemaType);
        }
        throw new Error(
            `Don't know how to handle schema 
            ${JSON.stringify(schemaType)}  
            without type and schema    
            `
        );
    })();
    return baseType;
};

const getFieldType = (schema: any, title: string, gqlTypes: any) => {
    if (!Object.keys(schema || {}).length) {
        return {
            empty: {
                type: GraphQLString
            }
        };
    }
    return lodash.mapValues(schema, (propertySchema, propertyName) => {
        const type = schemaTypeToGraphQL(title, propertySchema, propertyName, gqlTypes);
        return {
            type
        };
    });
};

const createGraphQLObject = (data: any, title: string, gqlTypes: any) => {
    let dataType = getType(data);
    if (!data) {
        dataType = "object";
    }
    if (dataType === "array") {
        if (data && data[0]) {
            return new GraphQLList(createGraphQLObject(data[0], title, gqlTypes));
        }
    } else if (dataType === "object") {
        const fields = getFieldType(data, title, gqlTypes);
        const result = new GraphQLObjectType({
            name: title,
            fields
        });
        gqlTypes[title] = result;
        return result;
    } else {
        return getPrimitiveTypes(dataType);
    }
};

const createInputGraphQLObject = (data: string, title: string, gqlTypes: any) => {
    let dataType = getType(data);
    if (!data) {
        dataType = "object";
    }
    if (dataType === "array") {
        return new GraphQLList(createInputGraphQLObject(data[0], title, gqlTypes));
    } else if (dataType === "object") {
        const fields = getFieldType(data, title, gqlTypes);
        const result = new GraphQLInputObjectType({
            name: title,
            fields
        });
        gqlTypes[title] = result;
        return result;
    } else {
        return getPrimitiveTypes(dataType);
    }
};

const mapParametersToFields = (parameters: any, title: string, gqlTypes: any) => {
    const paramMaps = Object.keys(parameters).reduce((result, param) => {
        const type: any = createInputGraphQLObject(
            parameters[param].value,
            `param_${param}_${title}`,
            gqlTypes
        );
        result[param] = {
            type: parameters[param]["required"] ? new GraphQLNonNull(type) : type
        };
        return result;
    }, {});
    return paramMaps;
};

export const constructQueryFields = (schema: Schema, gqlTypes: any) => {
    const definitions = Object.keys(schema.definitions);
    return definitions.reduce((query: object, defintion: string) => {
        const { request, response } = schema.definitions[defintion];
        const type = createGraphQLObject(response, capitalize(defintion), gqlTypes);
        const fields = {
            type,
            args: lodash.isEmpty(request.parameters)
                ? {}
                : mapParametersToFields(request.parameters, defintion, gqlTypes),
            resolve: () => {}
        };
        query[defintion] = fields;
        return query;
    }, {});
};

export const constructMutationFields = (schema: Schema, gqlTypes: any) => {
    return {};
};
