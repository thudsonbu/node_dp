/**
 * Create a valid document string for storage in db
 *
 * @param {string} data - data of document to be created
 * @param {string} [id] - id of document
 *
 * @typedef {Object} CreateDocumentStringResult
 * @property {string} documentString- document valid document string
 * @property {string} id - id in documentString
 * @property {string} data - data in documentString
 *
 * @returns {CreateDocumentStringResult}
 */
function createDocumentString( data, id ) {
  const documentId = !!id ? id : crypto.randomUUID();

  return {
    documentString: `${ documentId }${ this.dataDelimiter }${ data }${ this.documentDelimiter }`, // eslint-disable-line max-len
    id: documentId,
    data
  };
}

module.exports = createDocumentString;
