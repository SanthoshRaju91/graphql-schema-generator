import { GraphQLServer } from "graphql-yoga";
import buildSchema from "../core";

const schema = {
    definitions: {
        posts: {
            request: {
                $ref: `src/tests/schemas/posts/request.json`
            },
            response: {
                $ref: `src/tests/schemas/posts/response.json`
            }
        }
    }
};

buildSchema(schema)
    .then(builtSchema => {
        const server = new GraphQLServer({
            schema: builtSchema
        });

        server.start(() => console.log(`Server is running on port 4000`));
    })
    .catch(err => console.error(err));
