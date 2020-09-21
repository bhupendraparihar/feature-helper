import FH from '../index.js'

describe('feature-helper', () => {
    it('FH', () => {
        console.log(FH.init);
        expect(FH.init).not.toBeUndefined();
   })
})