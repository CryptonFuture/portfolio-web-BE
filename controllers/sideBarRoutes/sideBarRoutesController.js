const SideBarRoutes = require('../../models/sideBarRoutesSchema')

const getSidebarRoutes = async (req, res) => {
    try {

        const { role } = req.query

        const routes = await SideBarRoutes.find({ role })

        if (!routes.length) {
            return res.status(404).json({
                success: false,
                error: "no sidebar routes found"
            })
        }


        return res.status(200).json({
            success: true,
            data: routes,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

module.exports = {
    getSidebarRoutes
}