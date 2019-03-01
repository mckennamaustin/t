import Panorama from '../components/panorama';
export default () => {
    return new Promise((resolve, reject) => {
        resolve([
            new Panorama('a', 'Kitchen'),
            new Panorama('b', 'Patio'),
            new Panorama('c', 'Cafe'),
            new Panorama('d', 'Bedroom Window'),
            new Panorama('e', 'Bedroom Balcony')
        ]);
    });
};
//# sourceMappingURL=getPanoramas.js.map