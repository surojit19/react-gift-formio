import React, { Component } from "react";
import GiftParser from "gift-pegjs";
import {Form} from 'react-formio';
import _ from 'lodash';
import './Quiz.css';

class Quiz extends Component {
    
    constructor(props) {
      super(props);

      this.qset = [
        `::Q1:: What's between orange and green in the spectrum? 
        { =yellow ~red ~blue }`,

        `::Q2:: 1+1 \=2 {T}`,

        `::Q3:: 4+6\=11 {F}`,

        `::Q4:: Two plus {=two =2} equals four.`,

        `::Q5::Who is buried in Grant's tomb in New York City? {
        =Grant
        ~No one
        #Was true for 12 years, but Grant's remains were buried in the tomb in 1897
        ~Napoleon
        #He was buried in France
        ~Churchill
        #He was buried in England
        ~Mother Teresa
        #She was buried in India
        }`
      ];

      

      this.typesTemplate = {
          'MC': [{
                "key": "question",            
                "content": "Question will come here",
                "className":"quiz-question",
                "type": "htmlelement",                        
            }, {            
            "input": false,
            "tableView": false,
            "inputType": "radio",
            "label": "Options",   
            "hideLabel":true,
            "key": '',
            "customClass":"quiz-answer",
            "values": [],
            "clearOnHide": true,            
            "type": "selectboxes",
            "optionsLabelPosition": "right",            
        }],
        'Short': [{
            "label": "What is product of 2/3 and 3/2?",
            "allowMultipleMasks": false,
            "showWordCount": false,
            "showCharCount": false,
            "tableView": true,
            "alwaysEnabled": false,
            "type": "textfield",
            "input": true,
            "key": '',
            "reorder": false,
            "inputFormat": "plain",
            "encrypted": false,
            "properties": {},
            "customConditional": "",
            "logic": []
          }]
      };
    
      this.state = {
        qno: 0     
      };

    }

    prepareQSet(){

        let qsetJSON = {
            "display": "wizard",        
            "components": []
            };

        let qnum = 0, oSelf = this;

        for(var idx =0; idx < this.qset.length; idx ++){

            let qes = this.prepareQuestion(this.qset[idx]);

            if(qes){
                qnum ++;
                qsetJSON['components'].push({
                    "title": "Question " + qnum,
                    "buttonSettings": {
                        "previous": true,
                        "cancel": true,
                        "next": true
                    },
                    "type": "panel",
                    "key": "q" + qnum,
                    "components": qes
                });                
            }
        }

        return qsetJSON;
    }

    prepareQuestion(q){

        let qes = '';

        try{
            qes = GiftParser.parse(q)[0];
        }catch(e){
            return false;
        }

        let tpl = _.cloneDeep(this.typesTemplate[qes.type]); //== we need a copy of the object

        if(qes.type=='MC'){
            tpl[0]['content'] = qes.stem.text;
            tpl[1]['values'] = _.map(qes.choices, c => {
                return {
                    'value': c.text.text,
                    'label': c.text.text,
                    'shortcut': ''
                };
            });
        }else if(qes.type=='Short'){
          tpl[0]['label']=qes.stem.text;
        }

        return tpl;
    }


    render(){       
        let formJSON = this.prepareQSet();
        console.log(formJSON);
        return <div className="quiz-box"><Form form={formJSON} onSubmit={(data) => console.log(data.data)} /></div>;
    }
    
}

export default Quiz;