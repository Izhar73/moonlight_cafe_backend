const ManageLogin = require("./../DBOperation/ManageLogin");

class LoginController {

    saveRequest = async (req, res) => {
        const { UserName, Password } = req.body;

        const errors = [];
        if (!UserName) errors.push("UserName is required");
        if (!Password) errors.push("Password is required");

        if (errors.length > 0){
            return res.status(400).json({ Status: "Fail", Result: errors });

        }

        const result = await ManageLogin.saveLogin(req.body);

        if (result === "Failed") {
            return res.status(400).json({ Status: "Fail", Result: "something went wrong saved" });
        }
        return res.status(200).json({ Status: "OK", Result: result });
    };
    listRequest = async (req, res) => {
        const data = await ManageLogin.getLogin();
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

        const result = await ManageLogin.getLoginById(id);

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

    const result = await ManageLogin.deleteLogin(id);

    if (result === "success") {
        return res.status(200).json({ Status: "OK", Result: "Successfully deleted" });
    } else {
        return res.status(404).json({ Status: "Fail", Result: "No record found" });
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
    
            const responseResult = await ManageLogin.updateLogin(id, data);
    
            if (responseResult.Status == "OK") {
                return res.status(200).json(responseResult);
                
            } 
    
            return res.status(400).json(responseResult);
        }
}
module.exports = new LoginController();