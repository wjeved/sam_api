import { ApolloServer } from 'apollo-server';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

// ApolloServer는 스키마와 리졸버가 반드시 필요함
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// listen 함수로 웹 서버 실행
server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
