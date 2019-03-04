const courtInfoService = require('./../services/court-info')
const courtCode = require('./../codes/court')
const uploadFile = require('./../utils/upload')
const log4js = require('log4js')
const Sequelize = require('sequelize')


module.exports = {

    async getCourtList(ctx) {
        let result = {
            success: false,
            message: '',
            data: null,
        }

        const { meid } = ctx.query
        if (meid !== null) {
            let courtList = await courtInfoService.getCourtList(meid)
            if (courtList) {
                result.data = courtList
                result.success = true
            } else {
                result.code = 'FAIL_NO_COURT'
                result.message = courtCode.FAIL_NO_COURT
            }
        } else {
            result.code = 'FAIL_NO_COURT'
            result.message = courtCode.FAIL_NO_COURT
        }

        ctx.body = result

    },

    async createCourt(ctx) {

        let formData = ctx.request.body
        let result = {
            success: false,
            message: '',
            data: null
        }
        var logger = log4js.getLogger('common')

        let courtResult = await courtInfoService.createCourt({
            court_img: (formData.court_img != null) ? formData.court_img : '',
            court_name: formData.court_name,
            court_addr: formData.court_addr,
            court_price: (formData.court_price !== undefined) ? formData.court_price : '免费',
            num: (formData.num !== undefined) ? formData.num : 1,
            open_time: (formData.open_time !== undefined) ? formData.open_time : '24小时',
            contact: (formData.contact !== undefined) ? formData.contact : '',
            remark: (formData.remark !== undefined) ? formData.remark : '',
            position: (formData.position !== undefined) ? formData.position : '',
            meId: (formData.meId !== undefined) ? formData.meId : -1,
        })

        if (courtResult && courtResult.success) {
            result.success = true
            result.data = {};
            result.data.court_id = courtResult.id
        } else {
            result.code = 'ERROR_SYS'
            result.message = courtCode.ERROR_SYS
        }

        logger.error("createCourt:", result)
        ctx.body = result
    },

    async updateCourt(ctx) {},

    async removeCourt(ctx) {},

    async uploadCourtImg(ctx) {
        let result = { success: false }
            // 上传文件事件
        result = await uploadFile(ctx, {
            pictureType: 'courtimg',
        })
        ctx.body = result
    },

}