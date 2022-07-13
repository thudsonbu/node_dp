const crypto = require('node:crypto');

/**
 * Create a valid document string for storage in db
 *
 * @param {string} opts.data - data of document to be created
 * @param {string} opts.dataDelimiter - data delimiter in db
 * @param {string} opts.documentDelimiter - document delimiter in db
 * @param {string} [opts.id] - id of document

 *
 * @typedef {Object} CreateDocumentStringResult
 * @property {string} documentString- document valid document string
 * @property {string} id - id in documentString
 * @property {string} data - data in documentString
 *
 * @returns {CreateDocumentStringResult}
 */
function createDocumentString( opts ) {
  const documentId = !!opts.id ? opts.id : crypto.randomUUID();

  return {
    documentString: `${ documentId }${ opts.dataDelimiter }` +
      `${ opts.data }${ opts.documentDelimiter }`,
    id: documentId,
    data: opts.data
  };
}

module.exports = createDocumentString;
