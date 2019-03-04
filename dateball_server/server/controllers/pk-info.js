const pkInfoService = require('./../services/pk-info')
const pkCode = require('./../codes/pk')
const uploadFile = require('./../utils/upload')
const log4js = require('log4js')
const Sequelize = require('sequelize')


module.exports = {
    async getPkList(ctx) {
        let result = {
            success: false,
            message: '',
            data: null,
        }

        const { meid } = ctx.query
        if (meid !== null) {
            let pkList = await pkInfoService.getPkList(meid)
            if (pkList) {
                result.data = pkList
                result.success = true
            } else {
                result.code = 'FAIL_NO_PK'
                result.message = pkCode.FAIL_NO_PK
            }
        } else {
            result.code = 'FAIL_NO_PK'
            result.message = pkCode.FAIL_NO_PK
        }

        ctx.body = result
    },

    async createPk(ctx) {

        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;

        let formData = ctx.request.body
        let result = {
            success: false,
            message: '',
            data: null
        }
        var logger = log4js.getLogger('common')

        let pkResult = await pkInfoService.createPk({
            select_self_team: formData.select_self_team,
            select_pk_team: (formData.select_pk_team !== undefined) ? formData.select_pk_team : -1,
            pk_type: (formData.pk_type !== undefined) ? formData.pk_type : 1,
            reply: (formData.reply !== undefined) ? formData.reply : 1,
            start_datetime: (formData.start_datetime !== undefined) ? formData.start_datetime : new Date().getTime() + 10 * day,
            last_answer_datetime: (formData.last_answer_datetime !== undefined) ? formData.last_answer_datetime : new Date().getTime() + day * 7,
            contact_name: (formData.contact_name !== undefined) ? formData.contact_name : '',
            contact_phone: (formData.contact_phone !== undefined) ? formData.contact_phone : '',
            comment: (formData.comment !== undefined) ? formData.comment : '',
            courtId: (formData.courtId !== undefined) ? formData.courtId : -1,

        })

        if (pkResult && pkResult.success) {
            result.success = true
            result.data = {};
            result.data.pk_id = pkResult.id
        } else {
            result.code = 'ERROR_SYS'
            result.message = pkCode.ERROR_SYS
        }
        logger.error("createPK:", result)
        ctx.body = result
    },

    async updatePk(ctx) {},

    async removePk(ctx) {},

    async replyPk(ctx) {},

}