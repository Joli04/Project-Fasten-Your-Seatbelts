/**
 * Custom Database Query builder
 * @author Pepijn dik
 * @license Pdik systems
 * @since 16/12/2021
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import {query} from "../../../vendors/quill/quill";

export class Builder
{
    constructor(model) {
        this.model = model;
        this.parameters = [];
    }

    /**
     * Quick find for model or search for specifick attribute
     * @param value
     * @param attributes
     * @return {Promise<*>}
     */
    async find(value,attributes = null) {
        if(!attributes.id){
           attributes = "id";
        }
        this.query = "SELECT * FROM "+this.model.table + " WHERE "+ attributes + "=?" ;
        this.parameters.push(value);
        await this.get();
    }

    where(){

    }
    whereHas(){

    }

    /**
     * Get the query
     * @return {Promise<{}|*>}
     */
    async get() {
        try {
            let data = await FYSCloud.API.queryDatabase(this.query,this.parameters);
            return data[0];
        } catch (e) {
            console.log('Query builder : ' + e);
            return {};
        }
    }
    create(modelAttributes){

    }
    select(attributes){

    }
    /**
     * Update one specific colum
     * @param colum
     * @param colum_data
     * @return {Promise<{}|*>}
     */
    update(colum, colum_data) {
       this.query = "UPDATE "+this.model.table+" set " + colum + " = ? where "+this.model.identifier+"=" + this.model.id;
       this.parameters.push(colum_data)
    }

    /**
     * Destroy model and database Colum
     */
    destroy(){
        this.query = "DELETE "+this.model.table+" where "+this.model.identifier+"=" + this.model.id;
        this.parameters.push(colum_data)
        this.get(); //Execute
    }

    hasOne(){

    }
}