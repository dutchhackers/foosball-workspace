import { custom, PropSchema } from 'serializr';

/** Schemas */

export function numberMetric(): PropSchema {
  return custom(
    v => v /** serializeFunction */,
    (jsonValue: any, context: any, oldValue: any) => {
      if (jsonValue === null) {
        return oldValue;
      }
      return jsonValue;
    }
  );
}

/** serializer and deserializer functions */

export function serializeFunction(v: any) {
  return v;
}

export function deserializeFunctionIgnoreNull(jsonValue: any, context: any, oldValue: any) {
  if (jsonValue === null) {
    return oldValue;
  }
  return jsonValue;
}
