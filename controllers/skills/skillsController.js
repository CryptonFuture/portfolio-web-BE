const validator = require('validator')
const Skills = require('../../models/skillsSchema')

const AddSkills = async (req, res) => {
    try {
        const { name, description } = req.body

        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'name is required'
            })
        }

        const isExist = await Skills.findOne({ name })

        if (isExist) {
            return res.status(400).json({
                success: false,
                error: "skills name already exists",
            });
        }

        const skills = new Skills({
            name,
            description,
        })

        const skillData = await skills.save()

        return res.status(200).json({
            success: true,
            message: "create skills successfully",
            data: skillData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const getSkills = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", sort = "" } = req.query

        const pageNumber = parseInt(page, 10)
        const limitNumber = parseInt(limit, 10)

        const searchQuery = search
            ? { $or: [{ name: { $regex: search, $options: "i" } }] }
            : {}



        const skip = (pageNumber - 1) * limitNumber

        let sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(":");
            sortOptions[field] = order === "desc" ? -1 : 1;
        }

        const skills = await Skills.find(searchQuery)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNumber)

        const totalRecords = await Skills.countDocuments(searchQuery)

        if (!skills.length > 0) {
            return res.status(404).json({
                success: false,
                error: "No skills found"
            })
        }

        return res.status(200).json({
            success: true,
            data: skills,
            pagination: {
                totalRecords,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalRecords / limitNumber),
                limit: limitNumber
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const getSkillsById = async (req, res) => {
    try {
        const { id } = req.params
        const skills = await Skills.find({ _id: id })

        if (!skills) {
            return res.status(404).json({
                success: false,
                error: "No skills Id found"
            })
        }

        return res.status(200).json({
            success: true,
            data: skills
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

// Hard Delete
const deleteSkills = async (req, res) => {
    try {
        const { id } = req.params

        const skills = await Skills.findByIdAndDelete({ _id: id })

        if (!skills) {
            return res.status(404).json({
                success: false,
                error: "No skills Id found"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: skills,
                message: 'Delete Skills Successfully'
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

// soft Delete
const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params

        const skills = await Skills.findByIdAndUpdate({ _id: id }, { is_deleted: 1 })

        if (!skills) {
            return res.status(404).json({
                success: false,
                error: "No skills Id found"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: skills,
                message: 'Delete Skill Successfully'
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const countSkills = async (req, res) => {
    try {
        const { search = "" } = req.query

        const searchQuery = search
            ? { $or: [{ name: { $regex: search, $options: "i" } }] }
            : {};

        const countSkills = await Skills.countDocuments(searchQuery)
        return res.status(200).json({
            success: true,
            count: countSkills
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const updateSkills = async (req, res) => {
    try {
        const { id } = req.params

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'name is required',
            });
        }

        const updatedSkills = await Skills.findByIdAndUpdate(
            { _id: id },
            { name, description },
            { new: true }
        );

        if (!updatedSkills) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: updatedSkills,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};


module.exports = {
    AddSkills,
    getSkills,
    deleteSkills,
    updateSkills,
    getSkillsById,
    countSkills,
    deleteSkill
}