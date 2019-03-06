const Router = require('koa-router')
const Urls = require('../options/urls')
const service = require('../utils/axios')
const Consts = require('../options/consts')
const { CODE, MSG } = require('../options/error')

const MockData = require('../options/mockData')

const router = new Router({
  prefix: `${Consts.BASE_API}/information`
})

const sign = Urls.sign;

/**
 * 获取玩家列表
 */
router.get('/playerList', async (ctx) => {
  const { page, limit, nickname } = ctx.query;
  // const { status, data } = await service.get(`${Urls.requestUrl}/playerList`, {
  //   params: {
  //     sign
  //   }
  // });
  // const ok = status === 200;
  const ok = false;
  ctx.status = 200;
  ctx.body = {
    code: ok ? CODE.SUCCESS : CODE.FAIL,
    msg: ok ? MSG.SUCCESS : MSG.FAIL,
    total: ok ? total : MockData.playerList.total,
    items: ok ? items : MockData.playerList.items
  };
});

router.post('/sealAccount', async (ctx) => {
  let playerId = ctx.request.body.id;
  // const { status, data } = await service.post(`${Urls.requestUrl}/sealAccount`, { playerId });
  // const ok = status === 200;
  const ok = false;
  ctx.status = 200;
  ctx.body = {
    code: ok ? CODE.SUCCESS : CODE.FAIL,
    msg: ok ? MSG.SUCCESS : MSG.FAIL
  };
});

router.post('/forbidChat', async (ctx) => {
  let playerId = ctx.request.body.id;
  // const { status, data } = await service.post(`${Urls.requestUrl}/forbidChat`, { playerId });
  // const ok = status === 200;
  const ok = false;
  ctx.status = 200;
  ctx.body = {
    code: ok ? CODE.SUCCESS : CODE.FAIL,
    msg: ok ? MSG.SUCCESS : MSG.FAIL
  };
});

module.exports = router.routes();

