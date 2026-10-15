const { TypeScriptSerializer } = require('kysely-codegen');

const GENERATED_INTERFACE = /^export interface DB \{$/m;
const RENAMED_INTERFACE = 'export interface DatabaseTables {';

const typeScriptSerializer = new TypeScriptSerializer();

module.exports = {
  serializer: {
    serializeFile: (metadata, dialect, options) =>
      typeScriptSerializer
        .serializeFile(metadata, dialect, options)
        .replace(GENERATED_INTERFACE, RENAMED_INTERFACE),
  },
};
