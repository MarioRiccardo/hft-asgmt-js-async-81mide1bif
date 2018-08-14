import { getData, saveData } from './../public/script'
import fetchMock from 'fetch-mock'
const $ = require('jquery')

describe('script.js', () => {
  it('getData should fetch the data from the server and use jQuerys append to add data to the empty table', async () => {
    const spy = jest.spyOn($.fn, 'append')

    fetchMock.get('/api/shouts', [{username: 'user', message: 'message'}]);
    expect(await getData());
    expect(spy).toHaveBeenCalled();
    fetchMock.restore();
  })
  
  it('savbeData should fetch the data from the server and use jQuerys append to add the new data to the table', async () => {
    const spy = jest.spyOn($.fn, 'append')
    fetchMock.post('/api/shouts', [{id: 1, username: 'user', message: 'message'}]);
    expect(await saveData('user', 'message'));
    expect(spy).toHaveBeenCalled();
    fetchMock.restore();
  })
});
