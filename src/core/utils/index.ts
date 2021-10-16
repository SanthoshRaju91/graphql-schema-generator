import { dereference } from "json-schema-ref-parser";
import { SchemaInput, PrimitiveTypes } from "../types";

export const dereferenceSchema = (schema: SchemaInput) => {
    return dereference(schema);
};

export const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export const getType = (data: any) => {
    if (Array.isArray(data)) {
        return "array";
    }
    return typeof data;
};

export const getPrimitiveTypes = (type: string) => {
    const primitiveGraphQLType = PrimitiveTypes[type];
    if (!primitiveGraphQLType) {
        throw new Error(`Type not supported ${type}`);
    }
    return primitiveGraphQLType;
};
