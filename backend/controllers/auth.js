exports.signup= (req, res) => {
    console.log("REQ BODY", req.body);
    res.json({
        message: "Signup route works!"
    })
}

exports.signout = (req, res) =>{
    res.json({
        message: " user has signed out"
    });
}