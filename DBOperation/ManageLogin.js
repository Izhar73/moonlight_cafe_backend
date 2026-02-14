const { dbConfig } = require("./DBConfig");

class ManageLogin {

    getmaxLoginID = async () => {
        const db = await dbConfig();
        const  collection = db.collection("Login_Master");
        const result = await collection.find({},{ projection: { _id:1 }}).sort({ _id: -1}).limit(1).toArray();
        const ID = (result.length > 0 ? result[0]._id : 0) + 1;
        console.log("Generated Login ID:", ID);
        return ID;
    };

    saveLogin = async (data) => {
        const db = await dbConfig();
        const collection = db.collection("Login_Master");

        const RegisterationId = await this.getmaxLoginID();

        const result = await collection.insertOne({
            _id: RegisterationId,
            UserName: data.UserName,
            Password: data.Password,
            created_at: new Date()
        });

        return result.acknowledge ? "success" : "successfully saved";
    };

    getLogin = async () => {
        const db = await dbConfig();
        const collection = db.collection("Login_Master");
        return await collection.find({}).toArray();
    };

    getLoginById = async () => {
        const db = await dbConfig();
        const collection = db.collection("Login_Master");
        const Login = await collection.findOne({ _id: parseInt(id) });
        return Login || "no user found";
    };

    updateLogin = async (id,data) => {
        const db = await dbConfig();
        const collection = db.collection("Login_Master");

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

    deleteLogin = async (id) => {
        const db = await dbConfig();
        const collection = db.collection("Login_Master");

        const result = await collection.deleteOne({ _id: parseInt(id) });

        return result.deletedCount > 0 ? "success" : "no record found";
    };
    }

module.exports = new ManageLogin();