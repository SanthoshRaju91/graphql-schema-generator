import { SchemaInput, Schema, GraphQLObjectType, RootGraphQLSchema, GraphQLSchema } from "./types";
import { dereferenceSchema } from "./utils";
import { constructQueryFields, constructMutationFields } from "./construct";

export const buildGraphQLSchema = (schema: Schema) => {
    const gqlTypes = {};
    const queryFields = constructQueryFields(schema, gqlTypes);
    const query = new GraphQLObjectType({
        name: "Query",
        fields: queryFields
    });
    const mutationFields = constructMutationFields(schema, gqlTypes);
    const mutation = new GraphQLObjectType({
        name: "Mutation",
        fields: mutationFields
    });
    const graphqlSchema: RootGraphQLSchema = {
        query
    };
    return new GraphQLSchema(graphqlSchema);
};

export default async function build(schemaInput: SchemaInput) {
    try {
        const derefSchema = await dereferenceSchema(schemaInput);
        const schema = buildGraphQLSchema(derefSchema);
        return schema;
    } catch (err) {
        console.error(err);
    }
}
