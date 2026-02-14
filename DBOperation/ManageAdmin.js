const { dbConfig } = require("./DBConfig");

class ManageAdmin {

    getmaxAdminID = async () => {
        const db = await dbConfig();
        const collection = db.collection("Admin_Master");
        const result = await collection.find({}, { projection: { _id: 1 } }).sort({ _id: -1 }).limit(1).toArray();
        const ID = (result.length > 0 ? result[0]._id : 0) + 1;
        console.log("Generated Admin ID:", ID);
        return ID;
    };

    saveAdmin = async (data) => {
        const db = await dbConfig();
        const collection = db.collection("Admin_Master");

        const AdminId = await this.getmaxAdminID();

        const result = await collection.insertOne({
            _id: AdminId,
            FullName: data.FullName,
            ContactNo: data.ContactNo,
            Email: data.Email,
            UserName: data.UserName,
            Password: data.Password,
            created_at: new Date()
        });

        return result.acknowledge ? "success" : "successfully saved";
    };

    getAdmin = async () => {
        const db = await dbConfig();
        const collection = db.collection("Admin_Master");
        return await collection.find({}).toArray();
    };

    authetication = async (data) => {
        const db = await dbConfig();
        const collection = db.collection("Admin_Master");
        const admin = await collection.findOne({ UserName: data.UserName, Password: data.Password });
        return admin ? { Status: "OK", Result: admin } : { Status: "Fail", Result: "Wrong username or Password" };
    };

    updateAdmin = async (id, data) => {
        const db = await dbConfig();
        const collection = db.collection("Admin_Master");

        const result = await collection.updateOne(
            { _id: parseInt(id) },
            {
                $set: {
                    UserName: data.UserName,
                    Password: data.Password,

                }
            }
        );

        return result.modifiedCount > 0 ? "successfully updated" : "something went wrong";
    };

    changePassword = async (data) => {
        const db = await dbConfig();
        const collection = db.collection("Admin_Master");

        // Find the admin by id
        const admin = await collection.findOne({ _id: parseInt(data.id) });

        if (!admin) {
            return "Admin not found";
        }

        // Check if old password matches
        if (admin.Password !== data.oldPassword) {
            return "Old password is incorrect";
        }

        // Update to new password
        const result = await collection.updateOne(
            { _id: parseInt(data.id) },
            {
                $set: { Password: data.newPassword },
            }
        );

        return result.modifiedCount > 0
            ? {Status: "OK", Result: "Password changed successfully"}
            : {Status: "Fail", Result: "Something went wrong"};
    };



    deleteAdmin = async (id) => {
        const db = await dbConfig();
        const collection = db.collection("Admin_Master");

        const result = await collection.deleteOne({ _id: parseInt(id) });

        return result.deletedCount > 0 ? "success" : "no record found";
    };
}

module.exports = new ManageAdmin();