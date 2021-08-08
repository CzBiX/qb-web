import Vue from 'vue';
import { isPlainObject } from 'lodash';

// based on https://github.com/richardtallent/vue-object-merge/blob/main/index.js

export const stateMerge = function(state: any, value: any, propName?: string, ignoreNull?: boolean) {
	if (isPlainObject(state) && (propName == null || propName in state)) {
		const o = propName == null ? state : state[propName];
		if (o != null && isPlainObject(value)) {
			for (const prop in value) {
				stateMerge(o, value[prop], prop, ignoreNull);
			}
			return;
		}
	}
	if (!ignoreNull || value !== null) Vue.set(state, propName!, value);

    return state;
};

export default stateMerge;