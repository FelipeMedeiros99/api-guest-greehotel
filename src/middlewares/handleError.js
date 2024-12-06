export default async function handleError(error, req, res, next) {
    try{
        res.send(error).status(404)
    }catch(e){
        res.send(e).status(500)
    } 
}