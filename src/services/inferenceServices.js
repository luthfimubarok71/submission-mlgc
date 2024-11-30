const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims(0)
        .toFloat()

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const scoreResult = Math.max(...score) * 100;
    const result = scoreResult > 50 ? 'Cancer' : 'Non-cancer';
    
    const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

    return { result, suggestion, scoreResult };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input ${error.message}`);
  }
}

module.exports = predictClassification;