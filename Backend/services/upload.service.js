const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const accountName = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER || 'recipebox-uploads';

if (!accountName || !accountKey) {
  console.warn('Azure Storage credentials are not fully configured in .env');
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`);

/**
 * Upload a buffer (file) to Azure Blob Storage and return an URL with SAS token
 * @param {Buffer} buffer
 * @param {string} originalName
 * @param {string} mimeType
 * @returns {Promise<{url: string, blobName: string}>}
 */
const uploadBuffer = async (buffer, originalName, mimeType) => {
  if (!blobServiceClient) throw new Error('BlobServiceClient not configured');

  const containerClient = blobServiceClient.getContainerClient(containerName);
  // Ensure container exists
  try {
    await containerClient.createIfNotExists();
  } catch (err) {
    // ignore
  }

  const ext = path.extname(originalName) || '';
  const blobName = `${uuidv4()}${ext}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimeType }
  });

  // Generate a SAS token for the blob (valid 24 hours)
  const { generateBlobSASQueryParameters: genSAS, BlobSASPermissions: Permissions } = require('@azure/storage-blob');

  const expiresOn = new Date(new Date().valueOf() + 24 * 60 * 60 * 1000); // 24 hours

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'),
      expiresOn
    },
    sharedKeyCredential
  ).toString();

  const url = `${blockBlobClient.url}?${sasToken}`;

  return { url, blobName };
};

module.exports = {
  uploadBuffer
};