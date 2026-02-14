const ManageAdmin = require("./../DBOperation/ManageAdmin");
const Registeration = require("../model/RegisterationModel");

class AdminController {

    saveRequest = async (req, res) => {
        const {  FullName, ContactNo, Email, UserName, Password } = req.body;

        const errors = [];
        if (!FullName) errors.push("FullName is required");
        if (!ContactNo) errors.push("ContactNo is required");
        if (!Email) errors.push("Email is required");
        if (!UserName) errors.push("UserName is required");
        if (!Password) errors.push("Password is required");

        if (errors.length > 0){
            return res.status(400).json({ Status: "Fail", Result: errors });

        }

        const result = await ManageAdmin.saveAdmin(req.body);

        if (result === "Failed") {
            return res.status(400).json({ Status: "Fail", Result: "something went wrong saved" });
        }
        return res.status(200).json({ Status: "OK", Result: result });
    };

    authenticationRequest = async (req, res) => {
        const {   UserName, Password } = req.body;

        const errors = [];
        if (!UserName) errors.push("UserName is required");
        if (!Password) errors.push("Password is required");

        if (errors.length > 0){
            return res.status(400).json({ Status: "Fail", Result: errors });
        }

        const result = await ManageAdmin.authetication(req.body);
        return res.status(200).json(result);
    };

    chnagePasswordRequest = async (req, res) => {
        const {id, oldPassword, newPassword} = req.body;

        const errors = [];
        if (!oldPassword) errors.push("oldPassword is required");
        if (!newPassword) errors.push("newPassword is required");
        if (!id) errors.push("id is required");

        if (errors.length > 0){
            return res.status(400).json({ Status: "Fail", Result: errors });
        }

        const result = await ManageAdmin.changePassword(req.body);
        return res.status(200).json(result);
    };

    listRequest = async (req, res) => {
        const data = await ManageAdmin.getAdmin();
        return res.status(200).json({
            Result: data,
            Status: "OK"
        });
    };
    getByIdRequest = async (req, res) => {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ Status: "Fail", Result: "Id is required" });
        }

        const result = await ManageAdmin.getAdminById(id);

        if (result && result !== "No user found") {
            return res.status(200).json({ Status: "OK", Result: result });
        }
        else{
            return res.status(404).json({ Status: "Fail", Result: "Recoed not found" });
        }
    };

   deleteRequest = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ Status: "Fail", Result: "Id is required" });
    }

    const result = await ManageAdmin.deleteAdmin(id);

    if (result === "success") {
        return res.status(200).json({ Status: "OK", Result: "Successfully deleted" });
    } else {
        return res.status(404).json({ Status: "Fail", Result: "something went wrong" });
    }
};

    updateRequest = async (req, res) => {
            const id = req.params.id;
            const data = req.body;
    
            if (id == null) {
                return res.status(400).json({ Status: "Fail", Result: "UserName Is Required" });
            }
    
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ Status: "Fail", Result: "Update Data Is Required" });
            }
    
            const responseResult = await ManageAdmin.updateAdmin(id, data);
    
            if (responseResult.Status == "OK") {
                return res.status(200).json(responseResult);
                
            } 
    
            return res.status(400).json(responseResult);
        }
}
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Registeration.find().sort({ createdAt: -1 });
    res.status(200).json({ Status: "OK", Result: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ Status: "FAIL", Message: "Server Error" });
  }
};
module.exports = new AdminController();