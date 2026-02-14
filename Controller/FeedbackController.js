const ManageFeedback = require("./../DBOperation/ManageFeedback");

class FeedbackController {

    // ✅ Save New Feedback
    saveRequest = async (req, res) => {
        try {
            const { RegisterationId, Message } = req.body;

            if (!RegisterationId || !Message) {
                return res.status(400).json({
                    Status: "Fail",
                    Result: "RegisterationId and Message are required"
                });
            }

            const result = await ManageFeedback.saveFeedback(req.body);

            return res.status(200).json({
                Status: result === "success" ? "OK" : "Fail",
                Result: result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ Status: "Error", Result: "Server error" });
        }
    };

    // ✅ Get All Feedback
    listRequest = async (req, res) => {
        try {
            const data = await ManageFeedback.getFeedback();
            return res.status(200).json({ Status: "OK", Result: data });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ Status: "Error", Result: "Server issue" });
        }
    };

    // ✅ Get Feedback by ID
    getByIdRequest = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                return res.status(400).json({
                    Status: "Fail",
                    Result: "Id is required"
                });
            }

            const result = await ManageFeedback.getFeedbackById(id);

            if (result) {
                return res.status(200).json({ Status: "OK", Result: result });
            }

            return res.status(404).json({ Status: "Fail", Result: "Record not found" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ Status: "Error", Result: "Server issue" });
        }
    };

    // ✅ Delete Feedback
    deleteRequest = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                return res.status(400).json({
                    Status: "Fail",
                    Result: "Id is required"
                });
            }

            const result = await ManageFeedback.deleteFeedback(id);

            return res.status(200).json({
                Status: result === "success" ? "OK" : "Fail",
                Result: result
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ Status: "Error", Result: "Server issue" });
        }
    };

    // ✅ Update Reply
    updateRequest = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                return res.status(400).json({
                    Status: "Fail",
                    Result: "Id is required"
                });
            }

            const result = await ManageFeedback.updateFeedback(id, req.body);

            return res.status(200).json({
                Status: result === "success" ? "OK" : "Fail",
                Result: result
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ Status: "Error", Result: "Server issue" });
        }
    };

}

module.exports = new FeedbackController();
