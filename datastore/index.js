const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
// fs.writeFile( exports.counterFile , counterString,
exports.create = (text, callback) => {
  var id = counter.getNextUniqueId( (err,id)=>
    {
      var filePath = path.join(exports.dataDir,`${id}.txt`);
      fs.writeFile(filePath, text , (err)=> {
        if (err)
        callback(err);
        else
        callback(null, {id,text});
      });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err,files)=>{
    if(err){
      callback(err);
    }else{
      var data = _.map(files,(file)=>{
        var id = path.basename(file,'.txt');
        return{
          id:id,
          text:id
        }
      })
      callback(null, data);
    }
  })
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
