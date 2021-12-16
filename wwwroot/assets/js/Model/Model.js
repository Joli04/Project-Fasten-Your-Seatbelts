/**
 * Basic model class
 * @author Pepijn dik
 * @namespace Model
 */
import Builder from "../Classes/Builder.js";

export class Model implements Builder{
    constructor(table) {
        this.table = table;
        this.identifier = "";
        super.constructor(this);
    }
    setIdentifier(attribute){
        this.identifier = attribute;
    }
}