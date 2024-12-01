const predictClassification = require("../services/inferenceServices");
const crypto = require("crypto");
const InputError = require('../exceptions/InputError');
const { storeData, predictCollection } = require("../services/storeData");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const { result, scoreResult, suggestion} = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    if (!result || typeof scoreResult !== 'number') {
      throw new InputError("Invalid result or score");      
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

async function getPredictHistoryHandler(request, h) {
  try {
    const hystory = (await predictCollection.get()).docs.map((doc) => doc.data());
    const data = hystory.map((item) => ({
      id: item.id,
      history: item,
    }));
    console.log(data);
    
    
    const response = h.response({
      status: "success",
      data
    })
    response.code(200);
    return response;

  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam mengambil data history"
    })
    response.code(400);
    return response;
  }
}

module.exports = { getPredictHistoryHandler, postPredictHandler };
