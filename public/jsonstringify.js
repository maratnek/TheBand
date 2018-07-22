//Recursive implementation of jSON.stringify;
export function stringifyJSON(obj) {

  console.log("Json Stringifgy test", typeof(obj));
    var arrOfKeyVals = [],
        arrVals = [],
        objKeys = [];

    /*********CHECK FOR PRIMITIVE TYPES**********/
    if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null)
        return '' + obj;
    else if (typeof obj === 'string')
        return '"' + obj + '"';

    /*********CHECK FOR ARRAY**********/
    else if (Array.isArray(obj)) {
        //check for empty array
        if (obj[0] === undefined)
            return '[]';
        else {
            obj.forEach(function(el) {
                arrVals.push(stringifyJSON(el));
            });
            return '[' + arrVals + ']';
        }
    }
    /*********CHECK FOR OBJECT**********/
    else if (obj instanceof Object) {
        //get object keys
        // objKeys = Object.keys(obj);
        // console.log(typeof obj);
        //set key output;
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            console.log(key, obj[key]);
            var keyOut = '"' + key + '":';
            var keyValOut = obj[key];
            //skip functions and undefined properties
            if (keyValOut instanceof Function || typeof keyValOut === undefined)
                arrOfKeyVals.push('');
            else if (typeof keyValOut === 'string')
                arrOfKeyVals.push(keyOut + '"' + keyValOut + '"');
            else if (typeof keyValOut === 'boolean' || typeof keValOut === 'number' || keyValOut === null)
                arrOfKeyVals.push(keyOut + keyValOut);
            else if (Array.isArray(keyValOut)) {
            //check for empty array
              let arrVals = [];
              if (keyValOut[0] === undefined)
                arrOfKeyVals.push(keyOut + '[]');
              else {
                keyValOut.forEach(function(el) {
                  arrVals.push(stringifyJSON(el));
                });
                arrOfKeyVals.push(keyOut + '[' + arrVals + ']');
              }
            }
            //check for nested objects, call recursively until no more objects
            else if (keyValOut instanceof Object) {
                arrOfKeyVals.push(keyOut + stringifyJSON(keyValOut));
            }
          }
        }
        return '{' + arrOfKeyVals + '}';
    }
};
