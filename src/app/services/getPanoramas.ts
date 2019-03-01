import Panorama from '../components/panorama';

export default (): Panorama[] => {
  return [
    new Panorama('0', 'Great Room'),
    new Panorama('1', 'Kitchen'),
    new Panorama('2', 'Casual Dining'),
    new Panorama('3', 'Master Bedroom'),
    new Panorama('4', 'Master Bathroom'),
    new Panorama('5', 'Bonus Room'),
    new Panorama('6', 'Second Bedroom')
  ];
};
