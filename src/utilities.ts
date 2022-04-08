export function removeUndefinedAttributes(object: any) {
  Object.entries(object).forEach(([key, value]) => {
    if (value === undefined) {
      // @ts-ignore
      delete object[key];
    }
  });
}
