const { dbConfig } = require("./DBConfig");
const { ObjectId } = require("mongodb");

class ManageFeedback {

    // ✅ Get Max ID
    getmaxFeedbackID = async () => {
        const db = await dbConfig();
        const collection = db.collection("Feedback_Master");

        const last = await collection
            .find({}, { projection: { _id: 1 } })
            .sort({ _id: -1 })
            .limit(1)
            .toArray();

        return (last.length ? last[0]._id : 0) + 1;
    };

    // ✅ Insert Feedback
    saveFeedback = async (data) => {
        const db = await dbConfig();
        const collection = db.collection("Feedback_Master");

        const newId = await this.getmaxFeedbackID();

        const result = await collection.insertOne({
            _id: newId,
            RegisterationId: parseInt(data.RegisterationId),
            Message: data.Message,
            reply: null,
            created_at: new Date(),
        });

        return result.acknowledged ? "success" : "fail";
    };

    // ✅ Get All Feedback
    getFeedback = async () => {
        const db = await dbConfig();
        const collection = db.collection("Feedback_Master");

    return await collection.aggregate([
    {
        $lookup: {
            from: "Registeration_Master",   // ✅ correct
            localField: "RegisterationId",
            foreignField: "_id",
            as: "UserData"
        }
    },
    {
        $unwind: { path: "$UserData", preserveNullAndEmptyArrays: true }
    }
]).toArray();

    };

    // ✅ Get One Feedback
    getFeedbackById = async (id) => {
        const db = await dbConfig();
        const collection = db.collection("Feedback_Master");

      return await collection.aggregate([
    {
        $lookup: {
            from: "registeration_master",   // ✅ FIXED
            localField: "RegisterationId",
            foreignField: "_id",
            as: "UserData"
        }
    },
    {
        $unwind: { path: "$UserData", preserveNullAndEmptyArrays: true }
    }
]).toArray();


        return result.length ? result[0] : null;
    };

    // ✅ Update Feedback Reply
    updateFeedback = async (id, data) => {
        const db = await dbConfig();
        const collection = db.collection("Feedback_Master");

        const updateData = {};
        if (data.reply) updateData.reply = data.reply;

        const result = await collection.updateOne(
            { _id: parseInt(id) },
            { $set: updateData }
        );

        return result.modifiedCount > 0 ? "success" : "fail";
    };

    // ✅ Delete Feedback
    deleteFeedback = async (id) => {
        const db = await dbConfig();
        const collection = db.collection("Feedback_Master");

        const result = await collection.deleteOne({ _id: parseInt(id) });

        return result.deletedCount > 0 ? "success" : "fail";
    };
}

module.exports = new ManageFeedback();
