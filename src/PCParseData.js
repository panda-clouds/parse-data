class PCParseData {
	constructor(request) {
		// pass the 'request' object
		this.request = request;
	}

	prop(prop) {
		this.property = prop;

		return this;
	}

	existsOnCurrent() {
		const obj = this.request.object;
		const prop = obj.get(this.property);
		const has = obj.has(this.property);

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

		const has = orig.has(this.property);
		const prop = orig.get(this.property);

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
			const orig = this.request.original.get(this.property);
			const obj = this.request.object.get(this.property);


			if (PCParseData.isDate(orig) && PCParseData.isDate(obj)) {
				if (orig.getTime() === obj.getTime()) {
					return false;
				}

				// It's a date, but they don't match
				return true;
			}

			if (PCParseData.isParsePtr(orig) && PCParseData.isParsePtr(obj)) {
				if ((orig.className === obj.className) && (orig.id === obj.id)) {
					return false;
				}

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

	static isParsePtr(maybePtr) {
		return maybePtr instanceof Parse.Object;
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
			throw new Error('The property ' + this.property + ' must exist');
		}

		return this;
	}

	mustNotChange() {
		if (this.changed()) {
			// The property 'username' can't be changed
			throw new Error('The property ' + this.property + ' must not change');
		}

		return this;
	}

	mustBeInFuture() {
		const date = this.request.object.get(this.property);
		const now = new Date();

		if (!PCParseData.isDate(date)) {
			// The property 'startTime' must be a date
			throw new Error('The property ' + this.property + ' must be a date');
		}

		if (date > now) {
			// selected date is in the future
			return this;
		}

		// The property 'startTime' must be in the future
		throw new Error('The property ' + this.property + ' must be in the future');
	}

	mustBeBefore(propName) {
		const dateA = this.request.object.get(this.property);
		const dateB = this.request.object.get(propName);

		if (!PCParseData.isDate(dateA)) {
			throw new Error('The property ' + this.property + ' must be a date');
		}

		if (!PCParseData.isDate(dateB)) {
			throw new Error('The property ' + propName + ' must be a date');
		}

		if (dateB > dateA) {
			// B is after A
			return this;
		}

		throw new Error('The property ' + this.property + ' must be before property ' + propName);
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
