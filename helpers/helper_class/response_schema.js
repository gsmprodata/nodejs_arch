'use strict';

class ResponseSchema {
   constructor(result, status_code){
       this.result = result;
       this.status_code = status_code;
   }
}

module.exports = ResponseSchema;