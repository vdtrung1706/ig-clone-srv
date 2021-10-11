import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import * as path from 'path';

const typeDefsArray = loadFilesSync(path.join(__dirname, './type-defs'));
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));

export const typeDefs = mergeTypeDefs(typeDefsArray);
export const resolvers = mergeResolvers(resolversArray);
