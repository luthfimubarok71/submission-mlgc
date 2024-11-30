const predictClassification = require("../services/inferenceServices");
const crypto = require("crypto");
const InputError = require('../exceptions/InputError');
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const { result, scoreResult, suggestion} = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    if (!result || typeof scoreResult !== 'number') {
      throw new Error("Invalid result or score");      
    }

    const data = {
      id: id,
      result: result,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: "success",
      message: 'Model is predicted successfully',
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi"
    });
    response.code(400);
    return response;
  }
}

module.exports = postPredictHandler;
