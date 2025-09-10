module.exports = class poolLib{
    entities = []
    set_entity(stream){
        this.entities.push(stream)
    }
    get_entities(){
        return this.entities
    }
    exist_entitie(idx){
        return !!this.entities[idx]
    }
}