var fs = require('fs');

fs.readdir('../../../../../Downloads', (err, data) => {
    console.log(data);
});
