import faqCategoryModel from "../models/faqCategory.js";
import faqQuestionAnswerModel from "../models/faqQuestionAnswer.js";


class FaqQuestionAnswer {
    async add(req, res) {
        try {
            let { question, answer, category_id } = req.body
            let findCategoryExist = await faqCategoryModel?.findOne({ where: { id: category_id }, raw: true })
            if (!findCategoryExist) {
                return res.status(400).json({ messsage: `This Category not exist`, statusCode: 400, success: false })

            }
            let find = await faqQuestionAnswerModel?.findOne({ where: { question: question?.trim(), answer: answer?.trim() }, raw: true })
            if (find && find?.id) {
                return res.status(400).json({ messsage: `This Question & Answer already exist`, statusCode: 400, success: false })
            }
            let obj = {
                question: question?.trim(), answer: answer?.trim(), category_id
            }

            await faqQuestionAnswerModel?.create(obj)
            return res.status(200).json({ messsage: "Add data", statusCode: 200, success: true })
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }

    async get(req, res) {
        try {
            let getCatarray = await faqCategoryModel?.findAll({ where: { status: "active" }, raw: true, attributes: { exclude: ['created_at', 'updated_at'] } })

            let fetchCatIds = getCatarray?.map((a, b) => a?.id)
            let findQuestionAnswe = await faqQuestionAnswerModel?.findAll({ where: { category_id: fetchCatIds }, raw: true, attributes: { exclude: ['created_at', 'updated_at'] } })
            // console.log(findQuestionAnswe, 'findQuestionAnswefindQuestionAnswe')
            for (let le of getCatarray) {
                let findData = findQuestionAnswe?.filter((a) => a?.category_id == le?.id)
                if (findData) {
                    le.data = findData
                }
            }
            return res.status(200).json({ message: "fetch data", data: getCatarray, statusCode: 200, success: true })
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }

}

const FaqQuestionAnswerServicesObj = new FaqQuestionAnswer()
export default FaqQuestionAnswerServicesObj
