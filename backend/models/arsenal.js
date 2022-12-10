const mongoose = require ('mongoose');
const arsenalSchema = mongoose.Schema ({
 tipo: {type: String, required: true},
 nome: {type: String, required: true},
 quantidade: {type: Number, required: true}
});
module.exports = mongoose.model('Arsenal', arsenalSchema);
