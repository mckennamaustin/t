export default (object: Object) => {
  return Object.getPrototypeOf(Object.getPrototypeOf(object)).constructor.name;
};
