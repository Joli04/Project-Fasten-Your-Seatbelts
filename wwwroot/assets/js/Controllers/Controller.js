/**
 * Default Controller class
 * to handle all functions of a Controller
 * @author Pepijn dik
 * @namespace Model
 */


export default class Controller{
    constructor(model, view) {
        this.view = view;
        this.model = model;
    }

    /**
     * Return a list
     */
    index(){

    }
    render(){
        return null;
    }
}