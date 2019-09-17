class PCParseData {
	constructor(request) {
		// pass the 'request' object
		this.request = request;
	}

	prop(prop) {
		this.prop = prop;

		return this;
	}

	existsOnCurrent() {
		const obj = this.request.object;
		const prop = obj.get(this.prop);
		const has = obj.has(this.prop);

		if (!has || prop === null) {
			return false;
		}

		return true;
	}
	existsOnOriginal() {
		const orig = this.request.original;

		if (!orig) {
			return false;
		}

		const has = orig.has(this.prop);
		const prop = orig.get(this.prop);

		if (!has || prop === null) {
			return false;
		}

		return true;
	}

	exists() {
		if (this.existsOnCurrent()) {
			return true;
		} else if (this.existsOnOriginal()) {
			return true;
		}

		return false;
	}


	changed() {
		if (!this.existsOnCurrent() && !this.existsOnOriginal()) {
			// we haven't set anything yet
			// AND
			// we haven't 'unset' the object
		} else if (!this.existsOnOriginal()) {
			// we don't have an original
			// Therefore we can't compare
			return false;
		} else {
			const orig = this.request.original.get(this.prop);
			const obj = this.request.object.get(this.prop);


			if (PCParseData.isDate(orig) && PCParseData.isDate(obj)) {
				if (orig.getTime() === obj.getTime()) {
					return false;
				}

				// It's a date, but they don't match
				return true;
			}

			if (orig === obj) {
				return false;
			}

			return true;
		}
	}

	static isDate(maybeDate) {
		return maybeDate instanceof Date && !isNaN(maybeDate.valueOf()) && maybeDate.getTime;
	}
	// Error functions
	//
	// These functions throw an error if needed
	// AND
	// they return 'true' if there is an error
	//
	// returning 'true' allows for
	// if (data.prop('myKey').mustExist()) return;
	// vs.
	// if we were to return false
	// if (!data.prop('myKey').mustExist()) return;

	mustExist() {
		if (!this.exists()) {
			// The property 'username' must exist
			throw new Error('The property ' + this.prop + ' must exist');
		}

		return this;
	}

	mustNotChange() {
		if (this.changed()) {
			// The property 'username' can't be changed
			throw new Error('The property ' + this.prop + ' must not change');
		}

		return this;
	}

	mustBeInFuture() {
		const date = this.request.object.get(this.prop);
		const now = new Date();

		if (!PCParseData.isDate(date)) {
			// The property 'startTime' must be a date
			throw new Error('The property ' + this.prop + ' must be a date');
		}

		if (date > now) {
			// selected date is in the future
			return false;
		}

		// The property 'startTime' must be in the future
		throw new Error('The property ' + this.prop + ' must be in the future');
	}

	mustBeBefore(propName) {
		const dateA = this.request.object.get(this.prop);
		const dateB = this.request.object.get(propName);

		if (!PCParseData.isDate(dateA)) {
			throw new Error('The property ' + this.prop + ' must be a date');
		}

		if (!PCParseData.isDate(dateB)) {
			throw new Error('The property ' + propName + ' must be a date');
		}

		if (dateB > dateA) {
			// B is after A
			return false;
		}

		throw new Error('The property ' + this.prop + ' must be before property ' + propName);
	}

	static pass(request) {
		const dic = {};

		if (request.user && request.user.getSessionToken()) {
			dic.sessionToken = request.user.getSessionToken();
		}

		if (request.master) {
			dic.useMasterKey = true;
		}

		return dic;
	}
}

module.exports = PCParseData;
