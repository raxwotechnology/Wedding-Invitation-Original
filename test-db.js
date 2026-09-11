const mongoose = require("mongoose");

const uri = "mongodb+srv://projectsupport38_db_user:EbAHVvnxY5QnftsT@cluster0.kqgf360.mongodb.net/wedding_db?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS");
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR:", err.name, err.message);
    process.exit(1);
  });
