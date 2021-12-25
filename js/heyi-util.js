/* 常用工具类 */
function HeyiUtil() {

}
/*删除数组中的某一个对象
_arr:数组
_obj:需删除的对象
*/
HeyiUtil.removeArrayByObject = function(_arr, _obj) {
	var length = _arr.length;
	for (var i = 0; i < length; i++) {
		if (_arr[i] == _obj) {
			if (i == 0) {
				_arr.shift(); //删除并返回数组的第一个元素
				return _arr;
			} else if (i == length - 1) {
				_arr.pop(); //删除并返回数组的最后一个元素
				return _arr;
			} else {
				_arr.splice(i, 1); //删除下标为i的元素
				return _arr;
			}
		}
	}
}

/*删除数组中的数组
_arr:数组
_obj:需删除的数组
*/
HeyiUtil.removeArrayByArray = function(_arr, arr) {
	for (var i = 0; i < arr.length; i++) {
		HeyiUtil.removeArrayByObject(_arr, arr[i]);
	}
}

/* 数组转字符串 */
HeyiUtil.arrayToString = function(arr, flag) {
	var s = "";
	for (var i = 0; i < arr.length; i++) {
		s += arr[i];
		if (i != arr.length - 1) {
			s += flag;
		}
	}
	return s;
}

/* 判断是否是对象 */
HeyiUtil.isObj = function(obj) {
	return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}

/* 深拷贝对象 */
HeyiUtil.copyObj = function(obj, hash = new WeakMap()) {
	let cloneObj
	let Constructor = obj.constructor
	switch (Constructor) {
		case RegExp:
			cloneObj = new Constructor(obj)
			break
		case Date:
			cloneObj = new Constructor(obj.getTime())
			break
		default:
			if (hash.has(obj)) return hash.get(obj)
			cloneObj = new Constructor()
			hash.set(obj, cloneObj)
	}
	for (let key in obj) {
		cloneObj[key] = HeyiUtil.isObj(obj[key]) ? HeyiUtil.copyObj(obj[key], hash) : obj[key];
	}
	return cloneObj
}

/* 匈牙利命名法转小驼峰命名法 */
HeyiUtil.toCamelCase = function(name) {
	return name.replace(/\_(\w)/g, function(all, letter) {
		return letter.toUpperCase();
	});
}

/* 驼峰命名法转匈牙利命名法 */
HeyiUtil.toLine=function(name) {
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}

/* 数据缓存工具类 */
var HeyiDataCache = function() {
	this.updateMap = new Map();
	this.insertSet = new Set();
	this.deleteSet = new Set();
	/* 添加修改项 */
	this.addUpdate = function(data) {
		//先判读这个元素是否存在于新增项或删除项中，如果不存在再在修改项进行缓存
		if (this.insertSet.has(data) || this.deleteSet.has(data)) {
			return;
		}
		this.updateMap.set(data, JSON.stringify(data));
	};
	/* 添加新增项 */
	this.addInsert = function(data) {
		this.insertSet.add(data);
	};
	/* 添加删除项（数组，多项） */
	this.addInsertArray = function(array) {
		for (var i in array) {
			this.addInsert(array[i]);
		}
	}
	/* 添加删除项 */
	this.addDelete = function(data) {
		//判断这个元素是否存在于新增项,如果存在新增项中，则删除新增项中对应条目，删除项也不进行缓存，直接返回
		if (this.insertSet.has(data)) {
			this.insertSet.delete(data);
			return;
		}
		//判断是否修改项中，如果存在则要把它们删除，只在删除项中缓存
		if (this.updateMap.has(data)) {
			this.updateMap.delete(data);
		}
		this.deleteSet.add(data);
	};
	/* 添加删除项（数组，多项） */
	this.addDeleteArray = function(array) {
		for (var i in array) {
			this.addDelete(array[i]);
		}
	};
	/* 获取修改项 */
	this.getUpdate = function() {
		var resultArray = [];
		for (const entry of this.updateMap) {
			var keyJson = JSON.stringify(entry[0]);
			var valueJson = entry[1];
			if (keyJson != valueJson) {
				resultArray.push(entry[0]);
			}
		}
		return resultArray;
	};
	/* 获取新增项 */
	this.getInsert = function() {
		return Array.from(this.insertSet);
	};
	/* 获取删除项 */
	this.getDelete = function() {
		return Array.from(this.deleteSet);
	};
	/* 清除所有值 */
	this.clearAll = function() {
		this.updateMap = new Map();
		this.insertSet = new Set();
		this.deleteSet = new Set();
	}
}

/* 字典缓存工具类 */
var HeyiDictionary = function(array, field) {
	this.map = new Map();
	for (var item of array) {
		this.map.set(item[field], item);
	}
	this.get = function(key, subKey) {
		var value = this.map.get(key);
		if (value == undefined) {
			console.warn("字典元素[" + key + "]不存在，返回空值");
			return "";
		}
		if (subKey) {
			return value[subKey];
		} else {
			return value;
		}
	}
}
