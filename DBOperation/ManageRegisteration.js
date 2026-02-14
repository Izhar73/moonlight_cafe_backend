const { dbConfig } = require("./DBConfig");

class ManageRegisteration {

    getmaxRegisterationID = async () => {
        const db = await dbConfig();
        const  collection = db.collection("Registeration_Master");
        const result = await collection.find({},{ projection: { _id:1 }}).sort({ _id: -1}).limit(1).toArray();
        const ID = (result.length > 0 ? result[0]._id : 0) + 1;
        console.log("Generated Registeration ID:", ID);
        return ID;
    };

    saveRegisteration = async (data) => {
        const db = await dbConfig();
        const collection = db.collection("Registeration_Master");

        const RegisterationId = await this.getmaxRegisterationID();

        const result = await collection.insertOne({
            _id: RegisterationId,
            FullName: data.FullName,
            ContactNo: data.ContactNo,
            Email: data.Email,
            Address: data.Address,
            UserName: data.UserName,
            Password: data.Password,
            created_at: new Date()
        });

        return result.acknowledge ? "success" : "successfully saved";
    };

    getRegisteration = async () => {
        const db = await dbConfig();
        const collection = db.collection("Registeration_Master");
        return await collection.find({}).toArray();
    };

    getRegisterationById = async () => {
        const db = await dbConfig();
        const collection = db.collection("Registeration_Master");
        const Registeration = await collection.findOne({ _id: parseInt(id) });
        return Registeration || "no user found";
    };

    updateRegisteration = async (id,data) => {
        const db = await dbConfig();
        const collection = db.collection("Registeration_Master");

        const result = await collection.updateOne(
            { _id: parseInt(id) },
            {
                $set: {
                    FullName: data.FullName,
                    ContactNo: data.ContactNo,
                    Email: data.Email,
                    Address: data.Address,
                    UserName: data.UserName,
                    Password: data.Password,
        
                }
            }
        );

        return result.modifiedCount > 0 ? "successfully updated" : "something went wrong";
    };

    deleteRegisteration = async (id) => {
        const db = await dbConfig();
        const collection = db.collection("Registeration_Master");

        const result = await collection.deleteOne({ _id: parseInt(id) });

        return result.deletedCount > 0 ? "success" : "no record found";
    };
    }

module.exports = new ManageRegisteration();