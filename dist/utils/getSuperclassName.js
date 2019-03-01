export default (object) => {
    return Object.getPrototypeOf(Object.getPrototypeOf(object)).constructor.name;
};
//# sourceMappingURL=getSuperclassName.js.map