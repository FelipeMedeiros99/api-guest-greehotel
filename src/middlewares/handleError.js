export default async function handleError(error, req, res, next) {
    try{
        res.status(error.status).send(error)
    }catch(e){
        res.status(500).send(e)
    } 
}