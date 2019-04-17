import React, { Component } from "react";
import GiftParser from "gift-pegjs";
import {Form} from 'react-formio';
import _ from 'lodash';
import './Quiz.css';

class Quiz extends Component {
    
    constructor(props) {
      super(props);

      this.qset = [
        `::Q1:: What two people are entombed in Grant's tomb? { ~%-100%No one ~%50%Grant ~%50%Grant's wife ~%-100%Grant's father }`, 
        `::Q2:: What's between orange and green in the spectrum? 
        { =yellow ~red ~blue }`,

        `::Q3:: 1+1 \=2 {T}`,

        `::Q4:: 4+6\=11 {F}`,

        `::Q5:: Two plus {=two =2} equals four.`,

        `::Q6::Who is buried in Grant's tomb in New York City? {
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
                    "label": "Options",   
                    "hideLabel":true,
                    "key": '',
                    "customClass":"quiz-answer",
                    "values": [],
                    //"clearOnHide": true,            
                    "type": "radio",
                    "optionsLabelPosition": "right",   
                    "persistent":true         
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
                "persistent":true,
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
            console.log('Invalid Question=====> ',q, '<=======');
            return false;
        }

        let tpl = _.cloneDeep(this.typesTemplate[qes.type]); //== we need a copy of the object

        if(qes.type=='MC'){
            tpl[0]['content'] = qes.stem.text;

            if(qes.choices && qes.choices[0].weight===null){
                tpl[1]['type']='radio'; //== Single Choice
            }else{
                tpl[1]['type']='selectboxes'; //== Multi Choice
            }

            tpl[1]['values'] = _.map(qes.choices, c => {
                return {
                    'value': c.text.text,
                    'label': c.text.text,
                    'shortcut': '',
                    'isCorrect': c.isCorrect,
                    'weight': c.weight
                };
            });

            tpl[1]['key']=qes.title;

        }else if(qes.type=='Short'){
          tpl[0]['label']=qes.stem.text;
          tpl[0]['key']=qes.title;
        }

        

        return tpl;
    }

    submitFormIO = (e)=>{
        console.log(e.data );
    }
    


    render(){       
        let formJSON = this.prepareQSet();        
        return <div className="quiz-box"><Form form={formJSON} onSubmit={this.submitFormIO} /></div>;
    }
    
}

export default Quiz;