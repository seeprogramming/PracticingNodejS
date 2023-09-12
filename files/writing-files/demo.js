var fs = require('fs');

var data = {
    name: 'Sita',
};

fs.writeFile('data.json', JSON.stringify(data), (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Data has been written to data.json');
    }
});
