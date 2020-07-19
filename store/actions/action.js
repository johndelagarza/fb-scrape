const { UPDATE_TASK_LOG } = require('./actionTypes');

const updateTaskLog = (keyword, msg) => {
  console.log({msg, keyword})
    return {
      type: UPDATE_TASK_LOG,
      keyword: keyword,
      msg: msg
    };
};

module.exports = { updateTaskLog: updateTaskLog }
  