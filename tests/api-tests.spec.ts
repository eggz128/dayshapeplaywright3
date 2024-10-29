import {request,expect,test} from '@playwright/test';

test('test', async ({ request }) => {
    const reponse = await request.get('/api/Products/1');
    expect.soft(reponse.status()).toEqual(200);


});