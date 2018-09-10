import React from 'react';
import { BBpmDesigner } from 'b-bpm-designer';

export class BBpmDesignerTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
  }

  generate(context, self) {
    var diagramXML = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">' +
      '<bpmn:process id="Process_1" isExecutable="false">' +
      '<bpmn:startEvent id="StartEvent_1" />' +
      '<bpmn:task id="Task_1" />' +
      '</bpmn:process>' +
      '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
      '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +

      '</bpmndi:BPMNPlane>' +
      '</bpmndi:BPMNDiagram>' +
      '</bpmn:definitions>';
    return [
      {
        text: 'multi',
        component: (
          <div>
            <BBpmDesigner ref={r => (self.designer = r)} context={context} xmlDiagram={diagramXML} />
          </div>
        )
      }
    ];
  }
}
export default BBpmDesignerTestGenerator;
