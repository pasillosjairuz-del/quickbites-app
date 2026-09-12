// A minimal stand-in for supabase-js's chainable, "thenable" query builder.
// Every method returns the same object, and awaiting the object (or calling
// .then on it) at any point in the chain resolves to `result` — matching how
// the real PostgrestFilterBuilder can be awaited after any link in the chain.
export function makeThenable(result) {
  const builder = {}
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'in', 'order', 'single', 'limit']
  methods.forEach((method) => {
    builder[method] = jest.fn(() => builder)
  })
  builder.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject)
  return builder
}
