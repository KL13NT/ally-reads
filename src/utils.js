function deepCompare (schema, obj2){

	function isNotEqual (obj1, obj2){
		if(isObject(obj1) && isObject(obj2)){

			return Object.keys(obj1).some(key => {
				if(typeof obj2[key] === 'undefined') return true

				if(isObject(obj1[key]) && isObject(obj2[key])) return isNotEqual(obj1[key], obj2[key])
			})

		}

	}

	return !isNotEqual(schema, obj2)

}

/**
 * Returns accurate types
 * @param {*} obj any object
 */
function getType (obj){
	return Object.prototype.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

/**
 * Checks whether a value is of type Object
 * @param {*} obj any object
 */
function isObject (obj){
	return obj !== null && getType(obj) === 'object'
}

export {
	deepCompare,
	getType,
	isObject
}