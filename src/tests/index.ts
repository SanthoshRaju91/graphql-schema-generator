import express from "express";
import graphqlHTTP from 'express-graphql';
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

const app = express();
app.use("/graphql", graphqlHTTP(async (request, response, graphQLParams) => ({
    schema: await buildSchema(schema),
    graphiql: true
})));
app.listen(4000, (err) => {
    if(err) 
        console.error(err);
    console.log("Server is running on port 4000");
})

// buildSchema(schema)
//     .then(builtSchema => {
//         const app = express();
//         app.use("/graphql", graphqlHTTP(async (request, response, graphQLParams) => ({
//             schema: builtSchema,
//             graphiql: true
//         })))
//         app.listen(4000, (err) => {
//             if(err) 
//                 console.error(err);
//             console.log("Server is running on port 4000")
//         });
//     });
// import { GraphQLServer } from "graphql-yoga";
// import buildSchema from "../core";



// buildSchema(schema)
//     .then(builtSchema => {
//         const server = new GraphQLServer({
//             schema: builtSchema
//         });
//         server.start(() => console.log(`Server is running on port 4000`));
//     })
//     .catch(err => console.error(err));
