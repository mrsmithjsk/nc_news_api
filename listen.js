const app = require('./app.js')
const PORT = process.env.PORT || 9090;
app.listen(PORT, (error) => {
    if(error) {
        console.log(error)
    } else {
    console.log(`Server is running on port ${PORT}`);
}
});