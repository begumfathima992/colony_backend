import faqCategoryModel from "../models/faqCategory.js";

class faqCategory {
    async add(req, res) {
        try {
            let { name, description } = req.body

            let obj = {
                name:name?.trim(), description:description?.trim()
            }
            let find = await faqCategoryModel?.findOne({ where: { name: name?.trim() }, raw: true })
            if (find && find?.id) {

                return res.status(400).json({ messsage: `This Category "${name}" already exist`, statusCode: 400, success: false })
            }
            await faqCategoryModel?.create(obj)
            return res.status(200).json({ messsage: "Add data", statusCode: 200, success: true })
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }

}

const faqCategoryServiceObj = new faqCategory()
export default faqCategoryServiceObj
