import FaqCategory from "../models/faqCategory.js";

class FaqCategoryService {
    async add(req, res) {
        try {
            let { name, description } = req.body;

            let obj = {
                name: name?.trim(),
                description: description?.trim()
            };

            let find = await FaqCategory.findOne({
                where: { name: name?.trim() },
                raw: true
            });

            if (find && find?.id) {
                return res.status(400).json({
                    message: `This Category "${name}" already exists`,
                    statusCode: 400,
                    success: false
                });
            }

            await FaqCategory.create(obj);

            return res.status(200).json({
                message: "Category added successfully",
                statusCode: 200,
                success: true
            });

        } catch (error) {
            return res.status(500).json({
                message: error?.message,
                statusCode: 500,
                success: false
            });
        }
    }
}

const faqCategoryServiceObj = new FaqCategoryService();
export default faqCategoryServiceObj;
