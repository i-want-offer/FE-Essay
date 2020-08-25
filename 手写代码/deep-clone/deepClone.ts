// @ts-ignore
function deepClone<T>(params: T): T {
	const isObj = (v: any) => Object.prototype.toString.call(v).slice(8, -1) === 'Object'

	function _deepClone(val: any) {
		if (Array.isArray(val)) {
			const source = val as any[]
			return source.reduce((res, item) => {
				res.push(_deepClone(item))
				return res
			}, [])
		}

		if (isObj(val)) {
			const source = val as object
			return Object.keys(source).reduce((res, key) => {
				res[key] = _deepClone(source[key])
				return res
			}, {})
		}
		return val
	}

	return _deepClone(params) as T
}