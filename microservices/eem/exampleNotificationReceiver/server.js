const KafkaWrapper = require('./KafkaWrapper.js');
const {app} = require("./app");

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});