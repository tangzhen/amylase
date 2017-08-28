import {getLocation} from '../src/utils';

describe('getLocation', () => {
  context('input is string', () => {
    it('should return the location object without state', () => {
      const locationObject = getLocation('/new/good/location?firsName=FunFun&lastName=Liu');
      expect(locationObject).to.deep.equal({
        pathname: '/new/good/location',
        search: '?firsName=FunFun&lastName=Liu',
        state: undefined
      })
    });

    it('should return the location object with state', () => {
      const locationObject = getLocation('/new/good/location?firsName=FunFun&lastName=Liu', {stateKey: 'stateValue'});
      expect(locationObject).to.deep.equal({
        pathname: '/new/good/location',
        search: '?firsName=FunFun&lastName=Liu',
        state: {
          stateKey: 'stateValue'
        }
      })
    });
  });

  context('input is object', () => {
    it('should return the location object without state', () => {
      const locationObject = getLocation({pathname: '/new/good/location', search: '?firsName=FunFun&lastName=Liu'});
      expect(locationObject).to.deep.equal({
        pathname: '/new/good/location',
        search: '?firsName=FunFun&lastName=Liu',
        state: {}
      })
    });

    it('should return the location object with state', () => {
      const locationObject = getLocation({
        pathname: '/new/good/location',
        search: '?firsName=FunFun&lastName=Liu',
        state: {stateKey: 'stateValue'}
      });
      expect(locationObject).to.deep.equal({
        pathname: '/new/good/location',
        search: '?firsName=FunFun&lastName=Liu',
        state: {
          stateKey: 'stateValue'
        }
      })
    });
  });
});