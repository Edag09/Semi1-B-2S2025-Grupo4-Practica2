const uploadsService = require('../services/upload.service');

const uploadFile = async (req, res, next) => {
  try {
    // 👇 logs para depuración
    console.log("📩 [UPLOAD CONTROLLER] Petición recibida en /upload/foto");
    console.log("🟢 Método:", req.method);
    console.log("🟢 Content-Type:", req.headers["content-type"]);
    console.log("🟢 Body keys:", Object.keys(req.body || {}));
    console.log("🟢 File:", req.file);

    if (!req.file) {
      console.warn("⚠️ No se recibió ningún archivo en req.file");
      return res.status(400).json({ error: 'No file provided' });
    }

    const { buffer, originalname, mimetype } = req.file;

    console.log("✅ Archivo recibido correctamente:");
    console.log("   - Nombre:", originalname);
    console.log("   - Tipo MIME:", mimetype);
    console.log("   - Tamaño:", buffer.length, "bytes");

    const result = await uploadsService.uploadBuffer(buffer, originalname, mimetype);

    console.log("✅ Archivo subido correctamente a Azure:", result.url);

    res.status(201).json({ success: true, data: { url: result.url, blobName: result.blobName } });
  } catch (error) {
    console.error("❌ Error en uploadFile:", error);
    next(error);
  }
};

module.exports = {
  uploadFile
};
