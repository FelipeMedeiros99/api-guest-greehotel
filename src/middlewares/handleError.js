export default async function handleError(error, req, res, next) {
    try{
        console.log(error)
        res.status(error.status).send(error)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    } 
}